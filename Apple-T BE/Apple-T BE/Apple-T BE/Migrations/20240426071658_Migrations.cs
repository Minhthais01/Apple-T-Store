using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppleTBE.Migrations
{
    /// <inheritdoc />
    public partial class Migrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    accountid = table.Column<int>(name: "account_id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    accountusername = table.Column<string>(name: "account_username", type: "nvarchar(20)", maxLength: 20, nullable: false),
                    accountemail = table.Column<string>(name: "account_email", type: "nvarchar(max)", nullable: false),
                    accountpassword = table.Column<string>(name: "account_password", type: "nvarchar(max)", nullable: false),
                    accountconfirmpassword = table.Column<string>(name: "account_confirm_password", type: "nvarchar(max)", nullable: false),
                    accountphone = table.Column<string>(name: "account_phone", type: "nvarchar(10)", maxLength: 10, nullable: true),
                    accountaddress = table.Column<string>(name: "account_address", type: "nvarchar(max)", nullable: true),
                    accountbirthday = table.Column<DateTime>(name: "account_birthday", type: "datetime2", nullable: true),
                    accountgender = table.Column<string>(name: "account_gender", type: "nvarchar(max)", nullable: true),
                    token = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    refeshtoken = table.Column<string>(name: "refesh_token", type: "nvarchar(max)", nullable: true),
                    refeshtokenexprytime = table.Column<DateTime>(name: "refesh_token_exprytime", type: "datetime2", nullable: false),
                    resetpasswordtoken = table.Column<string>(name: "reset_password_token", type: "nvarchar(max)", nullable: true),
                    resetpasswordexprytime = table.Column<DateTime>(name: "reset_password_exprytime", type: "datetime2", nullable: false),
                    accountstatus = table.Column<int>(name: "account_status", type: "int", nullable: false),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    accountavatar = table.Column<string>(name: "account_avatar", type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.accountid);
                });

            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    brandid = table.Column<int>(name: "brand_id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    brandname = table.Column<string>(name: "brand_name", type: "nvarchar(max)", nullable: false),
                    brandemail = table.Column<string>(name: "brand_email", type: "nvarchar(max)", nullable: false),
                    brandaddress = table.Column<string>(name: "brand_address", type: "nvarchar(max)", nullable: false),
                    brandphone = table.Column<string>(name: "brand_phone", type: "nvarchar(max)", nullable: false),
                    brandstatus = table.Column<string>(name: "brand_status", type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.brandid);
                });

            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    cartid = table.Column<int>(name: "cart_id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    accountid = table.Column<int>(name: "account_id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.cartid);
                    table.ForeignKey(
                        name: "FK_Carts_Accounts_account_id",
                        column: x => x.accountid,
                        principalTable: "Accounts",
                        principalColumn: "account_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    orderid = table.Column<int>(name: "order_id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    orderdate = table.Column<DateTime>(name: "order_date", type: "datetime2", nullable: false),
                    deliverydate = table.Column<DateTime>(name: "delivery_date", type: "datetime2", nullable: true),
                    orderaddress = table.Column<string>(name: "order_address", type: "nvarchar(max)", nullable: false),
                    orderphone = table.Column<string>(name: "order_phone", type: "nvarchar(max)", nullable: false),
                    orderquantity = table.Column<int>(name: "order_quantity", type: "int", nullable: false),
                    ordernote = table.Column<string>(name: "order_note", type: "nvarchar(max)", nullable: true),
                    orderstatus = table.Column<string>(name: "order_status", type: "nvarchar(max)", nullable: true),
                    orderpayment = table.Column<string>(name: "order_payment", type: "nvarchar(max)", nullable: false),
                    ordertotalprice = table.Column<double>(name: "order_total_price", type: "float", nullable: false),
                    oaccountid = table.Column<int>(name: "o_account_id", type: "int", nullable: false),
                    accountname = table.Column<string>(name: "account_name", type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.orderid);
                    table.ForeignKey(
                        name: "FK_Orders_Accounts_o_account_id",
                        column: x => x.oaccountid,
                        principalTable: "Accounts",
                        principalColumn: "account_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    productid = table.Column<int>(name: "product_id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    productname = table.Column<string>(name: "product_name", type: "nvarchar(max)", nullable: false),
                    productquantitystock = table.Column<int>(name: "product_quantity_stock", type: "int", nullable: false),
                    productoriginalprice = table.Column<double>(name: "product_original_price", type: "float", nullable: false),
                    productsellprice = table.Column<double>(name: "product_sell_price", type: "float", nullable: false),
                    productdescription = table.Column<string>(name: "product_description", type: "nvarchar(max)", nullable: true),
                    productimage = table.Column<string>(name: "product_image", type: "nvarchar(max)", nullable: true),
                    productimportdate = table.Column<DateTime>(name: "product_import_date", type: "datetime2", nullable: true),
                    productstatus = table.Column<string>(name: "product_status", type: "nvarchar(max)", nullable: true),
                    pbrandid = table.Column<int>(name: "p_brand_id", type: "int", nullable: false),
                    brandname = table.Column<string>(name: "brand_name", type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.productid);
                    table.ForeignKey(
                        name: "FK_Products_Brands_p_brand_id",
                        column: x => x.pbrandid,
                        principalTable: "Brands",
                        principalColumn: "brand_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cart_details",
                columns: table => new
                {
                    cdid = table.Column<int>(name: "cd_id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cdquantity = table.Column<int>(name: "cd_quantity", type: "int", nullable: false),
                    cdproductimage = table.Column<string>(name: "cd_product_image", type: "nvarchar(max)", nullable: true),
                    cdproductname = table.Column<string>(name: "cd_product_name", type: "nvarchar(max)", nullable: true),
                    cdproductprice = table.Column<double>(name: "cd_product_price", type: "float", nullable: true),
                    cdcartid = table.Column<int>(name: "cd_cart_id", type: "int", nullable: false),
                    cdproductid = table.Column<int>(name: "cd_product_id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cart_details", x => x.cdid);
                    table.ForeignKey(
                        name: "FK_Cart_details_Carts_cd_cart_id",
                        column: x => x.cdcartid,
                        principalTable: "Carts",
                        principalColumn: "cart_id");
                    table.ForeignKey(
                        name: "FK_Cart_details_Products_cd_product_id",
                        column: x => x.cdproductid,
                        principalTable: "Products",
                        principalColumn: "product_id");
                });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    uri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    iproductid = table.Column<int>(name: "i_product_id", type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.id);
                    table.ForeignKey(
                        name: "FK_Images_Products_i_product_id",
                        column: x => x.iproductid,
                        principalTable: "Products",
                        principalColumn: "product_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Order_details",
                columns: table => new
                {
                    odid = table.Column<int>(name: "od_id", type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    odquantity = table.Column<int>(name: "od_quantity", type: "int", nullable: false),
                    odproductprice = table.Column<double>(name: "od_product_price", type: "float", nullable: false),
                    odorderid = table.Column<int>(name: "od_order_id", type: "int", nullable: false),
                    odproductid = table.Column<int>(name: "od_product_id", type: "int", nullable: false),
                    productimage = table.Column<string>(name: "product_image", type: "nvarchar(max)", nullable: true),
                    productname = table.Column<string>(name: "product_name", type: "nvarchar(max)", nullable: true),
                    productprice = table.Column<double>(name: "product_price", type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order_details", x => x.odid);
                    table.ForeignKey(
                        name: "FK_Order_details_Orders_od_order_id",
                        column: x => x.odorderid,
                        principalTable: "Orders",
                        principalColumn: "order_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Order_details_Products_od_product_id",
                        column: x => x.odproductid,
                        principalTable: "Products",
                        principalColumn: "product_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cart_details_cd_cart_id",
                table: "Cart_details",
                column: "cd_cart_id");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_details_cd_product_id",
                table: "Cart_details",
                column: "cd_product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Carts_account_id",
                table: "Carts",
                column: "account_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_i_product_id",
                table: "Images",
                column: "i_product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Order_details_od_order_id",
                table: "Order_details",
                column: "od_order_id");

            migrationBuilder.CreateIndex(
                name: "IX_Order_details_od_product_id",
                table: "Order_details",
                column: "od_product_id");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_o_account_id",
                table: "Orders",
                column: "o_account_id");

            migrationBuilder.CreateIndex(
                name: "IX_Products_p_brand_id",
                table: "Products",
                column: "p_brand_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cart_details");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "Order_details");

            migrationBuilder.DropTable(
                name: "Carts");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Brands");
        }
    }
}
