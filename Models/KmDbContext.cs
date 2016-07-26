using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace KM.Models
{
    public class KmDbContext : IdentityDbContext<ApplicationUser>
    {
        public KmDbContext() : base()
        { }

        public KmDbContext(DbContextOptions<KmDbContext> options) : base(options)
        { }

        public DbSet<Post> Posts { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=./db.db");
        }
    }

}
