using System;
using System.Collections.Generic;
using EPiServer.Shell.ObjectEditing;
using EPiServer.Shell.ObjectEditing.EditorDescriptors;
using ITMeric.ImageCrop.Core;

namespace ITMeric.ImageCrop.EditorDescriptors
{
    [EditorDescriptorRegistration(TargetType = typeof (ImageReference), UIHint = "ImageReference")]
    public class ImageReferenceEditorDescriptor : ImageReferenceBaseEditorDescriptor
    {
        public ImageReferenceEditorDescriptor()
        {
            ClientEditingClass = "itmeric/Scripts/Editors/ImageReferenceSelector";
        }
      
    }
}