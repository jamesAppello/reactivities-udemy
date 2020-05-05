using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System; // for Guid and DateTime
using MediatR;
using Persistence;
using Domain;


namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            // get activity props
            public Guid Id { get;set; } //
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // throw new NotImplementedException();
                var activity = new Activity
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    City = request.City,
                    Venue = request.Venue
                }; // now add ativity to context
                _context.Activities.Add(activity);
                var success = await _context.SaveChangesAsync() > 0; // will return task of int // WE WANT THIS TO BE A BOOL
                if (success) return Unit.Value;
                // owtherwise throw exception
                throw new Exception("Problem occured while saving changes."); 
            }
        }
    }
}