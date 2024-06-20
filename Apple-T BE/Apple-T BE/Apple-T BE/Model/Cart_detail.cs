using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Apple_T_BE.Model
{
    public class Cart_detail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int cd_id { get; set; }
        [Required]
        public int cd_quantity { get; set; } = 1;

        public string? cd_product_image { get; set; }
        public string? cd_product_name { get; set; }
        public double? cd_product_price { get; set; }

        public int cd_cart_id { get; set; }
        [ForeignKey("cd_cart_id")]
        public virtual Cart? cart { get; set; }

        public int cd_product_id { get; set; }
        [ForeignKey("cd_product_id")]
        public virtual Product? product { get; set; }
    }
}
