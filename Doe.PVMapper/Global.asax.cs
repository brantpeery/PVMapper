using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Doe.PVMapper
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode,
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);

            BundleTable.Bundles.RegisterTemplateBundles();

            //http://codebetter.com/johnpetersen/2012/03/06/asp-net-mvc-4-beta-bundling-and-minification-dymystified/
            IBundleTransform jstransformer;
            IBundleTransform csstransformer;

#if true// DEBUG
            jstransformer = new NoTransform("text/javascript");
            csstransformer = new NoTransform("text/css");
#else
            jstransformer = new JsMinify();
            csstransformer = new CssMinify();
#endif

            var bundle = new Bundle("~/ext-resources/files/css", csstransformer);
            bundle.AddFile("~/ext-resources/css/ext-all.css");
            bundle.AddFile("~/ext-resources/css/xtheme-gray.css");
            BundleTable.Bundles.Add(bundle);

            // These need to be in a particular order.
            bundle = new Bundle("~/ext-resources/files/js", jstransformer);
            bundle.AddFile("~/ext-resources/js/ext-base.js");
            bundle.AddFile("~/ext-resources/js/ext-all.js");
            bundle.AddFile("~/ext-resources/js/OpenLayers.js");
            bundle.AddFile("~/ext-resources/js/GeoExt.js");
            BundleTable.Bundles.Add(bundle);
        }
    }
}