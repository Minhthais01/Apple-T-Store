using Apple_T_BE.Data;
using Apple_T_BE.Model.Dto;
using Apple_T_BE.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Text;
using Apple_T_BE.Helper;
using Microsoft.EntityFrameworkCore;
using IEmailService = Apple_T_BE.UtilityServices.IEmailService;

namespace Apple_T_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IWebHostEnvironment _env;
        public AccountController(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService, IWebHostEnvironment env)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
            _env = env;
        }

        //Get All Account
        [HttpGet]
        //[Authorize(Policy = "Admin")]
        public async Task<IEnumerable<Account>> Get()
            => await _context.Accounts.ToListAsync();

        [HttpGet("username")]
        public async Task<IActionResult> getAccountID(string username)
        {
            var user = _context.Accounts.FirstOrDefault(a => a.account_username == username);

            if (user == null)
                return NotFound(new { Message = "User not found!" });

            return Ok(user.account_id);
        }

        [HttpGet("user")]
        public async Task<IActionResult> getUserByUsername(string user)
        {
            var account = _context.Accounts.Select(a => new Account
            {
                account_username = a.account_username,
                account_email = a.account_email,
                account_address = a.account_address,
                account_phone = a.account_phone,
                account_birthday = a.account_birthday,
                account_gender = a.account_gender,
                account_avatar = a.account_avatar,
                account_password = a.account_password,
                role = a.role,

            }).Where(a => a.account_username == user).ToList();

            if (account == null)
                return NotFound(new { Message = "User not found!" });

            return Ok(account);
        }

        //Get Account by id
        [HttpGet("id")]
        [ProducesResponseType(typeof(Account), 200)]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var account_id = await _context.Accounts.FindAsync(id);
            return account_id == null ? NotFound(new { Message = "Account with the id " + id + " is not found!!" }) : Ok(account_id);
        }

        //Register account
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] Account account)
        {
            if (account == null)
                return BadRequest();

            if (await CheckUsernameExist(account.account_username))
                return BadRequest(new { Message = "Username already exist!" });

            if (await CheckEmailExist(account.account_email))
                return BadRequest(new { Message = "Email already exist!" });

            var email = CheckEmailValid(account.account_email);
            if (!string.IsNullOrEmpty(email))
                return BadRequest(new { Message = email.ToString() });

            var pwd = CheckPasswordValid(account.account_password);
            if (!string.IsNullOrEmpty(pwd))
                return BadRequest(new { Message = pwd.ToString() });

            var phone = CheckPhoneValid(account.account_phone);
            if (!string.IsNullOrEmpty(phone))
                return BadRequest(new { Message = phone.ToString() });

            if (account.account_confirm_password != account.account_password)
                return BadRequest(new { Message = "Password and Confirm Password is not match!" });

            account.account_avatar = "default-avatar.jpg";
            account.account_password = PasswordHasher.HashPassword(account.account_password);
            account.account_confirm_password = PasswordHasher.HashPassword(account.account_confirm_password);
            account.account_status = account_status.Unlock;
            account.role = account.role;

            await _context.Accounts.AddAsync(account);
            await _context.SaveChangesAsync();

            Cart cart = new Cart();
            cart.account_id = account.account_id;
            await _context.Carts.AddAsync(cart);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Succeed"
            });
        }

        //Change Password
        [HttpPut("check-old-password")]
        public async Task<IActionResult> checkOldPassword(string username, string password)
        {
            var user = await _context.Accounts.FirstOrDefaultAsync(a => a.account_username == username);

            if (user == null)
                return NotFound(new { Message = "User not found!" });

            if (!PasswordHasher.VerifyPassword(password, user.account_password))
                return BadRequest(new { Message = "Password is incorrectly!" });

            return Ok();
        }

        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassword(string newPass, string conPass, string userName)
        {
            var user = await _context.Accounts.FirstOrDefaultAsync(a => a.account_username == userName);

            if (user == null)
                return NotFound(new { Message = "User not found!" });

            var pwd = CheckPasswordValid(newPass);
            if (!string.IsNullOrEmpty(pwd))
                return BadRequest(new { Message = pwd.ToString() });

            if (PasswordHasher.VerifyPassword(newPass, user.account_password))
                return BadRequest(new { Message = "This password already exists before, please enter another password!" });

            if (conPass != newPass)
                return BadRequest(new { Message = "Password and Confirm Password is not match!" });

            user.account_status = account_status.Unlock;
            user.account_password = PasswordHasher.HashPassword(newPass);
            user.account_confirm_password = PasswordHasher.HashPassword(conPass);

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Change Password Succeed"
            });
        }


        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile(Account account)
        {
            if (account == null)
                return BadRequest();

            var acc = await _context.Accounts.FirstOrDefaultAsync(a => a.account_id == account.account_id);

            if (acc == null)
                return NotFound(new { Message = "Account with the id " + account.account_id + " is not found!" });

            if (account.account_username != acc.account_username)
            {
                if (await CheckUsernameExist(account.account_username))
                    return BadRequest(new { Message = "Username already exist!" });
            }

            if (account.account_email != acc.account_email)
            {
                if (await CheckEmailExist(account.account_email))
                    return BadRequest(new { Message = "Email already exist!" });
            }

            var phone = CheckPhoneValid(account.account_phone);
            if (!string.IsNullOrEmpty(phone))
                return BadRequest(new { Message = phone.ToString() });

            acc.account_status = account_status.Unlock;
            acc.account_password = account.account_password;
            acc.account_confirm_password = account.account_password;
            acc.account_username = account.account_username;
            acc.account_address = account.account_address;
            acc.account_email = account.account_email;
            acc.account_avatar = account.account_avatar;

            acc.token = CreateJwt(acc);

            var newAccessToken = acc.token;
            var newRefreshToken = CreateRefreshToken();

            acc.refesh_token = newRefreshToken;
            acc.refesh_token_exprytime = DateTime.Now.AddDays(1);

            //_context.Entry(acc).State = EntityState.Modified;
            //await _context.SaveChangesAsync();

            _context.Entry(acc).CurrentValues.SetValues(account);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                Message = "Profile Updated"
            });
        }

        //Check username that exist or not
        private Task<bool> CheckUsernameExist(string username)
        {
            return _context.Accounts.AnyAsync(x => x.account_username == username);
        }

        //Check email that exist or not
        private Task<bool> CheckEmailExist(string email)
        {
            return _context.Accounts.AnyAsync(x => x.account_email == email);
        }

        private string CheckEmailValid(string email)
        {
            StringBuilder sb = new StringBuilder();
            if (!(Regex.IsMatch(email, "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")))
                sb.Append("Email is invalid" + Environment.NewLine);

            return sb.ToString();
        }

        private string CheckPhoneValid(string phone)
        {
            StringBuilder sb = new StringBuilder();
            if (phone.Length < 0 && phone.Length > 10)
                sb.Append("Phone is invalid!" + Environment.NewLine);
            if (!(Regex.IsMatch(phone, "^[0]\\d{9}$")))
                sb.Append("Please enter phone is number and begin by zero");

            return sb.ToString();
        }

        private string CheckPasswordValid(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
                sb.Append("Minimum password length should be 8" + Environment.NewLine);
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]")
                && Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password should be Alphanumeric" + Environment.NewLine);
            if (!Regex.IsMatch(password, "[<,>,@,!,#,$,$,^,&,*,(,),_,+,\\,//]"))
                sb.Append("Password should contain special chars" + Environment.NewLine);

            return sb.ToString();
        }

        //Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            if (username == null && password == null)
                return BadRequest();
            //if (account == null)
            //    return BadRequest();

            var user = await _context.Accounts.FirstOrDefaultAsync(x => x.account_username == username);

            if (user == null)
                return NotFound(new { Message = "User Not Found!" });

            // var pwd = PasswordHasher.HashPassword(password);

            if (!PasswordHasher.VerifyPassword(password, user.account_password))
                return BadRequest(new { Message = "Password is incorrectly!" });

            if (user.account_status == account_status.Lock)
                return BadRequest(new { Message = "Can't log in, your account is locked!!" });

            user.token = CreateJwt(user);
            var newAccessToken = user.token;
            var newRefreshToken = CreateRefreshToken();
            user.refesh_token = newRefreshToken;
            user.refesh_token_exprytime = DateTime.Now.AddDays(5);
            await _context.SaveChangesAsync();

            return Ok(new TokenApiDto()
            {
                //Token = user.token,
                //Message = "Login Succeed"
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                Message = "Login Successfully"
            });
        }

        private string CreateJwt(Account acc)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("aaaaaaaaaaaaaaaa");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role, acc.role.ToString()),
                new Claim(ClaimTypes.Name, $"{acc.account_username}")
            });

            var credential = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddSeconds(10),
                SigningCredentials = credential
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            return jwtTokenHandler.WriteToken(token);
        }

        private string CreateRefreshToken()
        {
            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var refreshToken = Convert.ToBase64String(tokenBytes);

            var tokenInUser = _context.Accounts.Any(a => a.refesh_token == refreshToken);
            if (tokenInUser)
            {
                return CreateRefreshToken();
            }

            return refreshToken;
        }

        //Update Account
        [HttpPut("BanAccount")]
        //[Authorize(Policy = "Customer")]
        public async Task<IActionResult> LockAccount(int id)
        {
            var account = await _context.Accounts.FindAsync(id);

            if (account == null)
                return NotFound(new { Message = "Account is Not Found!" });

            account.account_status = account_status.Lock;

            _context.Entry(account).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Lock Account Successfully"
            });
        }

        [HttpPut("{account_id}")]
        //[Authorize(Policy = "Customer")]
        public async Task<IActionResult> UnLockAccount(int account_id)
        {
            var account = await _context.Accounts.FindAsync(account_id);

            if (account == null)
                return NotFound(new { Message = "Account is Not Found!" });

            account.account_status = account_status.Unlock;

            _context.Entry(account).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "UnLock Account Successfully"
            });

        }


        private ClaimsPrincipal GetPrincipleFromExpiredToken(string token)
        {
            var key = Encoding.ASCII.GetBytes("veryveryserect..");
            var tokenValidate = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateLifetime = false,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidate, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;

            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("This is Invalid Token");

            return principal;
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(TokenApiDto tokenApiDto)
        {
            if (tokenApiDto == null)
                return BadRequest("Invalid Client Request!");

            string accessToken = tokenApiDto.AccessToken;
            string refreshToken = tokenApiDto.RefreshToken;

            var principal = GetPrincipleFromExpiredToken(accessToken);
            var username = principal.Identity.Name;
            var user = await _context.Accounts.FirstOrDefaultAsync(u => u.account_username == username);

            if (user == null || user.refesh_token != refreshToken || user.refesh_token_exprytime <= DateTime.Now)
                return BadRequest("Invalid Request!");

            var newAccessToken = CreateJwt(user);
            var newRefreshToken = CreateRefreshToken();
            user.refesh_token = newRefreshToken;
            await _context.SaveChangesAsync();

            return Ok(new TokenApiDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
            });
        }


        [HttpPost("send-reset-email/{email}")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var user = _context.Accounts.FirstOrDefault(x => x.account_email == email);
            if (user is null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "email doesn't exist"
                });
            }

            var tokenBytes = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenBytes);
            user.reset_password_token = emailToken;
            user.reset_password_exprytime = DateTime.Now.AddMinutes(15);

            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(email, "Reset Password!!", EmailBody.EmailStringBody(email, emailToken));
            _emailService.SendEmail(emailModel);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                StatusCode = 200,
                Message = "Email Sent!, Please check your email!"
            });
        }



        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPassword resetPassword)
        {
            var newToken = resetPassword.EmailToken.Replace(" ", "+");
            var user = await _context.Accounts.AsNoTracking().FirstOrDefaultAsync(x => x.account_email == resetPassword.Email);
            if (user == null)
            {
                return NotFound(new
                {
                    StatusCode = 404,
                    Message = "Email doesn't exist"
                });
            }

            var tokenCode = user.reset_password_token;
            DateTime emailTokenExpiry = user.reset_password_exprytime;
            if (tokenCode != resetPassword.EmailToken || emailTokenExpiry < DateTime.Now)
            {
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "Invalid Reset Link"
                });
            }

            var pwd = CheckPasswordValid(resetPassword.NewPassword);
            if (!string.IsNullOrEmpty(pwd))
                return BadRequest(new { Message = pwd.ToString() });

            //var password = resetPasswordDto.NewPassword;

            if (PasswordHasher.VerifyPassword(resetPassword.NewPassword, user.account_password))
                return BadRequest(new { Message = "This password already exists before, please enter another password!" });

            user.account_password = PasswordHasher.HashPassword(resetPassword.NewPassword);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                StatusCode = 200,
                Message = "Reset Password Successfully"
            });
        }


        [HttpPost("uploadImage")]
        public async Task<IActionResult> uploadImage()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/Images/" + filename;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                return new JsonResult(filename);
            }
            catch (Exception)
            {
                return BadRequest(new { Message = "Not Succeed" });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> search(string key)
        {
            var account = _context.Accounts.Where(a => a.account_username.Contains(key) || a.role.Contains(key));

            if (account == null)
                return NotFound(new { Message = "Account not found!" });

            return Ok(account);
        }
    }
}
