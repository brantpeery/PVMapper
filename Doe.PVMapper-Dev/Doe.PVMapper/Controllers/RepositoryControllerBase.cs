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
    public abstract class RepositoryControllerBase<T> : Controller where T : IEntity
    {

        private static readonly IRepository<T> _db = MongoHelper.GetRepository<T>();
        //
        // GET: /[T]/

        public ActionResult Index()
        {
            var model = _db.All();

            return View(model);
        }

        //
        // GET: /[T]/Details/5

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
        // GET: /[T]/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /[T]/Create

        [HttpPost]
        public ActionResult Create(T model)
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
        // GET: /[T]/Edit/5

        public ActionResult Edit(string id)
        {
            var sample = _db.GetSingle(c => c.Id == id);
            var model = _db.GetById(id);
            if (model == null)
            {
                return View();
            }

            return View(model);
        }

        //
        // POST: /[T]/Edit/5

        [HttpPost]
        public ActionResult Edit(string id, T model)
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
        // GET: /[T]/Delete/5

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
        // POST: /[T]/Delete/5

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