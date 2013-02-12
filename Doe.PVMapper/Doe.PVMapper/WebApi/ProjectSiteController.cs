using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Doe.PVMapper.Models;
using MongoRepository;

namespace Doe.PVMapper.WebApi
{

    public class ProjectSiteController : ApiController
    {
        private static readonly IRepository<ProjectSite> _db = MongoHelper.GetRepository<ProjectSite>();

        public IQueryable<ProjectSite> Get()
        {
            return _db.All().Where(c => c.IsActive && c.UserId == User.Identity.Name);
        }

        public ProjectSite Get(string id)
        {
            ProjectSite site = _db.GetById(id);
            if (site == null)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            }

            if (site.UserId != User.Identity.Name)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Forbidden));
            }
            // response.Content.Headers.Expires = new DateTimeOffset(DateTime.Now.AddSeconds(300));

            return site;
        }

        public HttpResponseMessage Post(ProjectSite value)
        {
            value.UserId = User.Identity.Name;
            ProjectSite site = _db.Add(value);

            var response = Request.CreateResponse<ProjectSite>(HttpStatusCode.Created, site);

            string uri = Url.Route(null, new { id = site.Id });
            response.Headers.Location = new Uri(Request.RequestUri, uri);
            return response;
        }

        public void Put(string id, ProjectSite value)
        {
            value.UserId = User.Identity.Name;

            if (_db.Update(value) == null)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            }
        }

        public HttpResponseMessage Delete(string id)
        {
            var site = _db.GetById(id);

            if (site != null)
            {
                if (site.UserId == User.Identity.Name)
                {
                    _db.Delete(id);
                }
                else
                {
                    throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Forbidden));
                }
            }
            // According to the HTTP specification, the DELETE method must be idempotent, meaning that several DELETE requests to the same URI must have the same effect as a single DELETE request. Therefore, the method should not return an error code if the book was already deleted.
            // If a DELETE request succeeds, it can return status 200 (OK) with an entity-body that describes the status, or status 202 (Accepted) if the deletion is still pending, or status 204 (No Content) with no entity body. In this example, the method returns status 204.
            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}