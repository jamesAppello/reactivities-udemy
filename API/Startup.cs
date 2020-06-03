using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Application.Activities;
using FluentValidation.AspNetCore;
using API.Middleware;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt => 
            {
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy", policy => 
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000"); // now to add this to the config method as middleware
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddControllers()
                .AddFluentValidation(cfg => 
                {
                    cfg.RegisterValidatorsFromAssemblyContaining<Create>();
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // +MIDDLEWARE...  
        //...AS IT COMES IN && OUT OF PIPELINE
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) 
        //*ORDERING IS IMPORTANT inside THIS method*
        // exception delegates should be caught early in the pipeline-exhange
        // so that they catch the exceptions that would occur later on, early asap.
        {
            // newMIDDLEWARE
            app.UseMiddleware<ErrorHandlingMiddleware>(); //from 'API.Middleware'
            if (env.IsDevelopment())
            {
                // what we get here we can always go back to and look in our terminal*************
                // app.UseDeveloperExceptionPage(); //using our own error_handling_middleware
            } 
            else 
            {
                // The default HSTS value is 30 days. You may want to change this for
                // production scenarios, see https://aka.ms/aspnetcore-hsts.
                // app.UseHsts();
            }

            //  \/ we will add this back in later!! \/
            // app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");
            // app.UseMvc();
            app.UseRouting();

            // we will add to this to make it work...initially it wont do a thing.
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
