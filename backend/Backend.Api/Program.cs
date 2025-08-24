using System.Security.Claims;
using Backend.Auth;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

// DbContext (SQLite)
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// JWT options from configuration (with validation)
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32)
    throw new InvalidOperationException("Jwt:Key must be at least 32 bytes (e.g., 32+ ASCII chars).");

var jwtOptions = new JwtOptions
{
    Key = jwtKey!,
    Issuer = builder.Configuration["Jwt:Issuer"] ?? "your-app",
    Audience = builder.Configuration["Jwt:Audience"] ?? "your-app-clients",
    ExpiryMinutes = int.TryParse(builder.Configuration["Jwt:ExpiryMinutes"], out var mins) ? mins : 120
};
builder.Services.AddSingleton(jwtOptions);

// Auth services
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddSingleton<IUserStore, InMemoryUserStore>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

// Authentication/Authorization
builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
      options.RequireHttpsMetadata = false;
      options.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuer = true,
          ValidIssuer = jwtOptions.Issuer,
          ValidateAudience = true,
          ValidAudience = jwtOptions.Audience,
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
          ValidateLifetime = true,
          ClockSkew = TimeSpan.FromMinutes(1)
      };
  });

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}


app.UseCors(FrontendOrigin);

app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

// Health
app.MapGet("/", () => Results.Ok(new { status = "ok" }));

// Auth (email/password)
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
app.MapPost("/orders", async (AppDbContext db, CreateOrderRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.FirstName) ||
        string.IsNullOrWhiteSpace(req.LastName) ||
        string.IsNullOrWhiteSpace(req.PhoneNumber) ||
        req.NbOfItems <= 0 ||
        req.Date == default)
    {
        return Results.BadRequest(new { error = "Missing or invalid fields." });
    }

    var order = new Order
    {
        FirstName = req.FirstName,
        LastName = req.LastName,
        PhoneNumber = req.PhoneNumber,
        Date = req.Date,
        NbOfItems = req.NbOfItems,
        Price = Math.Max(0m, req.NbOfItems * 4.99m),
        Status = OrderStatus.EN_COURS
    };

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

    order.FirstName = input.FirstName;
    order.LastName = input.LastName;
    order.PhoneNumber = input.PhoneNumber;
    order.Date = input.Date;
    order.NbOfItems = input.NbOfItems;
    order.Price = input.Price;
    order.Status = input.Status;

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
