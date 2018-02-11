using System;
using EPiServer;
using EPiServer.Logging;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;

namespace ITMeric.ImageCrop.Core
{

    [Serializable]
    public abstract class MediaReference
    {
        protected Injected<IUrlResolver> UrlResolver;
        protected Injected<ILogger> Logger;
        protected Injected<IContentRepository> ContentRepository;

        public string Id { get; set; }
        public string PublicUrl { get; set; }
        //public string Caption { get; set; }

    }
}
