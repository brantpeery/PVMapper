using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Doe.PVMapper.Models;
using Doe.PVMapper.WebApi;
using DreamSongs.MongoRepository;

namespace Doe.PVMapper.Controllers
{
    public class ExtensionsController : Controller
    {
        private static readonly IRepository<WebExtension> _db = MongoHelper.GetRepository<WebExtension>();
        //
        // GET: /Extensions/

        public ActionResult Index()
        {
            var model = _db.All();
            return View(model);
        }

        //
        // GET: /Extensions/Details/5

        public ActionResult Details(string id)
        {
            var model = _db.GetById(id);
            if (model == null)
            {
                return View();
            }

            return View(model);
        }

        //
        // GET: /Extensions/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Extensions/Create

        [HttpPost]
        public ActionResult Create(WebExtension model)
        {
            try
            {
                _db.Add(model);

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Extensions/Edit/5

        public ActionResult Edit(string id)
        {
            var model = _db.GetById(id);
            if (model == null)
            {
                return View();
            }

            return View(model);
        }

        //
        // POST: /Extensions/Edit/5

        [HttpPost]
        public ActionResult Edit(string id, WebExtension model)
        {
            try
            {
                _db.Update(model);

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Extensions/Delete/5

        public ActionResult Delete(string id)
        {
            var model = _db.GetById(id);
            if (model == null)
            {
                return View();
            }

            return View(model);
        }

        //
        // POST: /Extensions/Delete/5

        [HttpPost]
        public ActionResult Delete(string id, FormCollection collection)
        {
            try
            {
                _db.Delete(id);

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}