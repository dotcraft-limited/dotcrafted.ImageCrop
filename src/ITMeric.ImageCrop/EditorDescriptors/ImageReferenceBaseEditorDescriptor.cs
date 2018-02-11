using System;
using System.Collections.Generic;
using System.Linq;
using EPiServer.Shell;
using EPiServer.Shell.ObjectEditing;
using EPiServer.Shell.ObjectEditing.EditorDescriptors;
using ITMeric.ImageCrop.Core;

namespace ITMeric.ImageCrop.EditorDescriptors
{
    public class ImageReferenceBaseEditorDescriptor : EditorDescriptor
    {
        public override void ModifyMetadata(ExtendedMetadata metadata, IEnumerable<Attribute> attributes)
        {
            base.ModifyMetadata(metadata, attributes);

            var mediaReferenceAttribute = attributes.OfType<ImageReferenceAttribute>().FirstOrDefault();

            if (mediaReferenceAttribute != null)
            {
                metadata.EditorConfiguration["cropRatio"] = mediaReferenceAttribute.CropRatio;
                metadata.EditorConfiguration["allowedDndTypes"] =
                    mediaReferenceAttribute.AllowedTypes?.Select(x => x.FullName.ToLower()).ToArray();
            }

            metadata.CustomEditorSettings["uiWrapperType"] = UiWrapperType.Floating;
        }

        //public override void ModifyBaseMetadata(ExtendedMetadata metadata, IEnumerable<Attribute> attributes)
        //{
           
        //}
    }
}