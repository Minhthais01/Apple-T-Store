using Apple_T_BE.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Neo4jClient.DataAnnotations.Cypher.Functions;
using System.Text.RegularExpressions;
using System.Text;
using System.Globalization;

namespace Apple_T_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public StatisticsController(ApplicationDbContext context) => _context = context;

        [HttpGet("statistic_product")]
        public async Task<IActionResult> statistic_product(string sortOrder = "desc")
        {
            var data = _context.Order_detail
                                .GroupBy(od => od.od_product_id)
                                .Select(od => new
                                {
                                    productName = _context.Products.Where(p => p.product_id == od.Key).Select(p => p.product_name).FirstOrDefault(),
                                    product_brand = _context.Brand.Where(b => b.brand_id == _context.Products.Where(p => p.product_id == od.Key).Select(p => p.p_brand_id).FirstOrDefault()).Select(b => b.brand_name).FirstOrDefault(),
                                    number_sold = _context.Order_detail.Where(o => o.od_product_id == od.Key && o.order.order_status == "Delivering").Sum(o => o.od_quantity),
                                    number_ren = _context.Order_detail.Where(o => o.od_product_id == od.Key && o.order.order_status == "Delivering").Sum(o => o.od_product_price),
                                });
                                if (sortOrder == "desc")
                                    {
                                        data = data.OrderByDescending(item => item.number_sold);
                                    }
                                else if (sortOrder == "asc")
                                     {
                                        data = data.OrderBy(item => item.number_sold);
                                     }

                                var result = await data.ToListAsync();
                                return Ok(result);

        }

        [HttpGet("statistic_product_chart")]
        public async Task<IActionResult> statistic_product_chart()
        {
            var data = _context.Order_detail
                        .GroupBy(od => od.od_product_id)
                        .Select(od => new
                        {
                           productName = _context.Products.Where(p => p.product_id == od.Key).Select(p => p.product_name).FirstOrDefault(),
                           product_brand = _context.Brand.Where(b => b.brand_id == _context.Products.Where(p => p.product_id == od.Key).Select(p => p.p_brand_id).FirstOrDefault()).Select(b => b.brand_name).FirstOrDefault(),
                           number_sold = _context.Order_detail.Where(o => o.od_product_id == od.Key && o.order.order_status == "Delivering").Sum(o => o.od_quantity),
                           number_ren = _context.Order_detail.Where(o => o.od_product_id == od.Key && o.order.order_status == "Delivering").Sum(o => o.od_product_price),
                        }).ToList();
            
                        return Ok(data);
        }

        [HttpGet("statistic_total")]
        public async Task<IActionResult> statistic_total()
        {
            var data = _context.Order_detail
                .GroupBy(od => od.od_order_id)
                .Select(od => new
                {   
                    total_quantity = _context.Orders.Where(o => o.order_status == "Delivering").Sum(o => o.order_quantity),
                    total_revenue = _context.Orders.Where(o => o.order_status == "Delivering").Sum(o => o.order_total_price),
                    total_order = _context.Orders.Count(o => o.order_status == "Delivering")
                }).FirstOrDefault();
            return Ok(data);
        }

        [HttpGet("statistic_product_byMonth")]
        public async Task<IActionResult> statistic_product_byMonth(string fromDate, string toDate)
        {

            DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);

            var data = _context.Order_detail
                        .Where(od => od.order.order_status == "Delivering" && od.order.order_date.Date >= fromDateTime.Date && od.order.order_date.Date <= toDateTime.Date)
                        .GroupBy(od => od.od_product_id)
                        .Select(od => new
                        {
                            productName = _context.Products.Where(p => p.product_id == od.Key).Select(p => p.product_name).FirstOrDefault(),
                            product_brand = _context.Brand.Where(b => b.brand_id == _context.Products.Where(p => p.product_id == od.Key).Select(p => p.p_brand_id).FirstOrDefault()).Select(b => b.brand_name).FirstOrDefault(),
                            number_sold = od.Sum(o => o.od_quantity),
                            number_ren = od.Sum(o => o.od_product_price),
                        }).ToList();

            return Ok(data);
        }

        [HttpGet("statistic_total_byMonth")]
            public async Task<IActionResult> statistic_total_byMonth(string fromDate, string toDate)
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                var data = _context.Orders
                    .Where(o => o.order_date.Date >= fromDateTime.Date && o.order_date.Date <= toDateTime.Date && o.order_status == "Delivering")
                    .Select(o => new
                    {
                        total_quantity = o.order_quantity,
                        total_revenue = o.order_total_price,
                    })
                    .ToList();

                int total_quantity = data.Sum(d => d.total_quantity);
                double total_revenue = data.Sum(d => d.total_revenue);
                int total_order = data.Count;

                var result = new
                {
                    total_quantity,
                    total_revenue,
                    total_order
                };

                return Ok(result);
            }
    }
}
