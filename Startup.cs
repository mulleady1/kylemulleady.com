using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using KM.Models;
using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Newtonsoft.Json;

namespace KM
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; }

        private bool IsDevelopment;

        public Startup(IHostingEnvironment env)
        {
            this.IsDevelopment = env.IsDevelopment();

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();
            services.Configure<MailgunOptions>(Configuration.GetSection("Mailgun"));
            services.AddCors();
            services.AddMvc().AddJsonOptions(options =>
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            );
            services.AddDbContext<KmDbContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection"))
            );
            services
                .AddIdentity<ApplicationUser, IdentityRole>(options => {
                    options.Cookies.ApplicationCookie.ExpireTimeSpan = TimeSpan.FromDays(1000);
                    var domain = Configuration.GetSection("Cookies")["Domain"];
                    if (domain != null) 
                    {
                        options.Cookies.ApplicationCookie.CookieDomain = domain;
                    } 
                })
                .AddEntityFrameworkStores<KmDbContext>()
                .AddDefaultTokenProviders();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (this.IsDevelopment)
            {
                app.UseCors(builder =>
                    builder
                        .WithOrigins(new string[] { "http://0.0.0.0:5001", "http://localhost:5001" })
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .AllowAnyMethod()
                );
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseIdentity();
            app.UseMvc();
        }
    }
}
