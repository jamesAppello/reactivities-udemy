using Microsoft.EntityFrameworkCore;
using Persistence;

using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
// using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // returns what is built from the builder
            var host = CreateHostBuilder(args).Build();
            // ADD RUN METHOD BACK IN
            CreateHostBuilder(args).Build().Run();

            // anything used will be cleaned
            using (var scope = host.Services.CreateScope())
            {
                // ref to our services
                var services = scope.ServiceProvider;
                // trycatch to get dbcontext and query db
                try 
                {
                    var context = services.GetRequiredService<DataContext>();
                    context.Database.Migrate();
                    // Seeded data from zipfile being called to context
                    Seed.SeedData(context);
                }
                catch (Exception ex)
                {
                    //exception handling
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occuried during migration.");
                }
            }
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
