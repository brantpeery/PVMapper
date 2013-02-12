using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Doe.PVMapper.Models;
using MongoRepository;
using Newtonsoft.Json.Linq;

namespace Doe.PVMapper.WebApi
{
    public class ScoreboardController : ApiController
    {

        // GET api/scoreboard
        public object Get()
        {
            IRepository<ProjectSite> sites = MongoHelper.GetRepository<ProjectSite>();
            IRepository<WebExtension> tools = MongoHelper.GetRepository<WebExtension>();
            IRepository<SiteScore> scores = MongoHelper.GetRepository<SiteScore>();

            IQueryable<ProjectSite> userSites = sites.All().Where(c => c.IsActive && c.UserId == User.Identity.Name);
            if (!userSites.Any()) return String.Empty;

            // the structure of the code is probably easier to understand if you look at the output JSON
            JObject result = new JObject(
                new JProperty("metaData",
                    new JObject(
                        new JProperty("root", "records"),
                        new JProperty("fields",
                            new JArray(
                                new JObject(
                                    new JProperty("name", "id"), // tool id
                                    new JProperty("type", "string")
                                ),
                                new JObject(
                                    new JProperty("name", "tool"), // tool name
                                    new JProperty("type", "string")
                                ),
                                from s in userSites
                                orderby s.Name
                                select new JObject(
                                    new JProperty("name", s.Id), // site id
                                    new JProperty("type", "string")
                                )
                            )
                        ),

                        new JProperty("columns",
                            new JArray(
                                //new JObject(
                                //    new JProperty("text", "#"),
                                //    new JProperty("dataIndex", "id")
                                //),
                                new JObject(
                                    new JProperty("text", "Tool"),
                                    new JProperty("dataIndex", "tool"),
                                    new JProperty("flex", 1)
                                ),
                                from s in userSites
                                orderby s.Name
                                select new JObject(
                                    new JProperty("text", s.Name),
                                    new JProperty("dataIndex", s.Id),
                                    new JProperty("width", 120),
                                    new JProperty("sortable", false)
                                )
                            )
                        )
                    )
                ),
                new JProperty("records",
                    new JArray(
                        from t in tools.All()
                        orderby t.Name
                        select new JObject(
                            new JProperty("id", t.Id),
                            new JProperty("tool", t.Name),
                            from s in userSites
                            orderby s.Name
                            select new JProperty(s.Id,
                                GetScoreAtCell(scores, t.UniqueIdentifier, s.Id))
                        )
                    )
                )
            );

            return result;
        }

        private static string GetScoreAtCell(IRepository<SiteScore> scores, string toolId, string siteId)
        {
            var query = from ss in scores.All()
                        where ss.ToolId == toolId
                        where ss.SiteId == siteId
                        select ss.Score;
            return query.FirstOrDefault() ?? String.Empty;
        }
    }
}