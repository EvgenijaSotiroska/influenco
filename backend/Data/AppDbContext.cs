using influenco.backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace influenco.backend.Data;

public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Influencer> Influencers => Set<Influencer>();
    public DbSet<Brand> Brands => Set<Brand>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ---- AppUser <-> Influencer / Brand (1:1) ----
        builder.Entity<AppUser>()
            .HasOne(u => u.InfluencerProfile)
            .WithOne(i => i.AppUser)
            .HasForeignKey<Influencer>(i => i.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<AppUser>()
            .HasOne(u => u.BrandProfile)
            .WithOne(b => b.AppUser)
            .HasForeignKey<Brand>(b => b.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        // ---- List<string> Categories stored as comma-separated text ----
        var stringListConverter = new ValueConverter<List<string>, string>(
            v => string.Join(',', v),
            v => v.Length == 0
                ? new List<string>()
                : v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

        var stringListComparer = new ValueComparer<List<string>>(
            (a, b) => a!.SequenceEqual(b!),
            v => v.Aggregate(0, (hash, s) => HashCode.Combine(hash, s.GetHashCode())),
            v => v.ToList());

        builder.Entity<Influencer>()
            .Property(i => i.Categories)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);
    }
}