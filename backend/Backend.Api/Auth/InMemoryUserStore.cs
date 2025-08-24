using System;
using System.Collections.Generic;

namespace Backend.Auth;

public record AppUser(string Email, string PasswordHash, string[] Roles);

public interface IUserStore
{
    AppUser? FindByEmail(string email);
    bool ValidateCredentials(string email, string password);
}

public class InMemoryUserStore : IUserStore
{
    private readonly Dictionary<string, AppUser> _users;
    private readonly IPasswordHasher _hasher;

    public InMemoryUserStore(IPasswordHasher hasher)
    {
        _hasher = hasher ?? throw new ArgumentNullException(nameof(hasher));

        var admin = new AppUser("admin@example.com", _hasher.Hash("Pass@123"), new[] { "Admin" });
        var user  = new AppUser("user@example.com",  _hasher.Hash("Pass@123"), new[] { "User"  });

        _users = new Dictionary<string, AppUser>(StringComparer.OrdinalIgnoreCase)
        {
            [admin.Email] = admin,
            [user.Email]  = user
        };
    }

    public AppUser? FindByEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return null;
        return _users.TryGetValue(email, out var user) ? user : null;
    }

    public bool ValidateCredentials(string email, string password)
    {
        if (string.IsNullOrWhiteSpace(email) || password is null) return false;
        var user = FindByEmail(email);
        return user is not null && _hasher.Verify(password, user.PasswordHash);
    }
}
