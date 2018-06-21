
## Important Security Notice!
The default [notfound.aspx](https://github.com/BVNetwork/404handler/blob/master/src/NotFound.aspx) page has an XSS vulnerability. If you are using this page, please change it according to [this commit](https://github.com/BVNetwork/404handler/commit/02419c904db096a607ba6775b04db7fdf042002a#diff-4cf2534cd91830ac43ef09100c7a18d8).

# ImageCrop for EPiServer

## Description


[![Platform](https://img.shields.io/badge/Platform-.NET%204.6.1-blue.svg?style=flat)](https://msdn.microsoft.com/en-us/library/w0x726c2%28v=vs.110%29.aspx)
[![Platform](https://img.shields.io/badge/Episerver%20-%2011-orange.svg?style=flat)](https://world.episerver.com/cms/)

Set of editors for EPiServer to allow editor to crop images on the fly.

##Editors
* Single Image 
* Multiple Image


# Installation
`Install-Package ITMeric.ImageCrop`

The package can be found in the [EPiServer Nuget Feed](http://nuget.episerver.com/).

Example usage:
```C#

[ImageReference(CropRatio = 1d, AllowedTypes = new [] { typeof(ImageFile)})]
public virtual ImageReference SingleImageReference { get; set; }

[ImageReference(CropRatio = 1d, AllowedTypes = new[] { typeof(ImageFile) })]
public virtual ImageReferenceList ImageReferenceList { get; set; }

```

