using System.Web;
using System.Web.Mvc;

namespace Doe.PVMapper
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new AuthorizeAttribute());
#if !DEBUG
            // Modify the project properties and check the SSL Enabled to True and under SSL URL set the SSL url port 443 
            // if you want SSL during debug on IIS Express.

            // A custom RequireHttpsAttribute is needed to get across the load balancer at Appharbor.
            // filters.Add(new RequireHttpsAttribute());                      
#endif
            // this custom attribute will not require SSL on the desktop. You would need to use the default implementation (above)
            filters.Add(new AppHarbor.Web.RequireHttpsAttribute());

            // Consider API Key Authorization Through Query String In ASP.NET Web API AuthorizationFilterAttribute
            //http://www.tugberkugurlu.com/archive/api-key-authorization-through-query-string-in-asp-net-web-api-authorizationfilterattribute
        }
    }
}