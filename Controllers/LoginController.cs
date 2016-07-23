using System.Linq;
using Microsoft.AspNetCore.Mvc;
using KM.Extensions;
using KM.Models;
using KM.Models.ViewModels;

namespace KM.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : BaseController
    {
        private KmDbContext _db;

        public LoginController(KmDbContext db)
        {
            _db = db;
        }

		// GET api/login
		[HttpGet]
		public ActionResult Get()
		{
			var user = this._user;
			if (user == null)
			{
				return new EmptyResult();
			}

			return new JsonResult(new
            {
                username = user.Username,
                email = user.Email
            });
		}

        // POST api/login
        [HttpPost]
        public ActionResult Post([FromBody]LoginViewModel model)
        {
            if (!ModelState.IsValid || model == null)
            {
                return BadRequest("Bad request");
            }

            var user = _db.Users.FirstOrDefault(u => u.Username == model.Username || u.Email == model.Username);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            if (KM.Models.User.HashPassword(model.Password) != user.Password)
            {
                return BadRequest("Invalid credentials");
            }

			HttpContext.Session.SetObject("user", user);

            return new JsonResult(new
            {
                username = user.Username,
                email = user.Email
            });
        }

    }
}
