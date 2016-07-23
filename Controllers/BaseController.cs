using Microsoft.AspNetCore.Mvc;
using KM.Extensions;
using KM.Models;

namespace KM.Controllers
{
    public class BaseController : Controller
    {
        protected int _userId
		{
			get
			{
				var user = this._user;
				return user != null ? user.Id : 0;
			}
		}
		
		protected User _user
		{
			get
			{
				return HttpContext.Session.GetObject<User>("user");
			}
		}

    }
}
