using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Comment
{
    public class UpdateCommentDto
    {
        [Required(ErrorMessage = "Description cannot be empty.")]
        public string Description { get; set; } = string.Empty;
    }
}