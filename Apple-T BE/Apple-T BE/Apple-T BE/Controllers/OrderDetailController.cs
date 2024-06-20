using Apple_T_BE.Data;
using Apple_T_BE.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Apple_T_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("view_detail")]
        public async Task<IActionResult> ViewOrderDetail(int id)
        {
            var lstOrderDetail = _context.Order_detail.Include(o => o.order).
                Include(o => o.product).
                Select(p => new 
                {
                    od_id = p.od_id,
                    od_quantity = p.od_quantity,
                    od_product_id = p.od_product_id,
                    od_order_id = p.od_order_id,
                    product_image = p.product.product_image,
                    product_name = p.product.product_name,
                    product_price = p.od_product_price,
                    brand_name = _context.Brand
                    .Where(b => b.brand_id == p.product.p_brand_id)
                    .Select(b => b.brand_name)
                    .FirstOrDefault()
                }).Where(o => o.od_order_id == id).ToList();

            return Ok(lstOrderDetail);
        }
    }
}
