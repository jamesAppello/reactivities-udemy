using System; // for Guid and DateTime
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Domain;
using FluentValidation; // using this is middleware instead of using data-annotations


namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            // get activity props
            public Guid Id { get;set; } 

            //use data annotations BUT NOT INSIDE THE COMMAND OBJECT --> Fluent Validation acts as a kind of middleware bt cmd & handler
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }
        // if it doesnt pass the validator then it wont get sent to handler method 
        public class CommandValidator : AbstractValidator<Command> // AbstractValidator is a class from FluentValidation*
        {
            public CommandValidator() // configured in Startup class
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.City).NotEmpty();
                RuleFor(x => x.Venue).NotEmpty();
            }
        }

        // HANDLER CLASS
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