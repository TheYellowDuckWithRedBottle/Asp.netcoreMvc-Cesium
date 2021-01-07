using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication3.Resources;

namespace WebApplication3.Services
{
    public class OperateService
    {
        private readonly IMongoCollection<SaveOperate> _Operation;

        public OperateService()
        {

            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("SuQianDB");
            _Operation = database.GetCollection<SaveOperate>("Operate");
        }

        public List<SaveOperate> GetAll() =>
            _Operation.Find(Mapping => true).ToList();
        public SaveOperate GetOperate(string ID)
        {
            var filterBuilder = Builders<SaveOperate>.Filter;
            FilterDefinition<SaveOperate> filter = filterBuilder.Eq("_id", ID);
            var saveOperate = _Operation.Find(filter).FirstOrDefault();
            return saveOperate;
        }
        public SaveOperate Save(SaveOperate saveOperate)
        {
            _Operation.InsertOne(saveOperate);
            return saveOperate;
        }
    }
}
