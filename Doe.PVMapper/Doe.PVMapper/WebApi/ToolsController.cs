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
        public IEnumerable<WebExtension> Get()
        {
            return _repository.All();
        }

        // GET api/tools/
        public string Get(int id)
        {
            return "value";
        }

        // POST api/tools
        public IEnumerable<TreeNode> Post(TreeListPayload payload)
        {
            if (payload.Node != "allitems")
            {
                yield break;
            }

            foreach (WebExtension webExtension in Get())
            {
                var treeNode = new TreeNode();
                treeNode.Id = 1;
                treeNode.Text = webExtension.Name;
                treeNode.Url = webExtension.Url;
                yield return treeNode;
            }
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