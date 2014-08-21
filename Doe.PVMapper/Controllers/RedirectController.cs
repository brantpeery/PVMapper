using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Doe.PVMapper.Controllers
{
    public class RedirectController : Controller
    {
        //
        // GET: /Redirect/

        /// <summary>
        /// Redurects the browser to another page. In production (Release build) this leads to pvmapper.org, while in Test (Debug build) this leads to the /App Index
        /// </summary>
        [AllowAnonymous]
        public ActionResult Index()
        {
#if DEBUG
            return RedirectToAction("Index", "App");
#else
            return Redirect("http://pvmapper.org");
#endif
        }

    }
}
