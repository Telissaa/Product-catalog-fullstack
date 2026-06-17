using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using api.Models;
using api.Dtos.Products;

namespace api.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly Data.AppDbContext _context;

        public ProductController(Data.AppDbContext context)
        {
            _context = context;
        }
        [HttpGet] //Download all products
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Products
                .Where(p => !p.IsDeleted)
                .Include(p => p.Categories)
                .ToListAsync();

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                CreationDate = p.CreationDate,
                CreationUserId = p.CreationUserId ?? string.Empty,
                ImageUrl = p.ImageUrl,
                Categories = p.Categories.Select(c => c.Name).ToList()
            });

            return Ok(productDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Where(p => !p.IsDeleted && p.Id == id)
                .Include(p => p.Categories)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            var productDto = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                CreationDate = product.CreationDate,
                CreationUserId = product.CreationUserId ?? string.Empty,
                ImageUrl = product.ImageUrl,
                Categories = [.. product.Categories.Select(c => c.Name)]
            };

            return Ok(productDto);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto productDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(new { message = "Nie rozpoznano użytkownika. Zaloguj się ponownie." });
            }

            var categories = new List<Category>();
            if (productDto.CategoryIds.Any())
            {
                categories = await _context.Categories
                    .Where(c => productDto.CategoryIds.Contains(c.Id))
                    .ToListAsync();

                if (categories.Count != productDto.CategoryIds.Distinct().Count())
                {
                    return BadRequest(new { message = "Niektóre kategorie są nieprawidłowe." });
                }
            }

            var product = new Product
            {
                Title = productDto.Title,
                Description = productDto.Description,
                CreationDate = DateTime.UtcNow,
                CreationUserId = userId,
                ImageUrl = productDto.ImageUrl,
                Categories = categories
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var returnDto = new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                CreationDate = product.CreationDate,
                CreationUserId = product.CreationUserId ?? string.Empty,
                ImageUrl = product.ImageUrl,
                Categories = product.Categories.Select(c => c.Name).ToList()
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, returnDto);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "Nie znaleziono takiego produktu." });
            }

            if (product.IsDeleted)
            {
                return BadRequest(new { message = "Ten produkt został już usunięty." });
            }

            product.IsDeleted = true;
            

            await _context.SaveChangesAsync();

            // standard w API po poprawnym usunięciu
            return NoContent();
        }
        [HttpGet("deleted")]
        [Authorize] 
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetDeletedProducts()
        {
            var deletedProducts = await _context.Products
                .Where(p => p.IsDeleted == true) 
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreationDate = p.CreationDate,
                    CreationUserId = p.CreationUserId ?? string.Empty,
                    ImageUrl = p.ImageUrl,
                    Categories = p.Categories.Select(c => c.Name).ToList()

                })
                .ToListAsync();

            return Ok(deletedProducts);
        }
        [HttpPost("{id}/restore")]
        [Authorize] 
        public async Task<IActionResult> RestoreProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = "Nie znaleziono takiego produktu w systemie." });
            }

            if (!product.IsDeleted)
            {
                return BadRequest(new { message = "Ten produkt nie jest usunięty, więc nie można go przywrócić." });
            }

            product.IsDeleted = false;

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Produkt '{product.Title}' został pomyślnie przywrócony do katalogu!" });
        }
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null || product.IsDeleted)
            {
                return NotFound(new { message = "Nie znaleziono produktu o podanym ID lub produkt znajduje się w koszu." });
            }

            product.Title = dto.Title;
            product.Description = dto.Description;
            product.ImageUrl = dto.ImageUrl;
            product.Categories = await _context.Categories
                .Where(c => dto.Categories.Contains(c.Id))
                .ToListAsync();

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
