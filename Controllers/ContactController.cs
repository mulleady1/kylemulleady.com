using KM.Models;
using KM.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.Extensions.Logging;

namespace KM.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly IOptions<MailgunOptions> _mailgunOptions;

        private readonly KmDbContext _db;

        private readonly ILogger<ContactController> _logger;

        public ContactController(KmDbContext db, IOptions<MailgunOptions> mailgunOptions, ILogger<ContactController> logger)
        {
            _db = db;
            _mailgunOptions = mailgunOptions;
			_logger = logger;
        }

        // POST api/contact
        [HttpPost]
        public async Task<MailgunResult> Post([FromBody]MessageViewModel model)
        {
			_logger.LogInformation("POST /api/contact {model}", model);
            if (!ModelState.IsValid || model == null)
            {
				_logger.LogInformation("ModelState invalid");
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
				
				_logger.LogInformation("Sending message to mailgun at {url} with {message}", url, message);

                var content = new StringContent(message.ToQueryString(), Encoding.UTF8, "application/x-www-form-urlencoded");
                var response = await client.PostAsync(url, content);
                var json = await response.Content.ReadAsStringAsync();

				_logger.LogInformation("Received mailgun response: {json}", json);
                var result = JsonConvert.DeserializeObject<MailgunResult>(json);
                result.Success = response.IsSuccessStatusCode;
				_logger.LogInformation("Deserialized response to {result}", result);
                return result;
            }
        }

    }
}
