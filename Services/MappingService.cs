using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication3.Models;

namespace WebApplication3.Services
{
    public class MappingService
    {
        private readonly IMongoCollection<Mapping> _Mapping;
       
        public MappingService()
        {
            //var ConnectString = configuration.GetConnectionString("DefaultConnection");
            //var DBName = configuration.GetConnectionString("DatabaseName");
            //var client = new MongoClient(ConnectString);
            //var database = client.GetDatabase(DBName);
            //_Equity = database.GetCollection<Equity>("Equity");
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("SuQianDB");
            _Mapping = database.GetCollection<Mapping>("mapping");
        }

        public List<Mapping> GetAll() =>
            _Mapping.Find(Mapping => true).ToList();
        public Mapping GetHouseHold(string EstateNo)
        {
            var filterBuilder = Builders<Mapping>.Filter;
            FilterDefinition<Mapping> filter = filterBuilder.Eq("RealEstateNo", EstateNo);
            var mapping = _Mapping.Find(filter).FirstOrDefault();
            return mapping;
        }
        public Mapping GetOne(string BuildingNo, string RoomId)
        {

            var filterBuilder = Builders<Mapping>.Filter;

            FilterDefinition<Mapping> filter = filterBuilder.Eq("RoomId", RoomId) & filterBuilder.Eq("BuildingNo", BuildingNo);
            var mapping = _Mapping.Find(filter).FirstOrDefault();

            // FilterDefinition<Mapping> filter = filterBuilder.Eq("RoomId", RoomId);
            //var mappingList = _Mapping.Find(filter).ToList();
            //var mapping = mappingList.Find(item => item.BuildingNo == BuildingNo);
            return mapping;
        }
    }
}
