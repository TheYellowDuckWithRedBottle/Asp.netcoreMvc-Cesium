using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication3.Models;

namespace WebApplication3.Services
{
    public class RealEstateService
    {
        private readonly IMongoCollection<RealEstate> _RealEstate;

        public RealEstateService()
        {

            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("SuQianDB");
            _RealEstate = database.GetCollection<RealEstate>("RealEstate");
        }

        public List<RealEstate> GetAll() =>
            _RealEstate.Find(RealEstate => true).ToList();
        public RealEstate GetHouseHold(string EstateNo)
        {
            var filterBuilder = Builders<RealEstate>.Filter;
            FilterDefinition<RealEstate> filter = filterBuilder.Eq("RealEstateNo", EstateNo);
            var mapping = _RealEstate.Find(filter).FirstOrDefault();
            return mapping;
        }
        public RealEstate GetOne(string BuildingNo, string RoomId)
        {
            var filterBuilder = Builders<RealEstate>.Filter;
            FilterDefinition<RealEstate> filter = filterBuilder.Eq("RoomId", RoomId) & filterBuilder.Eq("BuildingNo", BuildingNo);
            var mapping = _RealEstate.Find(filter).FirstOrDefault();
            return mapping;
        }
        public List<RealEstate> FuzzyQuery(string item)
        {
            var query = "{$text:{$search:" + item + "}}";
            var filter = BsonSerializer.Deserialize<BsonDocument>(query);
            var result = _RealEstate.Find(filter).ToList();
            return result;
        }
    }
}
