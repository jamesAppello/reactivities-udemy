using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;
using MediatR;
using Domain;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                // throw new NotImplementedException();
                var activity = await _context.Activities.FindAsync(request.Id);
                return activity;
            }
        }
    }
}