using Microsoft.AspNetCore.Rewrite;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;

namespace WebApplication3.Extensions
{
    public class MoviesRedirectRule:IRule
    {
        private readonly string[] _matchPaths;
        private readonly string _newPath;

        public MoviesRedirectRule(string[] matchPaths,string newPath)
        {
            this._matchPaths = matchPaths;
            this._newPath = newPath;
        }
        public void ApplyRule(RewriteContext context)
        {
            var request = context.HttpContext.Request;
            //已经是目标地址的话，直接返回
            //if(request.Path.StartsWithSegments(new Microsoft.AspNetCore.Http.PathString(_newPath)))
            //{
            //    return;
            //}
            if (_matchPaths.Contains(request.Path.Value))
            {
                var newLocation = $"{_newPath}{request.QueryString}";

                var respones = context.HttpContext.Response;
                respones.StatusCode = 302;
                context.Result = RuleResult.EndResponse;
                respones.Headers[HeaderNames.Location] = newLocation;
            }
        }
    }
}
