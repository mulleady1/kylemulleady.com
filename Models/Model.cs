using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Text;

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
        public string Password { get; set; }
		public DateTime Created { get; set; }

        public List<Post> Posts { get; set; }

        public User()
        {
            this.Created = DateTime.UtcNow;
        }

        public static string HashPassword(string s)
        {
            byte[] salt = Encoding.UTF8.GetBytes("asdf");
            
            // derive a 256-bit subkey (use HMACSHA1 with 10,000 iterations)
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: s,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

			return hashed;
        }
    }

    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Body { get; set; }
        public DateTime Created { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public Post()
        {
            this.Created = DateTime.UtcNow;
        }
    }
}
