using System.Threading.Tasks;
using System.Threading;
using System;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
                public class Command : IRequest
                {
                    // THESE WILL DIFFER FOR EACH HANDLER!
                    public Guid Id { get; set; }
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

                        // get activiy
                        var activity = await _context.Activities.FindAsync(request.Id);
                        // check if we got activity
                        if (activity == null)
                            throw new Exception("Could not find the activity you were looking for!");
                        _context.Remove(activity); // if false then remove activity: "there was activity found!"    

                        var success = await _context.SaveChangesAsync() > 0; // will return task of int // WE WANT THIS TO BE A BOOL
                        if (success) return Unit.Value;
                        // owtherwise throw exception
                        throw new Exception("Problem occured while saving changes."); 
                    }
                }
    }
}