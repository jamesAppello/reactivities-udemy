using System.Threading;
using System.Threading.Tasks;
using System;

using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        // start off fress class: type "chandler" && [ENTER] to generate snippet
        // will have to import using statements
        public class Command : IRequest
        {
            // THESE WILL DIFFER FOR EACH HANDLER!
            // !going to let user edit the ID
            // we still need access to id to update entity tho
            // " user can update either a single or all the fields! "
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; } // added a "?" to specify it is optional
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
                // the purpose of a command<< "modify the state of our Application" >> saving [...changes] >> db
                // HANDLER LOGIC GOES HERE!

                var activity = await _context.Activities.FindAsync(request.Id);
                if (activity == null)
                    // stop execution without returning to API controller
                    // DO THAT by throwing an EXCEPTION!
                    throw new Exception("Could not find the activity you were looking for!");
                // accomodate the edit!
                activity.Title = request.Title ?? activity.Title; // this COULD be null.... it hasn't changed!
                activity.Description = request.Description ?? activity.Description;
                activity.Category = request.Category ?? activity.Category;
                activity.Date = request.Date ?? activity.Date; // because its datetime it cannot be null
                activity.City = request.City ?? activity.City;
                activity.Venue = request.Venue ?? activity.Venue;
                // activity is being tracted by the context

                var success = await _context.SaveChangesAsync() > 0; // will return task of int // WE WANT THIS TO BE A BOOL
                if (success) return Unit.Value;
                // owtherwise throw exception
                throw new Exception("Problem occured while saving changes.");
            }
        }
    }
}