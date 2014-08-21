using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Doe.PVMapper
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // redirect old /Home url to the new homepage (in case anyone is using old/outdated links or bookmarks)
            routes.MapRoute(
                "Home",
                "Home/{action}/{id}",
                new { controller = "Redirect", action = "Index", id = UrlParameter.Optional }
            );

            // redirect root url; all other urls are handled by their associated controllers.
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Redirect", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}