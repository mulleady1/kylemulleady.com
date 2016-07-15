using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using KM.Models;
using KM.Models.ViewModels;
using System.IO;
using System.Text;

namespace KM.Controllers
{
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private KmDbContext _db;

        public ContactController(KmDbContext db)
        {
            _db = db;
        }

        // POST api/contact
        [HttpPost]
        public async Task<bool> Post([FromBody]MessageViewModel model)
        {
			// MailgunResponse res = null;
			bool success = false;
            using (var client = new HttpClient())
			{
				var url = "https://api:*****@api.mailgun.net/v3/kylemulleady.com/messages";
				var html = model.ToHtmlString();
				var content = new MultipartFormDataContent();
				content.Add(new StringContent("from='kylemulleady.com <noreply@kylemulleady.com'"));
				content.Add(new StringContent("to=kyle@kylemulleady.com"));
				content.Add(new StringContent("subject='Contact Request for kyle@kylemulleady.com'"));
				content.Add(new StringContent($"html='{html}'"));
				var result = await client.PostAsync(url, content);
				success = result.IsSuccessStatusCode;
				var stream = await result.Content.ReadAsStreamAsync();
				var serializer = new DataContractJsonSerializer(typeof(MailgunResponse));
				
				stream.Position = 0;
				using (StreamReader reader = new StreamReader(stream, Encoding.UTF8))
				{
					Console.WriteLine("***** " + reader.ReadToEnd());
				}

			}

            return success;
        }

    }
}
