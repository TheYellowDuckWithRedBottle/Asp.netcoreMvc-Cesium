using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApplication3.Models;
using WebApplication3.Resources;
using WebApplication3.Services;
using WebApplication3.Proxy;
using System.Text.RegularExpressions;

namespace WebApplication3.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly RealEstateService _realEstateService;
        public HomeController(ILogger<HomeController> logger,RealEstateService realEstateService)
        {
            _logger = logger;
            
            _realEstateService = realEstateService;
        }
        public IActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 根据一个不动产号获取一个模型用于移动端
        /// </summary>
        /// <param name="RealEstateNo"></param>
        /// <returns></returns>
        /// 
        [HttpGet]
        public IActionResult RealEstateNo([FromQuery]string RealEstateNo)
        {
  
                if (string.IsNullOrEmpty(RealEstateNo))
                // return View(new ReturnModel() { Code = 404, Msg = "输入参数为空" });
                return Ok(new ReturnModel() { Code = 404, Msg = "输入参数为空" });  
                var mapping = _realEstateService.GetHouseHold(RealEstateNo);
                if (mapping == null) return  Ok(new ReturnModel() { Code = 404, Msg = "未查找到房号" });
                else return View(mapping); 
        }
        public IActionResult Room([FromQuery]string RealEstateNo)
        {
            if (string.IsNullOrEmpty(RealEstateNo))
                // return View(new ReturnModel() { Code = 404, Msg = "输入参数为空" });
                return NotFound();
            var mapping = _realEstateService.GetHouseHold(RealEstateNo);
            if (mapping == null) return NotFound();
            else return View(mapping);
        }

      /// <summary>
      /// 根据多个不动产号获取多个模型
      /// </summary>
      /// <param name="RealEstateNos"></param>
      /// <returns></returns>
        [HttpGet]
        public IActionResult RealEstateNos([FromQuery] List<string> RealEstateNos)
        {
            
            if (RealEstateNos==null|| RealEstateNos.Count == 0)
            {
                return Ok(new ReturnModel() { Code = 404, Data = null, Msg = "Home/RealEstateNo,当前不动产号列表为空" });
            }  
            List<RealEstate> mappings = new List<RealEstate>();
            foreach (var item in RealEstateNos)
            {
                var mapping = _realEstateService.GetHouseHold(item);
                mappings.Add(mapping);
            }
            if (mappings.Count == 0||mappings==null)
                return Ok(new ReturnModel() { Code = 404, Data = null, Msg = "Home/RealEstateNo,未从映射表中找到户号" });
            else return View(mappings);

        }
      /// <summary>
      /// post方法根据不动产号获取房间号
      /// </summary>
      /// <param name="RealEstateNos"></param>
      /// <returns></returns>
        [HttpPost]
        public ActionResult GetRoomIdFromRealEstateNos([FromBody] ParamsModel RealEstateNos)
        {
            if (RealEstateNos==null||RealEstateNos.RealEstateNos.Length == 0)
            {
                return Ok(new ReturnModel() { Code = 404, Msg = "Home/GetRoomIdFromRealEstateNos,当前参数为空", Data=null });
            }
            List<RealEstate> mappings = new List<RealEstate>();
            foreach (var item in RealEstateNos.RealEstateNos)
            {
                var mapping = _realEstateService.GetHouseHold(item);
                mappings.Add(mapping);
            }
            if (mappings.Count == 0) return Ok(new ReturnModel() { Code = 404, Msg = "Home/GetRoomIdFromRealEstateNos,未从映射表中找到户号" });
            
            else return Ok(mappings);
        }
      /// <summary>
      /// 根据不动产栋号和房间号获取属性
      /// </summary>
      /// <param name="token"></param>
      /// <param name="BuildingNo"></param>
      /// <param name="RoomId"></param>
      /// <returns></returns>
        [HttpGet]
       async public Task<ActionResult> GetInfoByRoomId([FromQuery] string token,[FromQuery] string BuildingNo, [FromQuery] string RoomId)
        {
            var mappingObj = _realEstateService.GetOne(BuildingNo, RoomId);
            if (mappingObj == null || mappingObj.RealEstateNo == null) return NotFound();
           var  info= await GetRoomInfo1(token, mappingObj.RealEstateNo);
            if (info == null)
            {
                return NotFound();
            }
            return Ok(info);  
        }
        async private Task<string> GetRoomInfo1([FromQuery] string token, [FromQuery] string bdcdyh)
        {
            string Url = $"/realestate-exchange/rest/v1.0/simple/ijsxST?apiId=04fb298bd76747a7af9d7b778ee16e03&access_token={token}";
            Proxys proxy = new Proxys(Url);
            var Result = await proxy.getInfo(bdcdyh);
            if (Result == null)
                return "未从接口中获得房屋信息";
            return Result;
        }
        [HttpGet]
       async public Task<ActionResult> GetTokenFromServer()
        {
            Proxys proxy = new Proxys();
            var  Result=await proxy.getToken();
            return Ok(Result);
        }
        [HttpGet]
        async public Task<ActionResult> GetPowerType([FromQuery]string token,[FromQuery]string bdcdyh)
        {
            string Url = $"/realestate-exchange/rest/v1.0/simple/WEYeP7?apiId=d1a8e8655cdc4cd3b237e895e3fd07c5&access_token={token}";
            Proxys proxy = new Proxys(Url);
            var Result = await proxy.getInfo(bdcdyh);
            if (Result == null)
                return Ok(new ReturnModel() { Code = 404, Msg = "Home/GetPowerType,未从接口中获得权力状态", Data = null });
            return Ok(Result);
        }
        [HttpGet]
        async public Task<ActionResult> GetRoomInfo([FromQuery] string token, [FromQuery] string bdcdyh)
        {
            string Url = $"/realestate-exchange/rest/v1.0/simple/5xXEdW?apiId=d33127612f30480eae697fa691b4dd91&access_token={token}";
            Proxys proxy = new Proxys(Url);
            var Result = await proxy.getInfo(bdcdyh);
            if (Result == null)
                return Ok(new ReturnModel() { Code = 404, Msg = "Home/GetRoomInfo,未从接口中获得房屋信息", Data = null });
            return Ok(Result);
        }
        [HttpGet]
        async public Task<ActionResult> GetZDInfo([FromQuery]string token, [FromQuery] string bdcdyh)
        {
            string Url = $"/realestate-exchange/rest/v1.0/simple/V4QfRa?apiId=c11971541c114fcf8470620be77b0494&access_token={token}";
            Proxys proxy = new Proxys(Url);
            var Result = await proxy.getInfo(bdcdyh);
            if (Result == null)
                return Ok(new ReturnModel() { Code = 404, Msg = "Home/GetZDInfo,未从接口中获得宗地信息", Data = null });
            return Ok(Result);
        }
        /// <summary>
        /// 根据不动产号和token获取抵押状态
        /// </summary>
        /// <param name="djh"></param>
        /// <returns></returns>
        [HttpGet]
        async  public Task<string> GeMortgagetStatus([FromQuery]string token ,[FromQuery] string djh)
        {
            string Url = $"/realestate-exchange/rest/v1.0/simple/HVzOvO?apiId=2c2d0cb53074494493f40542c007cfe6&access_token={token}";
            Proxys proxys = new Proxys(Url);
            var Result = await proxys.getInfo(djh);
            
            return Result;
        }
        /// <summary>
        /// 根据不动产号和token获取查封状态
        /// </summary>
        /// <param name="djh"></param>
        /// <returns></returns>
        [HttpGet]
        async public Task<string> GetSealedStatus([FromQuery] string token, [FromQuery] string djh)
        {
            string Url = $"/realestate-exchange/rest/v1.0/simple/tFikjk?apiId=43b7e2e39def48908d1865aa5fce9af9&access_token={token}";
            Proxys proxys = new Proxys(Url);
            var Result = await proxys.getInfo(djh);
            return Result;
        }
        [HttpPost]
        public ActionResult GetStatus([FromQuery] string token, [FromBody] ParamsModel RealEstateNos)
        {
            List<RoomStatus> roomStatuses = new List<RoomStatus>();
            foreach (var item in RealEstateNos.RealEstateNos)
            {
                RoomStatus roomStatus = new RoomStatus();
                var queryString = item.Substring(0, 19); //截取地籍号
                roomStatus.MortgageList= ConvertMorToString(token, queryString);//查询抵押List
                roomStatus.SealList = ConvertToSealString(token, queryString);//查询查封List
                //roomStatus.DeleteSameModel();
                var Mapping=_realEstateService.GetHouseHold(item);
                roomStatus.BuildingNo = Mapping.BuildingNo;
                roomStatuses.Add(roomStatus);
            }  
            return Ok(roomStatuses);
        }
        //从一个地籍号转化为房号
        private List<string> ConvertMorToString(string token, string djh)
        {
            var ResultMortgage = GeMortgagetStatus(token, djh);//请求抵押
            List<string> MortgageArray= ConvertStringToList(ResultMortgage.Result);
            return MortgageArray;
        }
        private List<string> ConvertToSealString(string token, string djh)
        {
            var ResultSeal = GetSealedStatus(token, djh);//请求查封
            List<string> MortgageArray = ConvertStringToList(ResultSeal.Result);
            return MortgageArray;
        }
        private List<string> ConvertStringToList(string InputString)
        {
            char[] charArr = new char[] { '"', '{', '}' };
            List<string> stringList = new List<string>();
            //JsonConvert.DeserializeObject<>(InputString);
            string pattern3 = @"\{[^{}]+}";
            foreach (Match match in Regex.Matches(InputString,pattern3))
            {
                stringList.Add(match.Value);
            }
 
    
            string MortageArray = stringList[0].Split(':')[1].Trim(charArr);

            string[] MortageList = MortageArray.Split(',');

            ParamsModel paramsModel = new ParamsModel();
            paramsModel.RealEstateNos = MortageList;

            var MortageResult = GetRoomIds(paramsModel);
            List<string> MortgageArray = new List<string>();
            if (MortageArray == null || MortageArray.Length == 0) 
                return MortgageArray;
            else
            {
                foreach (var item in MortageResult)
                {
                    MortgageArray.Add(item.RoomId);
                }
                return MortgageArray;
            }
           
        }
        private List<RealEstate> GetRoomIds([FromBody] ParamsModel RealEstateNos)
        {
            if (RealEstateNos == null || RealEstateNos.RealEstateNos.Length == 0)
            {
                return new List<RealEstate>();
            }
            List<RealEstate> mappings = new List<RealEstate>();
            foreach (var item in RealEstateNos.RealEstateNos)
            {
                MappingService mappingService = new MappingService();
                var mapping = _realEstateService.GetHouseHold(item);
                mappings.Add(mapping);
            }
            if (mappings.Count == 0) return new List<RealEstate>();

            else return mappings;
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
