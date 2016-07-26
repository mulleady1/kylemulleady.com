using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using KM.Models;

namespace KM.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private KmDbContext _db;

        public UsersController(KmDbContext db)
        {
            _db = db;
        }

        // GET api/users
        [HttpGet]
        public IEnumerable<ApplicationUser> Get()
        {
            // return _db.Users.ToArray();
			return null;
        }

        // GET api/users/5
        [HttpGet("{id}")]
        public ApplicationUser Get(int id)
        {
            // return _db.Users.FirstOrDefault(p => p.Id == id);
			return null;
        }

        // POST api/users
        [HttpPost]
        public ApplicationUser Post([FromBody]ApplicationUser user)
        {
			// user.Password = KM.Models.User.HashPassword(user.Password);
            // _db.Users.Add(user);
            // _db.SaveChanges();
            // return user;
			return null;
        }

        // PUT api/users/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]ApplicationUser user)
        {
            // var existingUser = _db.Users.First(p => p.Id == id);
            
			// if (user.Username != null)
			// {
			// 	existingUser.Username = user.Username;
			// }
            // if (user.Email != null)
			// {
			// 	existingUser.Email = user.Email;
			// }
			// if (user.Password != null)
			// {
			// 	existingUser.Password = KM.Models.User.HashPassword(user.Password);
			// }

            // _db.SaveChanges();
        }

        // DELETE api/users/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            // var user = _db.Users.FirstOrDefault(p => p.Id == id);
            // if (user != null)
            // {
            //     _db.Users.Remove(user);
            //     _db.SaveChanges();
            // }
        }
    }
}
