using System;
using EPiServer;
using EPiServer.Core;
using EPiServer.Logging;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;
using ITMeric.ImageCrop.Core;

namespace ITMeric.ImageCrop.ExtensionMethods
{
    public static class ImageReferenceExtensions
    {
        private static readonly IContentRepository _contentRepository;
        private static readonly IUrlResolver _urlResolver;
        private static readonly ILogger _logger;

        static ImageReferenceExtensions()
        {
            _contentRepository = ServiceLocator.Current.GetInstance<IContentRepository>();
            _urlResolver = ServiceLocator.Current.GetInstance<IUrlResolver>();
            _logger = LogManager.GetLogger(typeof(ImageReferenceExtensions));
        }

        public static string GetCropUrl(this ImageReference imageRefernce)
        {
            if (imageRefernce == null)
                return string.Empty;

            try
            {
                var imageFile = _contentRepository.Get<ImageData>(imageRefernce.ContentReferenceId);

                if (imageFile == null)
                    throw new Exception("Could not retrieve image");

                var publicUrl = _urlResolver.GetUrl(imageFile.ContentLink, null,
                    new UrlResolverArguments {ContextMode = ContextMode.Default});

                if (string.IsNullOrEmpty(publicUrl))
                    throw new Exception("Could not retrieve image's url");

                return imageRefernce.CropDetails == null
                    ? string.Empty
                    : $"{publicUrl}?crop=({imageRefernce.CropDetails.X},{imageRefernce.CropDetails.Y},{imageRefernce.CropDetails.X + imageRefernce.CropDetails.Width},{imageRefernce.CropDetails.Y + imageRefernce.CropDetails.Height})";
            }
            catch (Exception ex)
            {
                _logger.Error("GetCroupUrl failed", ex);
                return string.Empty;
            }
        }
    }
}