using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Xunit;

namespace KM.Models
{
    public class UserTests
    {
        [Fact]
        public async void TestCreateUser()
        {
            var username = Environment.GetEnvironmentVariable("KM_TEST_USERNAME");
            var email = Environment.GetEnvironmentVariable("KM_TEST_EMAIL");
            var password = Environment.GetEnvironmentVariable("KM_TEST_PASSWORD");
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                throw new Exception("One or more environment variables missing: KM_TEST_USERNAME, KM_TEST_EMAIL, KM_TEST_PASSWORD");
            }
            
            var user = new ApplicationUser 
            {
                UserName = username,
                Email = email
            };

            var userManager = GetUserManager();

            var result = await userManager.CreateAsync(user, password);
            Assert.True(result.Succeeded);
        }

        private UserManager<ApplicationUser> GetUserManager()
        {
            return new UserManager<ApplicationUser>(
                new UserStore<ApplicationUser>(new KmDbContext()), 
                null, 
                new PasswordHasher<ApplicationUser>(),
                null,
                null,
                null,
                null,
                null,
                null
            );
        }

    }
}
