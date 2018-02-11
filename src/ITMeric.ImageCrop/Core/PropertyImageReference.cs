using System;
using EPiServer.Framework.DataAnnotations;
using EPiServer.PlugIn;

namespace ITMeric.ImageCrop.Core
{
    [Serializable]
    [EditorHint("ImageReference")]
    [PropertyDefinitionTypePlugIn(DisplayName = "ImageReference")]
    public class PropertyImageReference : PropertyMediaReferenceBase<ImageReference>
    {
       
    }
}