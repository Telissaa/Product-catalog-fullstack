using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Dtos.Categories;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all categories without pagination. Publicly accessible.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _context.Categories.ToListAsync();

                var categoryDtos = categories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                }).ToList();

                return Ok(new
                {
                    message = "Categories retrieved successfully.",
                    categories = categoryDtos
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving categories.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific category by ID. Publicly accessible.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Category ID must be greater than 0." });
            }

            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
                if (category == null)
                {
                    return NotFound(new { message = "Category not found." });
                }

                var categoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };

                return Ok(new { message = "Category retrieved successfully.", category = categoryDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the category.", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new category. Accessible to authenticated users.
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto createCategoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input data.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            if (string.IsNullOrWhiteSpace(createCategoryDto.Name))
            {
                return BadRequest(new { message = "Category name cannot be empty." });
            }

            try
            {
                // Check if category with same name already exists
                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == createCategoryDto.Name.ToLower());
                
                if (existingCategory != null)
                {
                    return BadRequest(new { message = "A category with this name already exists." });
                }

                var category = new Category
                {
                    Name = createCategoryDto.Name
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                var categoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };

                return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, new { message = "Category created successfully.", category = categoryDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the category.", error = ex.Message });
            }
        }

        /// <summary>
        /// Update a category. Only accessible to Admin role.
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto updateCategoryDto)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Category ID must be greater than 0." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input data.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            if (string.IsNullOrWhiteSpace(updateCategoryDto.Name))
            {
                return BadRequest(new { message = "Category name cannot be empty." });
            }

            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
                if (category == null)
                {
                    return NotFound(new { message = "Category not found." });
                }

                // Check if another category with the same name exists
                var existingCategory = await _context.Categories
                    .FirstOrDefaultAsync(c => c.Name.ToLower() == updateCategoryDto.Name.ToLower() && c.Id != id);
                
                if (existingCategory != null)
                {
                    return BadRequest(new { message = "A category with this name already exists." });
                }

                category.Name = updateCategoryDto.Name;
                _context.Categories.Update(category);
                await _context.SaveChangesAsync();

                var categoryDto = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                };

                return Ok(new { message = "Category updated successfully.", category = categoryDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the category.", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a category permanently. Only accessible to Admin role.
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Category ID must be greater than 0." });
            }

            try
            {
                var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
                if (category == null)
                {
                    return NotFound(new { message = "Category not found." });
                }

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Category deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the category.", error = ex.Message });
            }
        }
    }
}
