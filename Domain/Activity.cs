using System;

namespace Domain
{
    public class Activity
    {
        // we'll use a guid instead of an int to instatiate an Id
        // this allows us to create the Id from either client or serverside code
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
    }
}