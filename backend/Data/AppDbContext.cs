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
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<CampaignApplication> CampaignApplications => Set<CampaignApplication>();
    public DbSet<CollaborationRequest> CollaborationRequests => Set<CollaborationRequest>();
    public DbSet<Deal> Deals => Set<Deal>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Post> Posts => Set<Post>();

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

        // ---- Brand <-> Campaign (1:many) ----
        builder.Entity<Campaign>()
            .HasOne(c => c.Brand)
            .WithMany()
            .HasForeignKey(c => c.BrandId)
            .OnDelete(DeleteBehavior.Cascade);

        // ---- List<string> Categories/Niches/Platforms stored as comma-separated text ----
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

        builder.Entity<Campaign>()
            .Property(c => c.Niches)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);

        builder.Entity<Campaign>()
            .Property(c => c.Platforms)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);

        // ---- Campaign.Status enum stored as string ----
        builder.Entity<Campaign>()
            .Property(c => c.Status)
            .HasConversion<string>();

        // ---- Campaign <-> CampaignApplication (1:many) ----
        builder.Entity<CampaignApplication>()
            .HasOne(a => a.Campaign)
            .WithMany()
            .HasForeignKey(a => a.CampaignId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CampaignApplication>()
            .HasOne(a => a.Influencer)
            .WithMany()
            .HasForeignKey(a => a.InfluencerId)
            .OnDelete(DeleteBehavior.Restrict);

        // One application per influencer per campaign
        builder.Entity<CampaignApplication>()
            .HasIndex(a => new { a.CampaignId, a.InfluencerId })
            .IsUnique();

        builder.Entity<CampaignApplication>()
            .Property(a => a.Status)
            .HasConversion<string>();

        // ---- CollaborationRequest relationships ----
        builder.Entity<CollaborationRequest>()
            .HasOne(r => r.Brand)
            .WithMany()
            .HasForeignKey(r => r.BrandId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<CollaborationRequest>()
            .HasOne(r => r.Influencer)
            .WithMany()
            .HasForeignKey(r => r.InfluencerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<CollaborationRequest>()
            .HasOne(r => r.Campaign)
            .WithMany()
            .HasForeignKey(r => r.CampaignId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<CollaborationRequest>()
            .Property(r => r.Deliverables)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);

        builder.Entity<CollaborationRequest>()
            .Property(r => r.Status)
            .HasConversion<string>();

        builder.Entity<Deal>()
            .HasOne(d => d.Brand)
            .WithMany()
            .HasForeignKey(d => d.BrandId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Deal>()
            .HasOne(d => d.Influencer)
            .WithMany()
            .HasForeignKey(d => d.InfluencerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Deal>()
            .HasOne(d => d.Campaign)
            .WithMany()
            .HasForeignKey(d => d.CampaignId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Deal>()
            .Property(d => d.Deliverables)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);
        
         // ---- Review relationships ----
        builder.Entity<Review>()
            .HasOne(r => r.Brand)
            .WithMany()
            .HasForeignKey(r => r.BrandId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Review>()
            .HasOne(r => r.Influencer)
            .WithMany()
            .HasForeignKey(r => r.InfluencerId)
            .OnDelete(DeleteBehavior.Restrict);

        // One review per brand per influencer — leaving a new review updates the old one instead
        builder.Entity<Review>()
            .HasIndex(r => new { r.BrandId, r.InfluencerId })
            .IsUnique();

        // ---- Post relationships ----
        builder.Entity<Post>()
            .HasOne(p => p.AppUser)
            .WithMany()
            .HasForeignKey(p => p.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // ---- Post relationships ----
        builder.Entity<Post>()
            .HasOne(p => p.AppUser)
            .WithMany()
            .HasForeignKey(p => p.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Post>()
            .Property(p => p.ImageUrls)
            .HasConversion(stringListConverter)
            .Metadata.SetValueComparer(stringListComparer);
    }
}