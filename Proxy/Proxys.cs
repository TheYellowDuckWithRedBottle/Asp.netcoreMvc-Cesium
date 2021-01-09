using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebApplication3.Resources;
using System.Net.Http.Headers;

namespace WebApplication3.Proxy
{
    public class Proxys
    {
        private string HostIp = "http://192.168.188.130:8030";
        public string Tokendomain = "/account/oauth/token?grant_type=password&client_id=storageUI&client_secret=dOffl1LGmnm4CTW0jDOv&username=ld&password=Ld1234";
        private string tokenUrl;
        private string RequestUrl = "";
        public string token { get; set; }
        public Proxys()
        {
            this.tokenUrl = HostIp + Tokendomain;
        }
        public Proxys(string _RuquestUrl)
        {
            this.RequestUrl = this.HostIp+_RuquestUrl;
        }
        //获取token
      async  public Task<string> getToken()
        {
            using (var httpClient = new HttpClient())
            {
                var requestUri = this.tokenUrl;
                HttpContent httpContent=null;
                var httpResponseMessage =await httpClient.PostAsync(requestUri, httpContent);
               var response= httpResponseMessage.Content;
               string  result = response.ReadAsStringAsync().Result;
                return result;
            }
        }
        
        async public Task<string> getInfo(string bdcdyh)
        {
            using (var httpClient = new HttpClient())
            {

                HttpContent Content = new StringContent(bdcdyh);
                var formData = new MultipartFormDataContent();
                formData.Add(Content, "bdcdyh");
                var httpResponseMessage = await httpClient.PostAsync(RequestUrl, formData);
                var response = httpResponseMessage.Content;
                string result = response.ReadAsStringAsync().Result;
                return result;
            }
        }
        async public Task<string> RuleCheck(PostIsAllowCheck postIsAllowCheck)
        {
            using (var httpClient = new HttpClient())
            {
                var formData = new MultipartFormDataContent();
                var Content =  JsonConvert.SerializeObject(postIsAllowCheck);
                HttpContent requestBody = new StringContent(Content);
                //formData.Add(Content);
                var httpResponseMessage = await httpClient.PostAsync(RequestUrl, requestBody);
                var response = httpResponseMessage.Content;
                string result = response.ReadAsStringAsync().Result;
                return result;
            }
        }
        async public Task<string> CreateWorkFlow(PostCreateProcessObject postCreateProcessObject)
        {
            using (var httpClient = new HttpClient())
            {
                var formData = new MultipartFormDataContent();
                var Content = new JsonContent(postCreateProcessObject);
                //formData.Add(Content);
                var httpResponseMessage = await httpClient.PostAsync(RequestUrl, Content);
                var response = httpResponseMessage.Content;
                string result = response.ReadAsStringAsync().Result;
                return result;
            }
        }
        
    }
}
