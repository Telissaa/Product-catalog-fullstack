using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Dtos.Comment;
using api.Models;

namespace api.Controlers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto createCommentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input data.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(loggedInUserId))
            {
                return Unauthorized(new { message = "Nie rozpoznano użytkownika. Zaloguj się ponownie." });
            }

            var productExists = await _context.Products.AnyAsync(p => p.Id == createCommentDto.ProductId);
            if (!productExists)
            {
                return NotFound(new { message = "Product not found." });
            }

            var comment = new Comment
            {
                ProductId = createCommentDto.ProductId,
                Description = createCommentDto.Description,
                CreatorUserId = loggedInUserId,
                CreationDate = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment created successfully." });
        }
    }
}