using EPiServer.Shell.ObjectEditing.EditorDescriptors;
using ITMeric.ImageCrop.Core;

namespace ITMeric.ImageCrop.EditorDescriptors
{
    [EditorDescriptorRegistration(TargetType = typeof(ImageReference), UIHint = "ImageReference")]
    public class ImageReferenceEditorDescriptor : ImageReferenceBaseEditorDescriptor
    {
        public ImageReferenceEditorDescriptor()
        {
            ClientEditingClass = "dotcrafted/Scripts/Editors/ImageReferenceSelector";
        }
    }
}