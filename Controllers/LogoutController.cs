using System.Linq;
using Microsoft.AspNetCore.Mvc;
using KM.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace KM.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class LogoutController : BaseController
    {
        private readonly SignInManager<ApplicationUser> _signInManager;

        public LogoutController(KmDbContext db, SignInManager<ApplicationUser> signInManager) : base(db)
        {
            _signInManager = signInManager;
        }

        // POST api/logout
        [HttpPost]
        public async Task<ActionResult> Post()
        {
            await _signInManager.SignOutAsync();
            return this.NoContent();
        }

    }
}
