using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace WebApplication3.Resources
{
    public class JsonContent : StringContent
    {
        public JsonContent(object obj) : base(JsonConvert.SerializeObject(obj), Encoding.UTF8, "application/json")
        { }
    }
    public class PostIsAllowCheck
        {
        public string gzldyid { get; set; }
        public List<bdcdyhs> bdcdyhList { get; set; }
    }
    public class PostCreateProcessObject:ParamJson
    {
     
        public List<bdcdyhs> bdcdyxxList { get; set; }
    }
    public class ParamJson
    {
        public string gzldyid { get; set; }
        public string jbxxid { get; set; }
        public string slbh { get; set; }
        public string czrid { get; set; }
    }
}
