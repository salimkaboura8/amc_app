using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("Orders");
            entity.HasKey(o => o.Id);

            entity.Property(o => o.FirstName)
                  .IsRequired()
                  .HasMaxLength(64);

            entity.Property(o => o.LastName)
                  .IsRequired()
                  .HasMaxLength(64);

            entity.Property(o => o.PhoneNumber)
                  .IsRequired()
                  .HasMaxLength(32);

            entity.Property(o => o.Date)
                  .HasColumnType("date");

            entity.Property(o => o.NbOfItems)
                  .IsRequired();

            entity.Property(o => o.Price)
                  .HasColumnType("decimal(18,2)");

            entity.Property(o => o.Status)
                  .HasConversion<string>()        // stores as 'EN_COURS' or 'LIVREE'
                  .HasMaxLength(16)
                  .IsRequired();
        });
    }
}
