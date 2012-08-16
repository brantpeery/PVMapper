﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Doe.PVMapper.Models;
using DreamSongs.MongoRepository;
using System.Net;
using System.Net.Http;

namespace Doe.PVMapper.WebApi
{
    public class SiteScoreController : ApiController
    {
        private static readonly IRepository<SiteScore> _db = MongoHelper.GetRepository<SiteScore>();

        public IQueryable<SiteScore> Get()
        {
            return _db.All();
        }

        public SiteScore Get(string id)
        {
            SiteScore score = _db.GetById(id);
            if (score == null)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            }

            // response.Content.Headers.Expires = new DateTimeOffset(DateTime.Now.AddSeconds(300));

            return score;
        }

        public HttpResponseMessage Post(SiteScore value)
        {
            SiteScore score = _db.Add(value);

            var response = Request.CreateResponse<SiteScore>(HttpStatusCode.Created, score);

            string uri = Url.Route(null, new { id = score.Id });
            response.Headers.Location = new Uri(Request.RequestUri, uri);
            return response;
        }

        public void Put(string id, SiteScore value)
        {
            if (_db.Update(value) == null)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));
            }
        }

        public HttpResponseMessage Delete(string id)
        {
            // According to the HTTP specification, the DELETE method must be idempotent, meaning that several DELETE requests to the same URI must have the same effect as a single DELETE request. Therefore, the method should not return an error code if the book was already deleted.
            // If a DELETE request succeeds, it can return status 200 (OK) with an entity-body that describes the status, or status 202 (Accepted) if the deletion is still pending, or status 204 (No Content) with no entity body. In this example, the method returns status 204.
            _db.Delete(id);
            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}