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

        [HttpGet]
        public async Task<IActionResult> GetComments([FromQuery] int productId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 15; // Max 15 items per page

            var query = _context.Comments
                .Include(c => c.Creator)
                .Where(c => c.ProductId == productId);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var comments = await query
                .OrderByDescending(c => c.CreationDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize) 
                .ToListAsync();

            var commentDtos = comments.Select(c => new CommentDto
            {
                Id = c.Id,
                ProductId = c.ProductId,
                Description = c.Description,
                CreationDate = c.CreationDate,
                CreatorUserId = c.CreatorUserId,
                CreatorUsername = c.Creator != null ? c.Creator.UserName ?? "Deleted User" : "Deleted User"
            }).ToList();

            return Ok(new
            {
                message = "Comments retrieved successfully.",
                totalCount,
                totalPages,
                currentPage = pageNumber,
                comments = commentDtos
            });
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound(new { message = "Comment not found." });
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}