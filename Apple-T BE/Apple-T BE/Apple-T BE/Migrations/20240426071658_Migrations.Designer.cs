﻿// <auto-generated />
using System;
using Apple_T_BE.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace AppleTBE.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240426071658_Migrations")]
    partial class Migrations
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Apple_T_BE.Model.Account", b =>
                {
                    b.Property<int>("account_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("account_id"));

                    b.Property<string>("account_address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("account_avatar")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("account_birthday")
                        .HasColumnType("datetime2");

                    b.Property<string>("account_confirm_password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("account_email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("account_gender")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("account_password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("account_phone")
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<int>("account_status")
                        .HasColumnType("int");

                    b.Property<string>("account_username")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("nvarchar(20)");

                    b.Property<string>("refesh_token")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("refesh_token_exprytime")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("reset_password_exprytime")
                        .HasColumnType("datetime2");

                    b.Property<string>("reset_password_token")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("role")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("token")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("account_id");

                    b.ToTable("Accounts", (string)null);
                });

            modelBuilder.Entity("Apple_T_BE.Model.Brand", b =>
                {
                    b.Property<int>("brand_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("brand_id"));

                    b.Property<string>("brand_address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("brand_email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("brand_name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("brand_phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("brand_status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("brand_id");

                    b.ToTable("Brands", (string)null);
                });

            modelBuilder.Entity("Apple_T_BE.Model.Cart", b =>
                {
                    b.Property<int>("cart_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("cart_id"));

                    b.Property<int>("account_id")
                        .HasColumnType("int");

                    b.HasKey("cart_id");

                    b.HasIndex("account_id")
                        .IsUnique();

                    b.ToTable("Carts", (string)null);
                });

            modelBuilder.Entity("Apple_T_BE.Model.Cart_detail", b =>
                {
                    b.Property<int>("cd_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("cd_id"));

                    b.Property<int>("cd_cart_id")
                        .HasColumnType("int");

                    b.Property<int>("cd_product_id")
                        .HasColumnType("int");

                    b.Property<string>("cd_product_image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("cd_product_name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("cd_product_price")
                        .HasColumnType("float");

                    b.Property<int>("cd_quantity")
                        .HasColumnType("int");

                    b.HasKey("cd_id");

                    b.HasIndex("cd_cart_id");

                    b.HasIndex("cd_product_id");

                    b.ToTable("Cart_details", (string)null);
                });

            modelBuilder.Entity("Apple_T_BE.Model.Images", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<int>("i_product_id")
                        .HasColumnType("int");

                    b.Property<string>("uri")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("id");

                    b.HasIndex("i_product_id");

                    b.ToTable("Images", (string)null);
                });

            modelBuilder.Entity("Apple_T_BE.Model.Order", b =>
                {
                    b.Property<int>("order_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("order_id"));

                    b.Property<string>("account_name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("delivery_date")
                        .HasColumnType("datetime2");

                    b.Property<int>("o_account_id")
                        .HasColumnType("int");

                    b.Property<string>("order_address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("order_date")
                        .HasColumnType("datetime2");

                    b.Property<string>("order_note")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("order_payment")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("order_phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("order_quantity")
                        .HasColumnType("int");

                    b.Property<string>("order_status")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("order_total_price")
                        .HasColumnType("float");

                    b.HasKey("order_id");

                    b.HasIndex("o_account_id");

                    b.ToTable("Orders", (string)null);
                });

            modelBuilder.Entity("Apple_T_BE.Model.Order_detail", b =>
                {
                    b.Property<int>("od_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("od_id"));

                    b.Property<int>("od_order_id")
                        .HasColumnType("int");

                    b.Property<int>("od_product_id")
                        .HasColumnType("int");

                    b.Property<double>("od_product_price")
                        .HasColumnType("float");

                    b.Property<int>("od_quantity")
                        .HasColumnType("int");

                    b.Property<string>("product_image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("product_name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double?>("product_price")
                        .HasColumnType("float");

                    b.HasKey("od_id");

                    b.HasIndex("od_order_id");

                    b.HasIndex("od_product_id");

                    b.ToTable("Order_details", (string)null);
                });

            modelBuilder.Entity("Apple_T_BE.Model.Product", b =>
                {
                    b.Property<int>("product_id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("product_id"));

                    b.Property<string>("brand_name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("p_brand_id")
                        .HasColumnType("int");

                    b.Property<string>("product_description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("product_image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("product_import_date")
                        .HasColumnType("datetime2");

                    b.Property<string>("product_name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("product_original_price")
                        .HasColumnType("float");

                    b.Property<int>("product_quantity_stock")
                        .HasColumnType("int");

                    b.Property<double>("product_sell_price")
                        .HasColumnType("float");

                    b.Property<string>("product_status")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("product_id");

                    b.HasIndex("p_brand_id");

                    b.ToTable("Products", (string)null);
                });

            modelBuilder.Entity("Apple_T_BE.Model.Cart", b =>
                {
                    b.HasOne("Apple_T_BE.Model.Account", "Account")
                        .WithOne("Cart")
                        .HasForeignKey("Apple_T_BE.Model.Cart", "account_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Account");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Cart_detail", b =>
                {
                    b.HasOne("Apple_T_BE.Model.Cart", "cart")
                        .WithMany("Cart_detail")
                        .HasForeignKey("cd_cart_id")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Apple_T_BE.Model.Product", "product")
                        .WithMany("cart_detail")
                        .HasForeignKey("cd_product_id")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("cart");

                    b.Navigation("product");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Images", b =>
                {
                    b.HasOne("Apple_T_BE.Model.Product", "product")
                        .WithMany()
                        .HasForeignKey("i_product_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("product");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Order", b =>
                {
                    b.HasOne("Apple_T_BE.Model.Account", "account")
                        .WithMany("orders")
                        .HasForeignKey("o_account_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("account");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Order_detail", b =>
                {
                    b.HasOne("Apple_T_BE.Model.Order", "order")
                        .WithMany()
                        .HasForeignKey("od_order_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Apple_T_BE.Model.Product", "product")
                        .WithMany("order_details")
                        .HasForeignKey("od_product_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("order");

                    b.Navigation("product");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Product", b =>
                {
                    b.HasOne("Apple_T_BE.Model.Brand", "brand")
                        .WithMany("products")
                        .HasForeignKey("p_brand_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("brand");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Account", b =>
                {
                    b.Navigation("Cart");

                    b.Navigation("orders");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Brand", b =>
                {
                    b.Navigation("products");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Cart", b =>
                {
                    b.Navigation("Cart_detail");
                });

            modelBuilder.Entity("Apple_T_BE.Model.Product", b =>
                {
                    b.Navigation("cart_detail");

                    b.Navigation("order_details");
                });
#pragma warning restore 612, 618
        }
    }
}
