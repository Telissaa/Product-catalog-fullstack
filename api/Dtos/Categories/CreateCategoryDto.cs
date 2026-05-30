using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Categories
{
    public class CreateCategoryDto
    {
        public required string Name { get; set; }
    }
}