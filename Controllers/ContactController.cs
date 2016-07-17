using KM.Models;
using KM.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;

namespace KM.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly IOptions<MailgunOptions> _mailgunOptions;

        private readonly KmDbContext _db;

        public ContactController(KmDbContext db, IOptions<MailgunOptions> mailgunOptions)
        {
            _db = db;
			_mailgunOptions = mailgunOptions;
        }

        // POST api/contact
        [HttpPost]
        public async Task<MailgunResult> Post([FromBody]MessageViewModel model)
        {
            if (!ModelState.IsValid || model == null)
            {
                return new MailgunResult { Success = false };
            }

            using (var client = new HttpClient())
            {
                var url = _mailgunOptions.Value.Url;

                var message = new MailgunMessage
                {
                    From = "KM Bot <noreply@kylemulleady.com>",
                    To = "kyle@kylemulleady.com",
                    Subject = "Contact Request for kylemulleady.com",
                    Html = model.ToHtmlString()
                };

                var content = new StringContent(message.ToQueryString(), Encoding.UTF8, "application/x-www-form-urlencoded");
                var response = await client.PostAsync(url, content);
                var json = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<MailgunResult>(json);
                result.Success = response.IsSuccessStatusCode;
                return result;
            }
        }

    }
}
