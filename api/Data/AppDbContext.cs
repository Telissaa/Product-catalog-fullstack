using Microsoft.EntityFrameworkCore;
using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace api.Data
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-Many: Product <-> Category
            modelBuilder.Entity<Product>()
                .HasMany(p => p.Categories)
                .WithMany(c => c.Products)
                .UsingEntity(j => j.ToTable("ProductCategories"));
                
            // Many-to-One: Product -> IdentityUser (creator)
            modelBuilder.Entity<Product>()
                .HasOne<IdentityUser>()
                .WithMany()
                .HasForeignKey(p => p.CreationUserId)
                .OnDelete(DeleteBehavior.NoAction);
                
            // Many-to-One: Comment -> Product
            modelBuilder.Entity<Comment>()
                .HasOne<Product>()
                .WithMany()
                .HasForeignKey(c => c.ProductId)
                .OnDelete(DeleteBehavior.NoAction);
                
            // Many-to-One: Comment -> IdentityUser (creator)
            modelBuilder.Entity<Comment>()
                .HasOne<IdentityUser>()
                .WithMany()
                .HasForeignKey(c => c.CreatorUserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
