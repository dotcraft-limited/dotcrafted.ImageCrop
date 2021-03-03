using ITMeric.ImageCrop.Core;
using ITMeric.ImageCrop.Core.Collections;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ITMeric.ImageCrop.Serialization
{
    class CustomSerializationBinder : DefaultSerializationBinder
    {
        public override Type BindToType(string assemblyName, string typeName)
        {
            switch (typeName)
            {
                case "ITMeric.ImageCrop.Core.ImageReference": 
                    return typeof(ImageReference);
                case "ITMeric.ImageCrop.Core.MediaReference": 
                    return typeof(MediaReference);
                case "ITMeric.ImageCrop.Core.Collections.ImageReferenceList": 
                    return typeof(ImageReferenceList);
                case "ITMeric.ImageCrop.Core.Collections.MediaReferenceList": 
                    return typeof(MediaReferenceList<>);
                case "ITMeric.ImageCrop.Core.CropDetails":
                    return typeof(CropDetails);
                default: 
                    return base.BindToType(assemblyName, typeName);
            }
        }
    }
}
