using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        // this class is to allow us to query our database
        public DataContext(DbContextOptions options) : base(options)
        {
            // NULL
        }
        //ADD as a service
        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }

        // seeding data
        // override method
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
                .HasData(
                    new Value {Id = 1, Name = "Value 101"},
                    new Value {Id = 2, Name = "Value 102"},
                    new Value {Id = 3, Name = "Value 103"}
                );
        }
    }
}
