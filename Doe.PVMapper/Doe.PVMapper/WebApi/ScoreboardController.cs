using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Doe.PVMapper.Models;
using DreamSongs.MongoRepository;
using Newtonsoft.Json.Linq;

namespace Doe.PVMapper.WebApi
{

    // could have used traditional json instead, but the array will be less verbose
    // http://www.sencha.com/forum/showthread.php?229630-Simple-question-on-getting-JSON-data-through-REST-using-Ext.data.ArrayStore
    public class ScoreboardController : ApiController
    {
        // this would use Scorecards
        private static JArray GetArray(string name)
        {
            JArray array = new JArray();

            array.Add(new JValue(name));
            array.Add(new JValue(32.3));
            array.Add(new JValue(12.2));
            array.Add(new JValue(23.1));
            return array;
        }
        // GET api/scoreboard
        public object Get()
        {
            IRepository<ProjectSite> sites = MongoHelper.GetRepository<ProjectSite>();
            IRepository<WebExtension> tools = MongoHelper.GetRepository<WebExtension>();
            IRepository<SiteScore> scores = MongoHelper.GetRepository<SiteScore>();

            // add some linq http://james.newtonking.com/projects/json/help/index.html?topic=html/LINQtoJSON.htm
            IQueryable<ProjectSite> userSites = sites.All();

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
                                    new JProperty("width", 75),
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
                                GetScoreAtCell(scores, t.Id, s.Id))
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
        // GET api/scoreboard/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/scoreboard
        public void Post(string value)
        {
        }

        // PUT api/scoreboard/5
        public void Put(int id, string value)
        {
        }

        // DELETE api/scoreboard/5
        public void Delete(int id)
        {
        }
    }
}