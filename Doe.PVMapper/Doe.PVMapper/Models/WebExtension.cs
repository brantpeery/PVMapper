using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using DreamSongs.MongoRepository;

namespace Doe.PVMapper.Models
{
    public class WebExtension: IEntity
    {

        // There seems to be a bug or change in the deserializer that prevents us from inheriting from Entity.
        [MongoDB.Bson.Serialization.Attributes.BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }

         public string Name { get; set; }

        public string Description { get; set; }

        public string Url { get; set; }

        public string Author { get; set; }

        public string HelpUrl { get; set; }
    }
}