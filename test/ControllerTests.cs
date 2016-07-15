using KM.Models;
using KM.Models.ViewModels;
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
            var controller = new ContactController(db);
            var result = await controller.Post(model);
			Assert.True(result);
        }

    }
}
