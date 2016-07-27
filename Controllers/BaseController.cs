using KM.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace KM.Controllers
{
    public class BaseController : Controller
    {
		public BaseController(KmDbContext db)
        {
            _db = db;
        }

		protected readonly KmDbContext _db;
        
		protected string _userId
		{
			get
			{
				var name = this.User.Identity.Name;
				if (name == null)
				{
					return null;
				}

				var user = _db.Users.FirstOrDefault(u => u.UserName == name || u.Email == name);

				if (user == null)
				{
					return null;
				}

				return user.Id;
			}
		}
	}
}
