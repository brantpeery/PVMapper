using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using DreamSongs.MongoRepository;

namespace Doe.PVMapper.Models
{
    public class WebExtension : Entity
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Url { get; set; }

        public string Author { get; set; }

        public string HelpUrl { get; set; }
    }
}