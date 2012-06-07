using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Doe.PVMapper.Models;
using DreamSongs.MongoRepository;

namespace Doe.PVMapper.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "PV Mapper - Find a sweet spot for your solar array.";

            return View("v5");
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Index(string ToolTextBox)
        {
            ViewData["Message"] = "You added a tool!";
            ViewData["ToolUrl"] = ToolTextBox;
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Locate places favorable to the installation of solar panels.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your quintessential contact page.";

            return View();
        }

        public ActionResult v3()
        {
            return View();
        }

        public ActionResult v4()
        {
            return View();
        }

        private static readonly IRepository<WebExtension> _repository = new MongoRepository<WebExtension>();

        public ActionResult v5()
        {
            var model = _repository.All(m => m.Url != null);
            return View(model);
        }
    }
}