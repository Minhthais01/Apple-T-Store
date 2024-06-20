using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Apple_T_BE.Model
{
    public class Account
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int account_id { get; set; }

        [Required(ErrorMessage = "Please, enter the username!")]
        [StringLength(20, ErrorMessage = "Please, the username smaller than 20 characters!")]
        public string account_username { get; set; }

        [Required(ErrorMessage = "Please, enter the email!")]
        public string account_email { get; set; }

        public string account_password { get; set; }

        public string account_confirm_password { get; set; }

        [StringLength(10)]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be 10 digits")]
        public string? account_phone { get; set; }

        public string? account_address { get; set; }

        public DateTime? account_birthday { get; set; }

        public string? account_gender { get; set; }

        public string? token { get; set; }

        public string? refesh_token { get; set; }

        public DateTime refesh_token_exprytime { get; set; }

        public string? reset_password_token { get; set; }

        public DateTime reset_password_exprytime { get; set; }
        public account_status account_status { get; set; } = account_status.Unlock;
        public string role { get; set; }
        public string? account_avatar { get; set; }

        [InverseProperty("Account")]
        public Cart? Cart { get; set; }
        public virtual ICollection<Order>? orders { get; set; }
    }

    public enum account_status
    {
        Lock, Unlock
    }
    public enum role
    {
        Customer, Manager, Admin
    }
}

