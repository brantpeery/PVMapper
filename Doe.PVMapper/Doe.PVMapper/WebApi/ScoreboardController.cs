using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Doe.PVMapper.Models;
using DreamSongs.MongoRepository;
using Newtonsoft.Json.Linq;

namespace Doe.PVMapper.WebApi
{
    public class JField
    {
        public string Name { get; set; }
        public string Type { get; set; }
    }

    public class JColumn
    {
        public string Text { get; set; }
        public string DataIndex { get; set; }
    }

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
            // add some linq http://james.newtonking.com/projects/json/help/index.html?topic=html/LINQtoJSON.htm
            JObject result = new JObject(
                new JProperty("metaData",
                    new JObject(
                        new JProperty("root", "records"),
                        new JProperty("fields",
                            new JArray(
                                new JObject(
                                    new JProperty("name", "id"),
                                    new JProperty("type", "int")
                                ),
                                new JObject(
                                    new JProperty("name", "name"),
                                    new JProperty("type", "string")
                                )
                            )
                        ),

                        new JProperty("columns",
                            new JArray(
                                new JObject(
                                    new JProperty("text", "#"),
                                    new JProperty("dataIndex", "id")
                                ),
                                new JObject(
                                    new JProperty("text", "User"),
                                    new JProperty("dataIndex", "name")
                                )
                            )
                        )
                    )
                ),
                new JProperty("records",
                    new JArray(
                        new JObject(
                            new JProperty("id", 1),
                            new JProperty("name", "aaa")
                        ),
                            new JObject(
                                new JProperty("id", 2),
                                new JProperty("name", "bbb")
                            )
                    )
                )
            );

            return result;
            JArray arrays = new JArray();
            //IRepository<ProjectSite> sites = MongoHelper.GetRepository<ProjectSite>();
            //foreach (var site in sites.All())
            //{
            //    arrays.Add(GetArray(site.Name));
            //}

            IRepository<WebExtension> extensions = MongoHelper.GetRepository<WebExtension>();
            foreach (var extension in extensions.All())
            {
                arrays.Add(GetArray(extension.Name));
            }

            arrays.Add(GetArray("3m co."));
            arrays.Add(GetArray("Alcoa Inc"));
            arrays.Add(GetArray("Altria Group Inc"));
            arrays.Add(GetArray("American Express Company"));

            return arrays;
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