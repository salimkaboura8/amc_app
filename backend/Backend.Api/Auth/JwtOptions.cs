namespace Backend.Auth;

public class JwtOptions
{
    public string Key { get; set; } = "MYSECRETKEY28122000AMC";
    public string Issuer { get; set; } = "your-app";
    public string Audience { get; set; } = "your-app-clients";
    public int ExpiryMinutes { get; set; } = 120;
}
