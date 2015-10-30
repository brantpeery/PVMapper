using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoRepository;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace Doe.PVMapper.Models
{

    /// <summary>
    /// A site that represents a potential project location.
    /// </summary>
    [JsonObject(MemberSerialization.OptOut)]
    public class ProjectSite : Entity, IEntity
    {
        /// <summary>
        /// Gets or sets the site ID.
        /// </summary>
        /// <value>
        /// The site ID.
        /// </value>
        [BsonIgnore]
        public string SiteId { get { return Id; } }

        /// <summary>
        /// Gets or sets the user id.
        /// </summary>
        /// <value>
        /// The user id.
        /// </value>
        public string UserId { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; }

        //TODO: what the hell was this intended to indicate? What exactly is an inactive site?
        /// <summary>
        /// Gets or sets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is active; otherwise, <c>false</c>.
        /// </value>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the polygon geometry.
        /// </summary>
        /// <value>
        /// The polygon geometry.
        /// </value>
        [BsonIgnoreIfNull]
        [JsonProperty(NullValueHandling=NullValueHandling.Ignore)]
        public string PolygonGeometry { get; set; }
    }
}