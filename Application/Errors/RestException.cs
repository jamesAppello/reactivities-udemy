using System;
using System.Net;

namespace Application.Errors
{
    public class RestException : Exception // derives from exceptionclass 'from System'
    {
        public RestException(HttpStatusCode code, object errors = null) // http ctatus code from 'System.Net'
        {
            // initialialize the props|params|args
            Code = code;
            Errors = errors;
        }

        public HttpStatusCode Code { get; }
        public object Errors { get; }
    }
}