using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Comment
{
    public class CreateCommentDto
    {
        public int ProductId { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}