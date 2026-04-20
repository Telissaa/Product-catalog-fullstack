using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatorUserId { get; set; }
    }
}