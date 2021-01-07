using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication3.Proxy;
using WebApplication3.Resources;
using WebApplication3.Services;

namespace WebApplication3.Controllers
{
    public class GTMapController:ControllerBase
    {

        private readonly OperateService _savOperateService;
        public GTMapController(OperateService saveOperate)
        {
            this._savOperateService = saveOperate;
        }
        [HttpPost]
        async public Task<ActionResult> IsAllowRegister([FromQuery]string token,[FromQuery]string guid,[FromBody]ParamsModel bdcdyhList)
        {
            if (String.IsNullOrEmpty(token)||string.IsNullOrEmpty(guid)||bdcdyhList==null)
            {
                return Ok(new ReturnModel() { Msg="未找到参数"});
            }
            var saveOperate=_savOperateService.GetOperate(guid);
            if (saveOperate == null)
            {
                return Ok(new ReturnModel() { Msg = "未查找到此次操作" });
            }
            List<bdcdyhs> bdcdyhs = new List<bdcdyhs>() { };
            
            foreach (var item in bdcdyhList.RealEstateNos)
            {
                bdcdyhs bdcdyhs1 = new bdcdyhs() { };
                bdcdyhs1.bdcdyh = item;
                bdcdyhs.Add(bdcdyhs1);
            }
            PostIsAllowCheck postIsAllowCheck = new PostIsAllowCheck() { bdcdyhList = bdcdyhs, gzldyid = saveOperate.ParamJson.gzldyid };
            string Url = $"/realestate-exchange/rest/v1.0/interface/bdcdycjgzyz?access_token={token}";
            Proxys proxy = new Proxys(Url);
            var Result = await proxy.RuleCheck(postIsAllowCheck);
            return Ok(Result);
        }

        [HttpPost]
        async public Task<ActionResult> RegisterCreateInterface([FromQuery] string token,[FromQuery] string guid, [FromBody] ParamsModel bdcdyhList)
        {
            var saveOperate = _savOperateService.GetOperate(guid);
            if (saveOperate == null)
            {
                return Ok(new ReturnModel() { Code = 404, Data = null, Msg = "未查找到本次操作" });
            }
            if (token == null){
                return Ok(new ReturnModel() { Code = 404, Data = null, Msg = "token为空" });
            }
            if (guid == null)
            {
                return Ok(new ReturnModel() { Code = 404, Data = null, Msg = "GUID为空" });
            }
            if (bdcdyhList == null) {
                return Ok(new ReturnModel() { Code = 404, Data = null, Msg = "请求体为空" });
            }
            List<bdcdyhs> bdcdyhs = new List<bdcdyhs>() { };

            foreach (var item in bdcdyhList.RealEstateNos)
            {
                bdcdyhs bdcdyhs1 = new bdcdyhs() { };
                bdcdyhs1.bdcdyh = item;
                bdcdyhs.Add(bdcdyhs1);
            }
            PostCreateProcessObject postIsAllowCheck = new PostCreateProcessObject() 
            { 
                czrid=saveOperate.ParamJson.czrid,
                gzldyid=saveOperate.ParamJson.gzldyid,
                jbxxid=saveOperate.ParamJson.jbxxid,
                slbh=saveOperate.ParamJson.slbh,
                bdcdyxxList = bdcdyhs };
            string Url = $"/realestate-exchange/rest/v1.0/interface/bdcdycj?access_token={token}";
            Proxys proxy = new Proxys(Url);
            var Result = await proxy.CreateWorkFlow(postIsAllowCheck);
            return Ok(Result);
        }
        [HttpPost]
         public ActionResult PostView([FromBody] ParamJson paramsJson)
        {
            string guid = Guid.NewGuid().ToString();
            SaveOperate saveOperate = new SaveOperate() {Id= guid, ParamJson=paramsJson };
            _savOperateService.Save(saveOperate);
          
            var url = $"http://192.168.188.142:8080/DX/index.html#/index?guid={guid}";
            return Ok(url);
        }
        

    }
}
