using Apple_T_BE.Model;

namespace Apple_T_BE.UtilityServices
{
    public interface IEmailService
    {
        void SendEmail(EmailModel emailModel);
    }
}
