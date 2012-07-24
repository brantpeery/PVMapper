using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DreamSongs.MongoRepository;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Doe.PVMapper.Models
{

    /// <summary>
    /// A site that represents a potential project location.
    /// </summary>
    public class ProjectSite : Entity
    {
        /// <summary>
        /// Gets or sets the site ID.
        /// </summary>
        /// <value>
        /// The site ID.
        /// </value>
        [BsonIgnore]
        public string SiteId { get { return base.Id; } }

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
        public string PolygonGeometry { get; set; }



    }
}