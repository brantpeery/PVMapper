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
{// could have used traditional json instead, but the array will be less verbose
    // http://www.sencha.com/forum/showthread.php?229630-Simple-question-on-getting-JSON-data-through-REST-using-Ext.data.ArrayStore
    public class ScoreboardController : ApiController
    {
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
        public JArray Get()
        {
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
            //return new ScoreboardRow[] { 
            //    new ScoreboardRow("3m co", 32, 0.3),
            //    new ScoreboardRow("Alcoa Inc", 32, 0.3),
            //    new ScoreboardRow("Altria Group Inc", 32, 0.3),
            //    new ScoreboardRow("American Express Company", 32, 0.3)

            //};
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

    public class ScoreboardRow
    {
        /// <summary>
        /// Initializes a new instance of the ScoreboardRow class.
        /// </summary>
        public ScoreboardRow(string tool, double rank, double score)
        {
            Tool = tool;
            Rank = rank;
            Score = score;
        }
        public string Tool { get; set; }
        public double Rank { get; set; }
        public double Score { get; set; }
    }
}
