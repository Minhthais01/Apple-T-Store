using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace Apple_T_BE.Model
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int product_id { get; set; }

        [Required(ErrorMessage = "Please, enter product name!")]
        public string product_name { get; set; }

        [Required]
        public int product_quantity_stock { get; set; }

        [Required]
        public double product_original_price { get; set; }

        [Required]
        public double product_sell_price { get; set; }

        public string? product_description { get; set; }
        public string? product_image { get; set; }

        public DateTime? product_import_date { get; set; }

        public string? product_status { get; set; }

        public int p_brand_id { get; set; }
        [ForeignKey("p_brand_id")]
        public virtual Brand? brand { get; set; }
        public string? brand_name { get; set; }
        public virtual ICollection<Order_detail>? order_details { get; set; }
        public virtual ICollection<Cart_detail>? cart_detail { get; set; }
    }
}

