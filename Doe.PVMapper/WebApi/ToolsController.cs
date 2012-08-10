using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using Doe.PVMapper.Models;
using DreamSongs.MongoRepository;

namespace Doe.PVMapper.WebApi
{
    public class ToolsController : ApiController
    {
        private static readonly IRepository<WebExtension> _repository = MongoHelper.GetRepository<WebExtension>();

        // GET api/tools
        public object Get()
        {
            var queryString = this.Request.RequestUri.ParseQueryString();
            var nodename = queryString.Get("node");
            if (nodename == "root")
                return GetNodes();

            return _repository.All();
        }

        private IEnumerable<TreeNode> GetNodes()
        {
            foreach (WebExtension webExtension in _repository.All())
            {
                var treeNode = new TreeNode();
                treeNode.Text = webExtension.Name;
                treeNode.Url = webExtension.Url;
                yield return treeNode;
            }
        }

        // GET api/tools/
        public string Get(int id)
        {
            return "value";
        }

        // POST api/tools
        public void Post(string value)
        {

        }

        // PUT api/tools/5
        public void Put(int id, string value)
        {
        }

        // DELETE api/tools/5
        public void Delete(int id)
        {
        }
    }
}