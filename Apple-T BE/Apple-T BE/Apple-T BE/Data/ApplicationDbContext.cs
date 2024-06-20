using Apple_T_BE.Model;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Apple_T_BE.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Brand> Brand { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart_detail> Cart_detail { get; set; }
        public DbSet<Order_detail> Order_detail { get; set; }
        public DbSet<Images> Images { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>().ToTable("Accounts");
            modelBuilder.Entity<Cart>().ToTable("Carts");
            modelBuilder.Entity<Brand>().ToTable("Brands");
            modelBuilder.Entity<Order>().ToTable("Orders");
            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<Cart_detail>().ToTable("Cart_details");
            modelBuilder.Entity<Order_detail>().ToTable("Order_details");
            modelBuilder.Entity<Images>().ToTable("Images");

            modelBuilder.Entity<Cart_detail>()
                .HasOne(m => m.cart)
                .WithMany(m => m.Cart_detail)
                .HasForeignKey(m => m.cd_cart_id)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Cart_detail>()
                .HasOne(m => m.product)
                .WithMany(u => u.cart_detail)
                .HasForeignKey(m => m.cd_product_id)
                .OnDelete(DeleteBehavior.NoAction);

        }

    }
}
