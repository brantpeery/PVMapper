using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Doe.PVMapper.Models;
using MongoRepository;
using Doe.PVMapper.WebApi;
using MongoDB.Driver;

namespace Doe.PVMapper.Controllers
{
    public class PropertiesController : ApiController
    {
        private static readonly IRepository<Properties> _db = MongoHelper.GetRepository<Properties>();

        /// <summary>
        /// Gets all of the utility function property objects for this user.
        /// </summary>
        /// <returns>all of the utility function property objects for this user</returns>
        public IEnumerable<Properties> GetProperties()
        {
            return _db.All().Where(r => r.UserId == User.Identity.Name);  //return all records for the current user.
        }

        /// <summary>
        /// Gets a utility function property object for this user.
        /// </summary>
        /// <param name="id">The unique id of the function, as defined by mongodb</param>
        /// <returns>The utility function property object on success, or HTTP 404 on id not found, or HTTP 403 on invalid user</returns>
        /// <exception cref="System.Web.Http.HttpResponseException">
        /// </exception>
        /// <exception cref="HttpResponseMessage"></exception>
        public Properties GetProperties(string id)
        {
            var prop = _db.GetById(id);

            if (prop == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            if (prop.UserId != User.Identity.Name)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Forbidden));
            }

            return prop;
        }

        /// <summary>
        /// Updates an existing utility function property object for this user.
        /// </summary>
        /// <param name="id">The unique id of the function, as defined by mongodb</param>
        /// <param name="properties">The existing utility function property with updated values.</param>
        /// <returns>HTTP 200 on success, HTTP 404 on id not found</returns>
        /// <exception cref="System.Web.Http.HttpResponseException"></exception>
        /// <exception cref="HttpResponseMessage"></exception>
        public HttpResponseMessage PutProperties(string id, Properties properties)
        {
            properties.UserId = User.Identity.Name;
            properties.Id = id;

            if (properties.UserId != User.Identity.Name)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Forbidden));
            }
            if (_db.Update(properties) == null)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        /// <summary>
        /// Posts a new utility function property object for this user.
        /// </summary>
        /// <param name="properties">The new utility function property object.</param>
        /// <returns>the new utility function property object</returns>
        public HttpResponseMessage PostProperties(Properties properties)
        {
            properties.UserId = User.Identity.Name;
            var prop = _db.Add(properties);

            var response = Request.CreateResponse<Properties>(HttpStatusCode.Created, prop);

            string uri = Url.Route(null, new { id = prop.Id });
            response.Headers.Location = new Uri(Request.RequestUri, uri);
            return response;
        }

        /// <summary>
        /// Deletes the utility function property object with the given id
        /// </summary>
        /// <param name="id">The unique id of the function, as defined by mongodb.</param>
        /// <returns>HTTP status 204 on success, HTTP status 403 on forbidden (not owned by this user)</returns>
        /// <exception cref="System.Web.Http.HttpResponseException"></exception>
        /// <exception cref="HttpResponseMessage"></exception>
        public HttpResponseMessage DeleteProperties(string id)
        {
            var prop = _db.GetById(id);

            // According to the HTTP specification, the DELETE method must be idempotent, meaning that several DELETE
            // requests to the same URI must have the same effect as a single DELETE request. Therefore, the method 
            // should not return an error code if the properties object was already deleted.
            if (prop != null)
            {
                if (prop.UserId == User.Identity.Name)
                {
                    _db.Delete(id);
                }
                else
                {
                    throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Forbidden));
                }
            }

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}