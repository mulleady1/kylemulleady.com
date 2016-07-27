using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using KM.Models;

namespace KM.Controllers
{
    [Route("api/[controller]")]
    public class PostsController : BaseController
    {

        public PostsController(KmDbContext db) : base(db)
        {
        }

        // GET api/posts
        [HttpGet]
        public IEnumerable<Post> Get()
        {
            return _db.Posts.ToArray();
        }

        // GET api/posts/5
        [HttpGet("{id}")]
        public Post Get(int id)
        {
            return _db.Posts.FirstOrDefault(p => p.Id == id);
        }

        // POST api/posts
        [HttpPost]
        public Post Post([FromBody]Post post)
        {
			if (string.IsNullOrEmpty(post.UserId))
			{
				post.UserId = this._userId;
			}

            _db.Posts.Add(post);
            _db.SaveChanges();
            return post;
        }

        // PUT api/posts/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]Post post)
        {
            var existingPost = _db.Posts.First(p => p.Id == id);
            existingPost.Title = post.Title;
            existingPost.Subtitle = post.Subtitle;
            existingPost.Body = post.Body;
            _db.SaveChanges();
        }

        // DELETE api/posts/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var post = _db.Posts.FirstOrDefault(p => p.Id == id);
            if (post != null)
            {
                _db.Posts.Remove(post);
                _db.SaveChanges();
            }
        }
    }
}
