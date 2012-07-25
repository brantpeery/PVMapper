using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DreamSongs.MongoRepository;

namespace Doe.PVMapper.Models
{
    /// <summary>
    ///
    /// </summary>
    public class SiteScore : Entity
    {
        /// <summary>
        /// Gets or sets the site ID.
        /// </summary>
        /// <value>
        /// The site ID.
        /// </value>
        public string SiteId { get; set; }

        /// <summary>
        /// Gets or sets the score. This could be a numeric or enumerated value that should make sense when comparing sites.
        /// </summary>
        /// <value>
        /// The score.
        /// </value>
        public string Score { get; set; }

        /// <summary>
        /// Gets or sets the tool description.
        /// </summary>
        /// <value>
        /// The tool description.
        /// </value>
        public string ToolDescription { get; set; }

        /// <summary>
        /// Gets or sets the rank. This is a hidden field from 0-1 that we use to rank the sites.
        /// </summary>
        /// <value>
        /// The rank.
        /// </value>
        public double Rank { get; set; }

        /// <summary>
        /// Gets or sets the URL to more information about the score, rank, or tool.
        /// </summary>
        /// <value>
        /// The more link.
        /// </value>
        public string MoreLink { get; set; }

        //public List<Product> Products { get; set; }
        //public SiteScore()
        //{
        //    this.Products = new List<Product>();
        //}
    }
}