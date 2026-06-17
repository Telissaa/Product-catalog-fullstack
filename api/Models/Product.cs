using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public DateTime CreationDate { get; set; }
        public string? CreationUserId { get; set; }
        public string? ImageUrl { get; set; }

        // Navigation properties
        public ICollection<Category> Categories { get; set; } = new List<Category>();
        public virtual IdentityUser? Creator { get; set; }
        public List<Comment> Comments { get; set; } = new List<Comment>();
    }
}