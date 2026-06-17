using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Comment
{
    public class CommentDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreationDate { get; set; }
        public string? CreatorUserId { get; set; }
        public string CreatorUserName { get; set; } = string.Empty;
    }
}