using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Apple_T_BE.Model
{
    public class Cart
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int cart_id { get; set; }

        public int account_id { get; set; }
        [ForeignKey("account_id")]
        public virtual Account? Account { get; set; }

        public ICollection<Cart_detail> Cart_detail { get; set;}
    }
}
