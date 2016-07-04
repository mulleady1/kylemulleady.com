using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace KM.Models
{
    public class KmDbContext : DbContext
    {
		public KmDbContext() : base()
    	{ }

		public KmDbContext(DbContextOptions<KmDbContext> options) : base(options)
    	{ }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			optionsBuilder.UseSqlite("Filename=./db.db");
		}
    }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }

        public List<Post> Posts { get; set; }
    }

    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
		
		public int UserId { get; set; }
		public User User { get; set; }

    }
}
