using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Apple_T_BE.Model
{
    public class Brand
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int brand_id { get; set; }

        [Required(ErrorMessage = "Please, enter the brand name!")]
        public string brand_name { get; set; }

        [Required(ErrorMessage = "Please, enter the brand email!")]
        public string brand_email { get; set; }

        [Required(ErrorMessage = "Please, enter the brand address!")]
        public string brand_address { get; set; }

        [Required(ErrorMessage = "Please, enter the brand phone!")]
        public string brand_phone { get; set; }

        [Required]
        public string brand_status { get; set; }

        public virtual ICollection<Product>? products { get; set; }
    }


}
