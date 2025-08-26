using Amc.Models;
using Microsoft.EntityFrameworkCore;

namespace Amc.Data;

public static class AuthDbExtensions
{
    public static void MapAuthEntities(this ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("Users");
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Username).IsUnique();
            e.Property(x => x.Username).IsRequired().HasMaxLength(64);
            e.Property(x => x.Role).HasMaxLength(32);
        });
    }
}
