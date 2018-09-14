using System;
using EPiServer;
using EPiServer.Logging;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;
using Newtonsoft.Json;

namespace ITMeric.ImageCrop.Core
{

    [Serializable]
    public abstract class MediaReference
    {
        //protected Injected<IUrlResolver> UrlResolver;
        //protected Injected<ILogger> Logger;
        //protected Injected<IContentRepository> ContentRepository;

        public long Id { get; set; }

        public abstract MediaReferenceType MediaType { get; } 

        public string PreviewUrl { get; set; }

        [JsonIgnore]
        public virtual string Url { get; }
    }
}
