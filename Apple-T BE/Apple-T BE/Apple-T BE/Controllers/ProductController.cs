using Apple_T_BE.Data;
using Apple_T_BE.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace Apple_T_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        //View All Product
        [HttpGet]
        public async Task<IActionResult> GetAllProduct()
        {
            var lstProduct = _context.Products.Include(p => p.brand).
                Select(p => new Product
                {
                    product_id = p.product_id,
                    product_name = p.product_name,
                    product_quantity_stock = p.product_quantity_stock,
                    product_original_price = p.product_original_price,
                    product_sell_price = p.product_sell_price,
                    product_description = p.product_description,
                    product_import_date = p.product_import_date,
                    product_status = p.product_status,
                    brand = p.brand,
                    brand_name = p.brand.brand_name,
                    product_image = p.product_image

                }).ToList();

            return Ok(lstProduct);
        }

        [HttpGet("GetProductWithStatus")]
        public async Task<IActionResult> GetProductWithStatus()
        {
            var lstProduct = _context.Products.Include(p => p.brand).
                Select(p => new Product
                {
                    product_id = p.product_id,
                    product_name = p.product_name,
                    product_quantity_stock = p.product_quantity_stock,
                    product_original_price = p.product_original_price,
                    product_sell_price = p.product_sell_price,
                    product_description = p.product_description,
                    product_status = p.product_status,
                    p_brand_id = p.p_brand_id,
                    brand_name = p.brand.brand_name,
                    product_image = p.product_image,
                    product_import_date = p.product_import_date,

                }).Where(p => p.product_status == "Yes").ToList();

            return Ok(lstProduct);
        }

        //Get Product By Id
        [HttpGet("{product_id}")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> GetProductById(int product_id)
        {

            var lstProduct = _context.Products.
                Include(p => p.brand).
                Select(p => new Product
                {
                    product_id = p.product_id,
                    product_name = p.product_name,
                    product_quantity_stock = p.product_quantity_stock,
                    product_original_price = p.product_original_price,
                    product_sell_price = p.product_sell_price,
                    product_description = p.product_description,
                    product_status = p.product_status,
                    brand = p.brand,
                    brand_name = p.brand.brand_name,
                    product_image = p.product_image

                }).Where(p => p.product_id == product_id).ToList();

            if (lstProduct == null)
                return NotFound(new { Message = "Product with the id " + product_id + " is not found!" });

            return Ok(lstProduct);
        }

        //Add New Product
        [HttpPost]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> AddNewProduct([FromBody] TempProduct model)
        {
            Product product = model.Product;
            List<Images> images = model.Image;

            if (product == null)
                return BadRequest();

            if (images == null || images.Count == 0)
                return BadRequest();

            var checkInfo = CheckValidateProductInfo(product);
            if (!string.IsNullOrEmpty(checkInfo))
                return BadRequest(new { Message = checkInfo.ToString() });

            product.product_import_date = DateTime.Now;

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            int maxProductId = _context.Products.Max(p => p.product_id);

            foreach (var item in images)
            {
                Images image = new Images();
                image.uri = item.uri;
                image.i_product_id = maxProductId;

                await _context.Images.AddAsync(image);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                Message = "Add Product Succeed"
            });


        }

        private string CheckValidateProductInfo(Product product)
        {
            StringBuilder sp = new StringBuilder();
            Regex proName = new Regex("^[a-zA-Z]");
            Regex proQuantity = new Regex("^[0-9]");

            Match matchName = proName.Match(product.product_name);
            Match matchQuantity = proQuantity.Match(product.product_quantity_stock.ToString());
            Match matchOPrice = proQuantity.Match(product.product_original_price.ToString());
            Match matchSPrice = proQuantity.Match(product.product_sell_price.ToString());

            if (!matchName.Success)
                sp.Append("The product name must begin by a word" + Environment.NewLine);
            if (!matchQuantity.Success)
                sp.Append("The quantity must be an integer number!" + Environment.NewLine);
            if (!matchOPrice.Success)
                sp.Append("The original price must be a positive number!" + Environment.NewLine);
            if (!matchSPrice.Success)
                sp.Append("The sell price must be a positive number!" + Environment.NewLine);

            return sp.ToString();
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

        //Update Product By Id
        [HttpPut]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> UpdateProduct(Product product)
        {
            if (product == null)
                return BadRequest();

            if (product.product_id != product.product_id)
                return NotFound(new { Message = "Product with the id " + product.product_id + " is not found!" });

            var checkInfo = CheckValidateProductInfo(product);
            if (!string.IsNullOrEmpty(checkInfo))
                return BadRequest(new { Messgae = checkInfo.ToString() });

            product.product_import_date = DateTime.Now;

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Update Product Succeed"
            });
        }

        //Delete Product By Id
        [HttpDelete("{product_id}")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteProduct(int product_id)
        {
            var product = await _context.Products.FindAsync(product_id);
            if (product == null)
                return NotFound(new { Message = "Product with the id " + product_id + " is not found!" });

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Delete Product Succeed"
            });
        }

        [HttpGet("search")]
        public async Task<IActionResult> search(string key)
        {
            var product = _context.Products.Where(p => p.product_name.Contains(key) || p.product_status.Equals(key)).ToList();

            if (product == null)
                return NotFound(new { Message = "Product not found!" });

            return Ok(product);
        }
    }
}
