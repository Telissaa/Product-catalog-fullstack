using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Dtos.Users;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _context;
        private readonly List<string> _validRoles = new() { "Admin", "User" };

        public UsersController(UserManager<IdentityUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        /// <summary>
        /// Get all users with pagination. Only accessible to Admin role.
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            // Validate pagination parameters
            if (page < 1 || pageSize < 1)
            {
                return BadRequest(new { message = "Page and pageSize must be greater than 0." });
            }

            try
            {
                var totalUsers = await _userManager.Users.CountAsync();
                var users = await _userManager.Users
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var userDtos = new List<UserDto>();
                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    userDtos.Add(new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email ?? string.Empty,
                        Username = user.UserName ?? string.Empty,
                        Role = roles.FirstOrDefault() ?? "User"
                    });
                }

                return Ok(new
                {
                    message = "Users retrieved successfully.",
                    totalUsers = totalUsers,
                    page = page,
                    pageSize = pageSize,
                    totalPages = (int)Math.Ceiling((double)totalUsers / pageSize),
                    users = userDtos
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving users.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific user by ID. Users can only see their own data unless they are Admin.
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetUserById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "User ID cannot be empty." });
            }

            try
            {
                // Get current user ID from claims
                var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                var currentUserRoles = User.FindAll(System.Security.Claims.ClaimTypes.Role);
                bool isAdmin = currentUserRoles.Any(r => r.Value == "Admin");

                // Security check: user can only view their own data unless they're Admin
                if (currentUserId != id && !isAdmin)
                {
                    return Forbid();
                }

                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                var roles = await _userManager.GetRolesAsync(user);
                var userDto = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    Username = user.UserName ?? string.Empty,
                    Role = roles.FirstOrDefault() ?? "User"
                };

                return Ok(new { message = "User retrieved successfully.", user = userDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the user.", error = ex.Message });
            }
        }

        /// <summary>
        /// Change a user's role. Only accessible to Admin role.
        /// </summary>
        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeUserRole(string id, [FromBody] ChangeUserRoleDto changeRoleDto)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest(new { message = "User ID cannot be empty." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid input data.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            if (string.IsNullOrWhiteSpace(changeRoleDto.NewRole))
            {
                return BadRequest(new { message = "New role cannot be empty." });
            }

            // Validate the requested role
            if (!_validRoles.Contains(changeRoleDto.NewRole))
            {
                return BadRequest(new { message = "Invalid role. Valid roles are: Admin, User" });
            }

            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                // Get current roles and remove them
                var currentRoles = await _userManager.GetRolesAsync(user);
                if (currentRoles.Count > 0)
                {
                    var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    if (!removeResult.Succeeded)
                    {
                        return StatusCode(500, new { message = "Failed to remove user from current role." });
                    }
                }

                // Add new role
                var addResult = await _userManager.AddToRoleAsync(user, changeRoleDto.NewRole);
                if (!addResult.Succeeded)
                {
                    return StatusCode(500, new { message = "Failed to add user to new role." });
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = $"User role successfully changed to {changeRoleDto.NewRole}." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while changing the user role.", error = ex.Message });
            }
        }
    }
}
