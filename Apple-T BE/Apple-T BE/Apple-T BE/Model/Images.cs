using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Apple_T_BE.Model
{
    public class Images
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        //[Required]
        public string uri { get; set; }

        public int i_product_id { get; set; }
        [ForeignKey("i_product_id")]
        public virtual Product? product { get; set; }
    }
}
