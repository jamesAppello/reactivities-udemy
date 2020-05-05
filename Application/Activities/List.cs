using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using Domain;
using Persistence;
using MediatR;

namespace Application.Activities
{
    public class List
    {
        // we want a query and a handler
        public class Query: IRequest<List<Activity>> {}
        public class Handler: IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                // throw new System.NotImplementedException();
                var activities = await _context.Activities.ToListAsync();
                return activities;
            }
        }
    }
}