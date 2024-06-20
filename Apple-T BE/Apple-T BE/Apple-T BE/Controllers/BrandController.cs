using Apple_T_BE.Data;
using Apple_T_BE.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Text;

namespace Apple_T_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BrandController(ApplicationDbContext context) => _context = context;

        [HttpGet("get_brand")]
        public async Task<IEnumerable<Brand>> Get()
            => await _context.Brand.ToListAsync();

        [HttpGet("brand_name")]
        public async Task<IActionResult> getIdSupplier(string brand_name)
        {
            var obj = _context.Brand.FirstOrDefault(c => c.brand_name == brand_name);

            if (obj == null)
                return NotFound(new { Message = "Brand is not found!" });

            return Ok(obj.brand_id);
        }

        [HttpGet("{brand_id}")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetSupplierById(int brand_id)
        {
            var brand = await _context.Brand.FindAsync(brand_id);
            return brand == null ? NotFound(new { Message = "Brand with the id " + brand_id + " is not found!!" }) : Ok(brand);
        }

        // Add Brand
        [HttpPost("add_brand")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> AddBrand(Brand brand)
        {
            if (brand == null)
                return BadRequest();

            if (await checkExistBrand(brand.brand_name))
                return BadRequest(new { Message = "Brand already exist!" });

            if (await CheckEmailExist(brand.brand_email))
                return BadRequest(new { Message = "Email already exist!" });

            var email = CheckEmailValid(brand.brand_email);
            if (!string.IsNullOrEmpty(email))
                return BadRequest(new { Message = email.ToString() });

            var phone = CheckPhoneValid(brand.brand_phone);
            if (!string.IsNullOrEmpty(phone))
                return BadRequest(new { Message = phone.ToString() });

            await _context.Brand.AddAsync(brand);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Add Brand Succeed"
            });
        }

        [HttpGet("FindProductByBrand")]
        public async Task<IActionResult> FindProductByBrand(string brandKey)
        {
            var lstProduct = _context.Products.Include(p => p.brand).
                Select(p => new
                {
                    product_id = p.product_id,
                    product_name = p.product_name,
                    product_quantity_stock = p.product_quantity_stock,
                    product_original_price = p.product_original_price,
                    product_sell_price = p.product_sell_price,
                    product_description = p.product_description,
                    product_status = p.product_status,
                    brand_name = p.brand.brand_name,
                    product_image = p.product_image,
                    product_import_date = p.product_import_date,

                }).Where(p => p.brand_name.Contains(brandKey) && p.product_quantity_stock > 0)
                .GroupBy(p => p.product_name)
                .Select(g => g.First())
                .ToList();

            if (lstProduct.Count == 0)
                return NotFound(new { Message = "Product with brand name " + brandKey + " is out of stock!" });

            return Ok(lstProduct);
        }


        private Task<bool> checkExistBrand(string brand_name)
        {
            return _context.Brand.AnyAsync(s => s.brand_name == brand_name);
        }

        private Task<bool> CheckEmailExist(string email)
        {
            return _context.Brand.AnyAsync(s => s.brand_email == email);
        }

        private string CheckEmailValid(string email)
        {
            StringBuilder sb = new StringBuilder();
            if (!(Regex.IsMatch(email, "^[\\w\\d]+@gre+\\.ac\\.uk$")
                || Regex.IsMatch(email, "^([a-zA-z0-9]+@gmail+\\.[a-zA-Z]{2,})$")
                || Regex.IsMatch(email, "^([a-zA-z0-9]+@fpt+\\.edu+\\.vn)$")))
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


        //Update Brand
        [HttpPut]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateBrand(Brand brand)
        {
            if (brand == null)
                return BadRequest();

            var bra = await _context.Brand.FirstOrDefaultAsync(s => s.brand_id == brand.brand_id);

            if (bra == null)
                return NotFound(new { Message = "Brand with the id " + brand.brand_id + " is not found!" });

            if (brand.brand_name != bra.brand_name)
            {
                if (await checkExistBrand(brand.brand_name))
                    return BadRequest(new { Message = "Brand already exist!" });
            }

            if (brand.brand_email != bra.brand_email)
            {
                if (await CheckEmailExist(brand.brand_email))
                    return BadRequest(new { Message = "Email already exist!" });
            }

            var email = CheckEmailValid(brand.brand_email);
            if (!string.IsNullOrEmpty(email))
                return BadRequest(new { Message = email.ToString() });

            var phone = CheckPhoneValid(brand.brand_phone);
            if (!string.IsNullOrEmpty(phone))
                return BadRequest(new { Message = phone.ToString() });

            //_context.Entry(supplier).State = EntityState.Modified;
            _context.Entry(bra).CurrentValues.SetValues(brand);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Update Brand Succeed"
            });
        }

        // Delete Brand
        [HttpDelete("{brand_id}")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteBrand(int brand_id)
        {
            var brand = await _context.Brand.FindAsync(brand_id);
            if (brand == null)
                return NotFound(new { Message = "Brand with id " + brand_id + " is not found!" });

            _context.Brand.Remove(brand);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Delete Brand Succeed"
            });
        }


        [HttpGet("search")]
        public async Task<IActionResult> search(string key)
        {
            var brand = _context.Brand.Where(s => s.brand_name.Contains(key) || s.brand_status.Contains(key)).ToList();

            if (brand == null)
                return NotFound(new { Message = "Brand not found!" });

            return Ok(brand);
        }


    }
}
