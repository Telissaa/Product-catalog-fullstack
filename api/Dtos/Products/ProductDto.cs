using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Products
{
    public class ProductDto
    {
        public required int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required DateTime CreationDate { get; set; }
        public required string CreationUserId { get; set; }
        public string? ImageUrl { get; set; }
        public List<string> Categories { get; set; } = new List<string>();

    }
}