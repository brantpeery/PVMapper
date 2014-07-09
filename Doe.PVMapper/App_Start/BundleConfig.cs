using System.Collections.Generic;
using System.Web;
using System.Web.Optimization;

namespace Doe.PVMapper
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bundles.Add(new StyleBundle("~/ext-resources/files/css").Include(
            //            "~/ext-resources/css/ext-all.css",
            //            "~/ext-resources/css/xtheme-gray.css"));

            // These need to be in a particular order.
            //Bundle bundle = new ScriptBundle("~/bundles/extjs").Include(
            //                        "~/ext-resources/js/ext-base.js",
            //                        "~/ext-resources/js/ext-all.js",
            //                        "~/ext-resources/js/OpenLayers.js",
            //                        "~/ext-resources/js/GeoExt.js");
            //bundles.Add(bundle);
            
            // todo: add the cnd links for jquery etc. as the second parameter to each scriptbundle.
            // bundles.UseCdn = true;   //enable CDN support
            
            bundles.Add(new ScriptBundle("~/bundles/jquerydatatables").Include(
            "~/Scripts/DataTables-1.9.2/media/js/jquery.dataTables.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-1.*" /*,
                        "~/Scripts/jquery-ui-*"*/));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}
