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
using DreamSongs.MongoRepository;
using Doe.PVMapper.WebApi;
using MongoDB.Driver;

namespace Doe.PVMapper.Controllers {
  public class PropertiesController : ApiController {
    //private PropertiesContext db = new PropertiesContext();
    private IRepository<Properties> _db = null;
    private string connectionString = ConfigurationManager.AppSettings.Get("PVMapperCache");
    
    protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext) {
      base.Initialize(controllerContext);
      if (connectionString == null)
        throw new ArgumentNullException("Connection string not found.");
      _db = new MongoRepository<Properties>(new MongoUrl(connectionString));
    }

    // GET api/Properties
    public IEnumerable<Properties> GetProperties() {
      if (_db != null) {
        var results = _db.All().Where(r => r.UserId == User.Identity.Name);  //return all records for the current user.
        return results;
      } else
        throw new ArgumentNullException("Database connecton failed.");
    }

    // GET api/Properties/5
    public Properties GetProperties(string id) {
      var prop = _db.GetById(id);
      if (prop == null) 
        throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));

      if (prop.UserId != User.Identity.Name) 
        throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Forbidden));
      return prop;
    }

    // PUT api/Properties/5
    public HttpResponseMessage PutProperties(string id, Properties properties) {

      properties.UserId = User.Identity.Name;
      if (_db.Update(properties) == null) {
        throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
      }
      else
        return Request.CreateResponse(HttpStatusCode.OK);
    }

    // POST api/Properties
    public HttpResponseMessage PostProperties(Properties properties) {
      properties.UserId = User.Identity.Name;
      var prop = _db.Add(properties);

      var response = Request.CreateResponse<Properties>(HttpStatusCode.Created, prop);

      string uri = Url.Route(null, new { id = prop.functionName });
      response.Headers.Location = new Uri(Request.RequestUri, uri);
      return response;
    }

    // DELETE api/Properties/5
    public HttpResponseMessage DeleteProperties(string id) {

      var prop = _db.GetById(id);
      if (prop == null) {
        return Request.CreateResponse(HttpStatusCode.NotFound);
      }

      if (prop.UserId == User.Identity.Name)
        _db.Delete(id);
      else
        throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.Forbidden));

      return Request.CreateResponse(HttpStatusCode.OK, prop);
    }
  }
}