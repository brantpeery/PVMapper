using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Doe.PVMapper.Controllers
{
    public class SiteDetailController : Controller
    {
        //
        // GET: /SiteDetail/
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Feedback()
        {
            return View();
        }
    }
}