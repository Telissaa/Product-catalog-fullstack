using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public bool IsDeleted { get; set; }
        public string? CreatorUserId { get; set; }

        // Navigation properties
        public virtual Product? Product { get; set; }
        public virtual IdentityUser? Creator { get; set; }
    }
}