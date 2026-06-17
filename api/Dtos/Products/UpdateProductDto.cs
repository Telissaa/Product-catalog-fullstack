using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Products
{
    public class UpdateProductDto
    {
        [Required(ErrorMessage = "Nazwa produktu jest wymagana.")]
        [StringLength(150, ErrorMessage = "Nazwa nie może przekraczać 150 znaków.")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Opis produktu jest wymagany.")]
        public required string Description { get; set; }
        public string? ImageUrl { get; set; }
        public List<int> Categories { get; set; } = new List<int>();
    }
}