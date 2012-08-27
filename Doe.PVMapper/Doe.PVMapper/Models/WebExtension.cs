using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using DreamSongs.MongoRepository;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Doe.PVMapper.Models
{
    /// <summary>
    /// 
    /// </summary>
    [JsonObject(MemberSerialization.OptOut)]
    public class WebExtension : Entity
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Url { get; set; }

        public string Author { get; set; }

        public string HelpUrl { get; set; }

        /// <summary>
        /// This is a unique id that the tool is using to post back its scores.
        /// </summary>
        public string UniqueIdentifier { get; set; }
    }
}