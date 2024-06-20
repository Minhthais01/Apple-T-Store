using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Apple_T_BE.Model
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int order_id { get; set; }

        [Required]
        public DateTime order_date { get; set; } = DateTime.Now;
        public DateTime? delivery_date { get; set; } = null;

        [Required(ErrorMessage = "Please, enter the your address!")]
        public string order_address { get; set; }

        [Required(ErrorMessage = "Please, enter the your phone!")]
        public string order_phone { get; set; }

        [Required]
        public int order_quantity { get; set; }
        public string? order_note { get; set; }

        public string? order_status { get; set; }

        [Required]
        public string order_payment { get; set; }

        [Required]
        public double order_total_price { get; set; }
        public int o_account_id { get; set; }
        [ForeignKey("o_account_id")]
        public virtual Account? account { get; set; }
        public string? account_name { get; set; }
    }
}
