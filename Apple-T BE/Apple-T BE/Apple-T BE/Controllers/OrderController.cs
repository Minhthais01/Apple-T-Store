using Apple_T_BE.Data;
using Apple_T_BE.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Apple_T_BE.Helper;
using IEmailService = Apple_T_BE.UtilityServices.IEmailService;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Apple_T_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public OrderController(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllOrder()
        {
            var lstOrder = _context.Orders.Include(o => o.account).
                Select(p => new Order
                {
                    order_id = p.order_id,
                    order_date = p.order_date,
                    delivery_date = p.delivery_date,
                    order_address = p.order_address,
                    order_phone = p.order_phone,
                    order_quantity = p.order_quantity,
                    order_note = p.order_note,
                    order_status = p.order_status,
                    o_account_id = p.o_account_id,
                    account_name = p.account.account_username,
                    order_total_price = p.order_total_price,
                    order_payment = p.order_payment

                }).ToList();

            return Ok(lstOrder);
        }

        [HttpGet("search")]
        public async Task<IActionResult> search(string key)
        {
            var result = _context.Orders
                .Include(o => o.account)
                .Where(p => p.order_status.Equals(key)).
                 Select(p => new Order
                 {
                     order_id = p.order_id,
                     order_date = p.order_date,
                     delivery_date = p.delivery_date,
                     order_address = p.order_address,
                     order_phone = p.order_phone,
                     order_quantity = p.order_quantity,
                     order_note = p.order_note,
                     order_status = p.order_status,
                     o_account_id = p.o_account_id,
                     account_name = p.account.account_username,
                     order_total_price = p.order_total_price,
                     order_payment = p.order_payment

                 }).ToList();

            if (result == null)
                return NotFound(new { Message = "Order is not found!" });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> ProcessOrder([FromBody] CartAndOrder model)
        {
            List<Cart_detail> cart = model.Cart;
            Order order = model.Order;

            if (order == null || cart == null || cart.Count == 0)
                return BadRequest();

            var cart_id = 0;

            var qty = 0;

            foreach (var item in cart)
            {
                qty += item.cd_quantity;
                var product = await _context.Products.FirstOrDefaultAsync(p => p.product_id == item.cd_product_id);

                if (item.cd_quantity > product.product_quantity_stock)
                    return BadRequest(new { Message = "Product named " + product.product_name + " is out of stock!" });

                cart_id = item.cd_cart_id;
            }

            var phone = CheckPhoneValid(order.order_phone);
            if (!string.IsNullOrEmpty(phone))
                return BadRequest(new { Message = phone.ToString() });

            order.order_date = DateTime.Now;
            order.order_address = order.order_address?.ToString();
            order.order_phone = order.order_phone?.ToString();
            order.order_quantity = qty;
            order.order_note = order.order_note?.ToString();
            order.order_payment = order.order_payment?.ToString();
            order.order_status = "Pending";
            order.o_account_id = cart_id;
            order.order_total_price = order.order_total_price;

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            foreach (var cartDetail in cart)
            {
                var price = _context.Products
                    .Where(p => p.product_id == cartDetail.cd_product_id)
                    .Select(p => p.product_sell_price).FirstOrDefault();
                Order_detail order_Detail = new Order_detail
                {
                    od_quantity = cartDetail.cd_quantity,
                    od_order_id = order.order_id,
                    od_product_id = cartDetail.cd_product_id,
                    od_product_price = (cartDetail.cd_quantity * price)
                };

                _context.Order_detail.Add(order_Detail);
                await _context.SaveChangesAsync();

                var product = await _context.Products.FirstOrDefaultAsync(p => p.product_id == cartDetail.cd_product_id);

                if (product == null)
                    return BadRequest();

                product.product_quantity_stock -= cartDetail.cd_quantity;

                if (product.product_quantity_stock.Equals(0))
                {
                    product.product_status = "No";
                    _context.Entry(product).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                }

                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            var cartDetails = _context.Cart_detail
                .Where(cd => cd.cd_cart_id == cart_id)
                .ToList();

            foreach(var cd in cartDetails)
            {
                _context.Cart_detail.Remove(cd);
                _context.SaveChanges();
            }

            var getOrderId = _context.Orders.Max(o => o.order_id);

            var getSendEmail = _context.Accounts
             .Where(a => a.role.Equals("Admin"))
             .Select(a => a.account_email)
             .FirstOrDefault();

            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(getSendEmail, "Order Notification", EmailBody.NewOrderEmail(getOrderId));
            _emailService.SendEmail(emailModel);

            return Ok(new
            {
                Message = "Order Success"
            });
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

        [HttpPut("ConfirmOrder")]
        public async Task<IActionResult> ConfirmOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return NotFound(new { Message = "Order is Not Found!" });

            order.delivery_date = DateTime.Now;
            order.order_status = "Delivering";

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var getSendEmail = _context.Accounts
             .Where(a => a.account_id == order.o_account_id)
             .Select(a => a.account_email)
             .FirstOrDefault();

            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(getSendEmail, "Order Notification", EmailBody.AdminConfirmEmail(id));
            _emailService.SendEmail(emailModel);

            return Ok(new
            {
                Message = "Confirm Order Succeed"
            });
        }





        [HttpGet("search_OrderHistory")]
        public async Task<IActionResult> search_Order_History(string username, string key)
        {
            if (string.IsNullOrEmpty(username)) 
                return BadRequest();

            var accountId = await _context.Accounts
                .Where(a => a.account_username.Equals(username))
                .Select(a => a.account_id)
                .FirstOrDefaultAsync();

            if (accountId == null)
                return BadRequest();

            var orders = await _context.Orders
                .Include(o => o.account)
                .Where(o => o.o_account_id.Equals(accountId) && o.order_status.Equals(key)) 
                .Select(o => new
                {
                    order_id = o.order_id,
                    order_date = o.order_date,
                    order_address = o.order_address,
                    order_phone = o.order_phone,
                    order_quantity = o.order_quantity,
                    order_status = o.order_status,
                    delivery = o.delivery_date,
                    order_note = o.order_note,
                    order_total_price = o.order_total_price,
                    order_payment = o.order_payment,
                })
                .ToListAsync();

            if (orders == null)
                return NotFound(new { Message = "Order is not found!" });


            return Ok(orders);
        }


        [HttpGet("get_order_history")]
        //[Authorize(Policy = "Customer")]
        public async Task<IActionResult> GetOrderHistory(string username)
        {
            if (username == null)
                return BadRequest();

            var accountId = _context.Accounts
                .Where(a => a.account_username.Equals(username))
                .Select(a => a.account_id)
                .FirstOrDefault();

            if (accountId == null)
                return BadRequest();

            var orders = _context.Orders
                .Include(o => o.account)
                .Where(o => o.o_account_id.Equals(accountId))
                .Select(o => new
                {
                    order_id = o.order_id,
                    order_date = o.order_date,
                    order_address = o.order_address,
                    order_phone = o.order_phone,
                    order_quantity = o.order_quantity,
                    order_status = o.order_status,
                    delivery = o.delivery_date,
                    order_note = o.order_note,
                    order_total_price = o.order_total_price,
                    order_payment = o.order_payment
                })
                .ToList();

            List<object> orderObj = new List<object>();

            foreach (var order in orders)
            {
                var lstOrderDetail = _context.Order_detail.Include(o => o.order).
                Include(o => o.product).
                Select(p => new
                {
                    od_order_id = p.od_order_id,
                    //od_id = order.order_id,
                    //od_quantity = order.order_quantity,
                    //product_image = p.product.product_image,
                    //product_name = p.product.product_name,
                    //product_price = p.product.product_sell_price,
                    //delivery_date = order.delivery,
                    //status = order.order_status,
                    //brand_name = _context.Brand
                    //.Where(b => b.brand_id == p.product.p_brand_id)
                    //.Select(b => b.brand_name)
                    //.FirstOrDefault()
                    order_id = order.order_id,
                    order_date = order.order_date,
                    order_address = order.order_address,
                    order_phone = order.order_phone,
                    order_quantity = order.order_quantity,
                    order_status = order.order_status,
                    delivery = order.delivery,
                    order_note = order.order_note,
                    order_total_price = order.order_total_price,
                    order_payment = order.order_payment,
                }).Where(o => o.od_order_id == order.order_id).FirstOrDefault();

                orderObj.Add(lstOrderDetail);
            }

            return Ok(orderObj);
        }



        //[HttpGet("get_order_history")]
        ////[Authorize(Policy = "Customer")]
        //public async Task<IActionResult> GetOrderHistory(string username)
        //{
        //    if (string.IsNullOrEmpty(username))
        //        return BadRequest();

        //    var accountId = await _context.Accounts
        //        .Where(a => a.account_username.Equals(username))
        //        .Select(a => a.account_id)
        //        .FirstOrDefaultAsync();

        //    if (accountId == null)
        //        return BadRequest();

        //    var orders = await _context.Orders
        //    .Include(o => o.account)
        //        .Select(o => new
        //        {
        //            order_id = o.order_id,
        //            order_date = o.order_date,
        //            order_address = o.order_address,
        //            order_phone = o.order_phone,
        //            order_quantity = o.order_quantity,
        //            order_status = o.order_status,
        //            delivery = o.delivery_date,
        //            order_note = o.order_note,
        //            order_total_price = o.order_total_price,
        //            order_payment = o.order_payment,
        //        })
        //        .ToListAsync();

        //    return Ok(orders);
        //}



        [HttpPut("CancelOrder")]
        //[Authorize(Policy = "Customer")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return NotFound(new { Message = "Order is Not Found!" });

            order.delivery_date = DateTime.Now;
            order.order_status = "Canceled";

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var orderdetail = _context.Order_detail
                .Where(od => od.od_order_id == id)
                .ToList();

            foreach(var od in orderdetail)
            {
                var product = _context.Products
                    .Where(p => p.product_id == od.od_product_id)
                    .FirstOrDefault();

                product.product_quantity_stock += od.od_quantity;

                _context.Products.Entry(product).State = EntityState.Modified;
                _context.SaveChanges();
            }



            var getSendEmail = _context.Accounts
             .Where(a => a.account_id == order.o_account_id)
             .Select(a => a.account_email)
             .FirstOrDefault();

            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(getSendEmail, "Order Notification", EmailBody.AdminCancelEmail(id));
            _emailService.SendEmail(emailModel);

            return Ok(new
            {
               getSend_Email = getSendEmail,
                Message = "Cancel Order Succeed"

            });
        }


        [HttpPut("Cus_CancelOrder")]
        //[Authorize(Policy = "Customer")]
        public async Task<IActionResult> Cus_CancelOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
                return NotFound(new { Message = "Order is Not Found!" });

            order.delivery_date = DateTime.Now;
            order.order_status = "Canceled";

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            var orderdetail = _context.Order_detail
                .Where(od => od.od_order_id == id)
                .ToList();

            foreach (var od in orderdetail)
            {
                var product = _context.Products
                    .Where(p => p.product_id == od.od_product_id)
                    .FirstOrDefault();

                product.product_quantity_stock += od.od_quantity;

                _context.Products.Entry(product).State = EntityState.Modified;
                _context.SaveChanges();
            }



            var getSendEmail = _context.Accounts
             .Where(a => a.role.Equals("Admin"))
             .Select(a => a.account_email)
             .FirstOrDefault();

            //var getSendEmail = _context.Accounts
            // .Where(a => a.role.Equals("Admin"))
            // .Select(a => a.account_email)
            // .FirstOrDefault();

            string from = _configuration["EmailSettings:From"];
            var emailModel = new EmailModel(getSendEmail, "Order Notification", EmailBody.CusCancelEmail(id));
            _emailService.SendEmail(emailModel);

            return Ok(new
            {
                getSend_Email = getSendEmail,
                Message = "Cancel Order Succeed"

            });
        }
    }
}
