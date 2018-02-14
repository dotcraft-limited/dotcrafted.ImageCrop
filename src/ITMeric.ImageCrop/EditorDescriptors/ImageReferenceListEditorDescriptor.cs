using System;
using System.Collections.Generic;
using EPiServer.Shell.ObjectEditing;
using EPiServer.Shell.ObjectEditing.EditorDescriptors;
using ITMeric.ImageCrop.Core;
using ITMeric.ImageCrop.Core.Collections;

namespace ITMeric.ImageCrop.EditorDescriptors
{
    [EditorDescriptorRegistration(TargetType = typeof(ImageReferenceList), UIHint = "ImageReferenceList")]
    public class ImageReferenceListEditorDescriptor : ImageReferenceBaseEditorDescriptor
    {
        public ImageReferenceListEditorDescriptor()
        {
            ClientEditingClass = "itmeric/Scripts/Editors/ImageReferenceListSelector";
        }
    }
}
