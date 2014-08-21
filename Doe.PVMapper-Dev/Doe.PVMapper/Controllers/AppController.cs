using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Doe.PVMapper.Models;
using Doe.PVMapper.WebApi;
using MongoRepository;

namespace Doe.PVMapper.Controllers
{
    public class AppController : Controller
    {
        private string getModules() {
            var modules = "";

            var modulePath = "/Scripts/toolModules";
            string actualPath = ControllerContext.HttpContext.Server.MapPath(modulePath);
            var files = Directory.GetFiles(actualPath, "*.js", SearchOption.TopDirectoryOnly);
            for (int i = 0; i < files.Length; i++) {
                files[i] = "'" + modulePath + '/' + Path.GetFileName(files[i]) + "'";
            }
            modules = string.Join(",", files);
            modules =  "pvClient.getIncludeModules = function () { " +
                       "return [" + 
                       modules + 
                       "]}";
             return modules;
        }

        public ActionResult Index()
        {
            ViewBag.Message = "PV Mapper - Find a sweet spot for your solar array.";
            ViewBag.toolModules = getModules();
            //var model = _repository.All(m => m.Url != null);
            //return View(model);
            return View(); 
        }

        //public ActionResult tsindex()
        //{
        //    ViewBag.Message = "PV Mapper - Test of the TS js files.";

        //    var model = _repository.All(m => m.Url != null);
        //    return View();
        //}

        //public ActionResult About()
        //{
        //    ViewBag.Message = "Locate places favorable to the installation of solar panels.";

        //    return View();
        //}

        //public ActionResult Contact()
        //{
        //    ViewBag.Message = "Your quintessential contact page.";

        //    return View();
        //}

        //private static readonly IRepository<WebExtension> _repository = MongoHelper.GetRepository<WebExtension>();
    }
}