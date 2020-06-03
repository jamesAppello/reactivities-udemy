using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Activities;

namespace API.Controllers
{
    // any controller needs a route, an attribute, and needs to derive from the MVC controller base class
    [Route("api/[controller]")]
    [ApiController] // gives us automatic 400-responses and saves us from needed to check if theres a validation error
                    // another task our ApiController does for us : 'Binding Source Parameter Inferrance'
                    // bc we areusing this it will infer where it is coming from
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;
        // need to establish mediator as a service
        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List()
        {
            return await _mediator.Send(new List.Query());
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Details(Guid id)
        {
            return await _mediator.Send(new Details.Query{Id = id});
        }

        [HttpPost] // dont need to give root patterns
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            // bc of ApiController attr: api is smart enough to know where to look when we create new activity
            // * specify from body [] << "dont need it***"
            return await _mediator.Send(command);
        }

        [HttpPut("{id}")] // need to give rootParams bc: 'we are updating a resource'
        public async Task<ActionResult<Unit>> Edit(Guid id, Edit.Command command)
        {
            // specify id of activity
            command.Id = id;
            return await _mediator.Send(command); // THEN send command now that both guid and command are parsed together
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await _mediator.Send(new Delete.Command{Id = id});
        }
    }
}