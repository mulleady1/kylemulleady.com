using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace KM.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<Post> Posts { get; set; }

    }
}
