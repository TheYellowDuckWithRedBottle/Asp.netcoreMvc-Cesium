using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication3.Resources
{
    public class RoomStatus
    {
        public List<string> SealList { get; set; }
        public List<string> MortgageList { get; set; }
        public string BuildingNo { get; set; }
        public void DeleteSameModel()
        {
           this.MortgageList= this.MortgageList.Except(this.SealList).ToList();
        }
    }
}
