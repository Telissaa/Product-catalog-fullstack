using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using api.Dtos.Auth;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController: ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        public AuthController(
            UserManager<IdentityUser> userManager, 
            RoleManager<IdentityRole> roleManager, 
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            // Validate model state (should be automatic with [Required] attributes, but explicit check is safer)
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Nieprawidłowe dane.", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            // Check if user already exists by email
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Użytkownik o tej nazwie już istnieje!" });
            }

            // Check if username is already taken
            var existingUserByUsername = await _userManager.FindByNameAsync(model.Username);
            if (existingUserByUsername != null)
            {
                return BadRequest(new { message = "Użytkownik o tej nazwie już istnieje!" });
            }

            var user = new IdentityUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);
            
            if (result.Succeeded)
            {
                // Assign default "User" role to newly registered user
                var roleAssignResult = await _userManager.AddToRoleAsync(user, "User");
                if (!roleAssignResult.Succeeded)
                {
                    return StatusCode(500, new { message = "Użytkownik został utworzony, ale nie udało się przypisać domyślnej roli." });
                }

                return Ok(new { message = "User has been successfully registered!" });
            }

            // Return detailed error messages if password/validation failed
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest(new { message = "Registration failed.", errors = errors });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            // Validate model state
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Nieprawidłowe dane", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            
            // Check if user exists and password is correct
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new { message = "Nieprawidłowe hasło lub email" });
            }

            // Create claims (information encoded in the token - user ID and email)
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id), // GUID user ID needed for products
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            // Add user roles to claims
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Get secret key from configuration
            var jwtSecret = _configuration["JwtSettings:SecretKey"] ?? "SuperTajnyIPrzemyslamyKluczDoZabezpieczeniaAPI123!";
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

            // Create token structure
            var token = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(authClaims),
                Expires = DateTime.UtcNow.AddDays(1), // Token valid for 1 day
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(token);
            var tokenString = tokenHandler.WriteToken(securityToken);

            // Return success with token for frontend to save
            return Ok(new
            {
                token = tokenString,
                expiration = token.Expires,
                username = user.UserName,
                userId = user.Id,
                email = user.Email,
                message = "Login successful!"
            });
        }
        }
    }