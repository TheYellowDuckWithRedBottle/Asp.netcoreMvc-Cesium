using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication3.Models;
using WebApplication3.Resources;
using WebApplication3.Services;

namespace WebApplication3.Controllers
{
    public class RealEstateController : Controller
    {
        private RealEstateService _realEstateService;
        public RealEstateController(RealEstateService realEstateService)
        {
            _realEstateService = realEstateService;
        }
        public IActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 根据栋号和房间号获取不动产信息
        /// </summary>
        /// <param name="NatbuildNo">栋号</param>
        /// <param name="RoomId">房间号</param>
        /// <returns>不动产信息</returns>
        [HttpGet]
        public ActionResult GetRealEstateNo([FromQuery] string BuildingNo, [FromQuery] string RoomId)
        {
           
            var mappingObj = _realEstateService.GetOne(BuildingNo, RoomId);
            if (mappingObj == null || mappingObj.RealEstateNo == null) return Ok(new ReturnModel() { Code = 404, Msg ="未查找到此条记录"});

            else return Ok(mappingObj.RealEstateNo);
        }
        [HttpGet]
        public IActionResult GetRealEstateView([FromQuery] string RealEstateNo)
        {

            if (string.IsNullOrEmpty(RealEstateNo))
                return NotFound();
            var mappingService = new MappingService();
            var mapping=  mappingService.GetHouseHold(RealEstateNo);
            if (mapping == null) return Ok(new ReturnModel() { Code = 404, Msg = "未查到此房号" });
            else return View(mapping);
        }
        [HttpGet]
        public IActionResult Room([FromQuery] string RealEstateNo)
        {
            if (string.IsNullOrEmpty(RealEstateNo))
                return NotFound();
            var mappingService = new MappingService();
            var mapping = mappingService.GetHouseHold(RealEstateNo);
            if (mapping == null) return Ok(new ReturnModel() { Code = 404, Msg = "未查到此房号" });
            else return View(mapping);
        }


    }
}
