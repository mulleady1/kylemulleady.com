using System;

namespace KM.Models
{
	public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Body { get; set; }
        public DateTime Created { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public Post()
        {
            this.Created = DateTime.UtcNow;
        }
    }
}
