using System;
using System.Collections.Generic;
using EPiServer.Framework.DataAnnotations;
using EPiServer.PlugIn;
using ITMeric.ImageCrop.Core.Collections;

namespace ITMeric.ImageCrop.Core
{
    [Serializable]
    [EditorHint("ImageReferenceList")]
    [PropertyDefinitionTypePlugIn(DisplayName = "ImageReferenceList")]
    public class PropertyImageReferenceList : PropertyMediaReferenceBase<ImageReferenceList>
    {

    
    }
}
