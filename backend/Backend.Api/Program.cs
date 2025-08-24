using System.Security.Claims;
using Backend.Auth;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// CORS
const string FrontendOrigin = "FrontendOrigin";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendOrigin, policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// DbContext
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// JWT options from configuration (with validation)
var jwtOptions = new JwtOptions();
builder.Configuration.GetSection("Jwt").Bind(jwtOptions);
if (string.IsNullOrWhiteSpace(jwtOptions.Key))
    throw new InvalidOperationException("Jwt:Key is missing. Configure a non-empty secret key.");
builder.Services.AddSingleton(jwtOptions);

// Auth services
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddSingleton<IUserStore, InMemoryUserStore>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
      options.RequireHttpsMetadata = false;
      options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
      {
          ValidateIssuer = true,
          ValidIssuer = builder.Configuration["Jwt:Issuer"],      // string
          ValidateAudience = true,
          ValidAudience = builder.Configuration["Jwt:Audience"],  // string
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
              System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
          ValidateLifetime = true,
          ClockSkew = TimeSpan.FromMinutes(1)
      };
  });


builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware order
app.UseCors(FrontendOrigin);

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

// Health
app.MapGet("/", () => Results.Ok(new { status = "ok" }));

app.MapPost("/auth/login", (LoginRequest req, IUserStore users, IJwtTokenService jwt) =>
{
    if (req is null || string.IsNullOrWhiteSpace(req.Email) || req.Password is null)
        return Results.BadRequest(new { error = "Email and password are required." });

    if (!users.ValidateCredentials(req.Email, req.Password))
        return Results.Unauthorized();

    var user = users.FindByEmail(req.Email)!;
    var claims = user.Roles.Select(r => new Claim(ClaimTypes.Role, r));
    var token = jwt.CreateToken(user.Email, claims);
    return Results.Ok(new LoginResponse(token));
})
.WithName("Login")
.WithTags("Auth");


// Orders (protected)
app.MapPost("/orders", async (AppDbContext db, Order order) =>
{
    db.Orders.Add(order);
    await db.SaveChangesAsync();
    return Results.Created($"/orders/{order.Id}", order);
})
.WithName("CreateOrder")
.WithTags("Orders")
.RequireAuthorization();

app.MapGet("/orders", async (AppDbContext db) =>
{
    var orders = await db.Orders.AsNoTracking().ToListAsync();
    return Results.Ok(orders);
})
.WithName("GetOrders")
.WithTags("Orders")
.RequireAuthorization();

app.MapGet("/orders/{id:int}", async (int id, AppDbContext db) =>
{
    var order = await db.Orders.FindAsync(id);
    return order is null ? Results.NotFound() : Results.Ok(order);
})
.WithName("GetOrderById")
.WithTags("Orders")
.RequireAuthorization();

app.MapPut("/orders/{id:int}", async (int id, AppDbContext db, Order input) =>
{
    var order = await db.Orders.FindAsync(id);
    if (order is null) return Results.NotFound();

    order.Number = input.Number;
    order.Total = input.Total;

    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("UpdateOrder")
.WithTags("Orders")
.RequireAuthorization();

app.MapDelete("/orders/{id:int}", async (int id, AppDbContext db) =>
{
    var order = await db.Orders.FindAsync(id);
    if (order is null) return Results.NotFound();

    db.Orders.Remove(order);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteOrder")
.WithTags("Orders")
.RequireAuthorization();

app.Run();