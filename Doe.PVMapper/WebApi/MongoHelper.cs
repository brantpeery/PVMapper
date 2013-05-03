using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Doe.PVMapper.Models;
using MongoRepository;
using MongoDB.Driver;

namespace Doe.PVMapper.WebApi
{
    public static class MongoHelper
    {
        private static string GetConnectionString()
        {
            var connectionstring = ConfigurationManager.AppSettings.Get("MONGOLAB_URI");
            return connectionstring;
        }

        public static MongoDatabase GetDatabase()
        {
            string connectionstring = GetConnectionString();
            var client = new MongoClient(connectionstring);
            var server = client.GetServer();
            var database = server.GetDatabase(connectionstring);
            //var database = MongoDatabase.Create(connectionstring);

            return database;
        }

        public static MongoRepository<T> GetRepository<T>() where T : IEntity
        {
            string connectionString = GetConnectionString();
            if (connectionString == null)
                throw new ArgumentNullException("Connection string not found.");
            var repository = new MongoRepository<T>(new MongoUrl(connectionString));
            return repository;
        }
    }
}