using Apple_T_BE.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Apple_T_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ImageController(ApplicationDbContext context) => _context = context;

        [HttpGet("{product_id}")]
        public async Task<IActionResult> GetImage(int product_id)
        {
            var image = _context.Images.Where(i => i.i_product_id == product_id).ToList();

            if (image == null)
                return NotFound();

            return Ok(image);
        }

        [HttpDelete("{pro_id}")]
        //[Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteImages(int pro_id)
        {
            var image = _context.Images.Where(i => i.i_product_id == pro_id).ToList();

            if (image == null)
                return NotFound();

            for (int i = 0; i < image.Count; i++)
            {
                _context.Images.Remove(image[i]);
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
