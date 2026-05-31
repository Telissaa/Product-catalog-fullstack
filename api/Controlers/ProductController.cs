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
    }
}
