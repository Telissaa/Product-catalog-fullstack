using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Products
{
    public class CreateProductDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? ImageUrl { get; set; }
        public List<int> CategoryIds { get; set; } = new List<int>();
    }
}