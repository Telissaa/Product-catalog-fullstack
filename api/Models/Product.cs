using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreationUserId { get; set; }
        public string? ImageUrl { get; set; }

    }
}