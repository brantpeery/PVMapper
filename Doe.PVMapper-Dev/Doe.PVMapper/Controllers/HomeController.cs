using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Doe.PVMapper.Models;
using Doe.PVMapper.WebApi;
using MongoRepository;

namespace Doe.PVMapper.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "PV Mapper - Find a sweet spot for your solar array.";

            var model = _repository.All(m => m.Url != null);
            return View(model);
        }

        public ActionResult tsindex()
        {
            ViewBag.Message = "PV Mapper - Test of the TS js files.";

            var model = _repository.All(m => m.Url != null);
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

        private static readonly IRepository<WebExtension> _repository = MongoHelper.GetRepository<WebExtension>();
    }
}