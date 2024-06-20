using Apple_T_BE.Data;
using Apple_T_BE.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Apple_T_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartDetailController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartDetailController(ApplicationDbContext context) => _context = context;

        //Get Cart By Id
        [HttpGet("GetCart")]
        //[Authorize(Policy = "Customer")]
        public async Task<IActionResult> GetCart(int id)
        {
            var cart = _context.Carts.FirstOrDefault(c => c.cart_id == id);

            if (cart == null)
                return BadRequest();

            var ds = _context.Cart_detail
                    .Join(
                        inner: _context.Products,
                        outerKeySelector: c => c.cd_product_id,
                        innerKeySelector: p => p.product_id,
                        resultSelector: (o, i) => new { CartDetail = o, Product = i })
                    .Where(joined => joined.CartDetail.cd_cart_id == cart.cart_id)
                    .Select(joined => new Cart_detail
                    {
                        cd_id = joined.CartDetail.cd_id,
                        cd_cart_id = joined.CartDetail.cd_cart_id,
                        cd_quantity = joined.CartDetail.cd_quantity,
                        product = joined.Product,
                        cd_product_id = joined.Product.product_id,
                        cd_product_image = joined.Product.product_image,
                        cd_product_name = joined.Product.product_name,
                        cd_product_price = joined.Product.product_sell_price
                    })
                    .ToList();

            double? total = 0;

            if (ds.Count() >= 1)
            {
                foreach (var item in ds)
                {
                    total += item.product.product_sell_price * item.cd_quantity;
                }
            }

            return Ok(new
            {
                total,
                ds
            });
        }

        //Add Cart
        [HttpPost]
        public async Task<IActionResult> AddCart(Cart_detail cart_Detail)
        {
            if (cart_Detail == null)
                return BadRequest();

            var cartExist = _context.Cart_detail.FirstOrDefault(cd => cd.cd_product_id == cart_Detail.cd_product_id
            && cd.cd_cart_id == cart_Detail.cd_cart_id);

            var product = await _context.Products.FirstOrDefaultAsync(p => p.product_id == cart_Detail.cd_product_id);

            if (cart_Detail.cd_quantity > product.product_quantity_stock)
                return BadRequest(new { Message = "Product in stock only have " + (product.product_quantity_stock) });

            if (cartExist != null)
            {
                cartExist.cd_quantity += cart_Detail.cd_quantity;

                if (cartExist.cd_quantity > product.product_quantity_stock)
                    return BadRequest(new { Message = "Product in stock only have " + (product.product_quantity_stock) });
               
                _context.Entry(cartExist).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Add Cart Succeed"
                });
            }

            await _context.Cart_detail.AddAsync(cart_Detail);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Add Cart Succeed"
            });
        }


        [HttpPut("plusQty")]
        public async Task<IActionResult> PlusQty(int id)
        {
            var cart = _context.Cart_detail.FirstOrDefault(c => c.cd_id == id);
            var product = await _context.Products.FirstOrDefaultAsync(p => p.product_id == cart.cd_product_id);

            if (cart == null)
                return BadRequest();

            cart.cd_quantity += 1;

            if (cart.cd_quantity > product.product_quantity_stock)
                return BadRequest(new { Message = "Product in stock only have " + (product.product_quantity_stock) });

            _context.Entry(cart).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("minusQty")]
        public async Task<IActionResult> MinusQty(int id)
        {
            var cart = _context.Cart_detail.FirstOrDefault(c => c.cd_id == id);

            if (cart == null)
                return BadRequest();

            cart.cd_quantity -= 1;

            if (cart.cd_quantity.Equals(0))
            {
                _context.Cart_detail.Remove(cart);
                await _context.SaveChangesAsync();
            }

            _context.Entry(cart).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{cd_id}")]
        public async Task<IActionResult> DeleteCart(int cd_id)
        {
            var cart = await _context.Cart_detail.FindAsync(cd_id);

            if (cart == null)
                return BadRequest(new { Message = "Delete Failed!" });

            _context.Cart_detail.Remove(cart);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Delete Cart Succeed"
            });
        }
    }
}
