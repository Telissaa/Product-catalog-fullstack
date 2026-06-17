using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Users
{
    public class ChangeUserRoleDto
    {
        [Required]
        public string NewRole { get; set; } = string.Empty;
    }
}
