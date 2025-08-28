using Amc.Auth;
using Amc.Data;
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
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// DbContext
builder.Services.AddDbContext<AppDbContext>(o =>
    o.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// JWT options validation
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

// Controllers
builder.Services.AddControllers();

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


app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();


// Health
app.MapGet("/", () => Results.Ok(new { status = "ok" }));

app.MapControllers();

app.Run();
