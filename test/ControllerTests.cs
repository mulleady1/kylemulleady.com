using KM.Models;
using KM.Models.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xunit;

namespace KM.Controllers
{
    public class ContactControllerTest
    {
        [Fact]
        public async void PostShouldSendEmail()
        {
            var model = new MessageViewModel
            {
                Name = "Test Name",
                Email = "test@email.com",
                Message = "Hola mundo"
            };

            var db = new KmDbContext();
			var options = Options.Create(new MailgunOptions { Url = "" });
			var logger = new Logger<ContactController>(new LoggerFactory());
            var controller = new ContactController(db, options, logger);
            var result = await controller.Post(model);
			Assert.True(result.Success);
        }

    }
}
