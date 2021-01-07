using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication3.Models
{
    [BsonIgnoreExtraElements]
    public class Mapping
    {
        public string RoomId { get; set; }
        public string BuildingNo { get; set; }
        public string RealEstateNo { get; set; }
    }
}
