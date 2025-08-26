namespace Amc.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = default!;
    public byte[] PasswordHash { get; set; } = default!;
    public byte[] PasswordSalt { get; set; } = default!;
    public string? Role { get; set; } // e.g., "User", "Admin"
}
