using System;
using EPiServer.Core;
using EPiServer.Logging;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Newtonsoft.Json;

namespace ITMeric.ImageCrop.Core
{
    [Serializable]
    public class ImageReference : MediaReference 
    {
        public Guid ContentReferenceId { get; set; }
        public string ContentLink { get; set; }
        public CropDetails CropDetails { get; set; }

        [JsonIgnore]
        public ImageData ImageFile
        {
            get
            {
                try
                {
                    return ContentReferenceId != Guid.Empty
                        ? ContentRepository.Service.Get<ImageData>(ContentReferenceId)
                        : null;
                }
                catch (Exception ex)
                {
                    Logger.Service.Error("Could not retrieve Image", ex);
                    return null;
                }
            }
        }

        [JsonIgnore]
        public string Url
        {
            get
            {
                if (ImageFile == null)
                    return null;

                var publicUrl = UrlResolver.Service.GetUrl(ImageFile.ContentLink, null, new UrlResolverArguments() { ContextMode = ContextMode.Default });

                return CropDetails == null
                    ? publicUrl
                    : $"{publicUrl}?crop=({CropDetails.X},{CropDetails.Y},{CropDetails.X + CropDetails.Width},{CropDetails.Y + CropDetails.Height})";
            }
        }
    }
}
