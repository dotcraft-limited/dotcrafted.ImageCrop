using System;
using EPiServer.ServiceLocation;
using ITMeric.ImageCrop.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ITMeric.ImageCrop.Serialization
{
    [ServiceConfiguration(typeof(JsonConverter))]
    public class MediaConverter : AbstractJsonConverter<MediaReference>
    {

        protected override MediaReference Create(Type objectType, JObject jObject)
        {
            if (FieldExists(jObject, "cropDetails", JTokenType.Object) || FieldExists(jObject, "CropDetails", JTokenType.Object))
                return new ImageReference();
            return null;
        }
    }
}