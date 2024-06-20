using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Apple_T_BE.Model
{
    public class Order_detail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int od_id { get; set; }
        [Required]
        public int od_quantity { get; set; }

        [Required]
        public double od_product_price { get; set; }

        public int od_order_id { get; set; }
        [ForeignKey("od_order_id")]
        public virtual Order? order { get; set; }

        public int od_product_id { get; set; }
        [ForeignKey("od_product_id")]
        public virtual Product? product { get; set; }
        public string? product_image { get; set; }
        public string? product_name { get; set; }
        public double? product_price { get; set; }
    }
}
