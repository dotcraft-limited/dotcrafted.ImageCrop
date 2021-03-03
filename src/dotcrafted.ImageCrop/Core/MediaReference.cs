using System;
using Newtonsoft.Json;

namespace ITMeric.ImageCrop.Core
{

    [Serializable]
    public abstract class MediaReference
    {

        public long Id { get; set; }

        public abstract MediaReferenceType MediaType { get; } 

        public string PreviewUrl { get; set; }

        [JsonIgnore]
        public virtual string Url { get; }
    }
}
