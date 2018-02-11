(function () {
	define([
			// dojo
			"dojo",
			"dojo/dom-construct",
			"dojo/mouse",
			"dojo/on",
			"dojo/_base/declare",
			"dojo/_base/lang",
			"dojo/dom-class",
			"dojo/dom-style",
			"dojo/dom-prop",
			"dojo/dom-attr",
			"dojo/dom-construct",
			"dojo/when",
			// dijit
			"dijit/_CssStateMixin",
			"dijit/_TemplatedMixin",
			"dijit/_Widget",
			"dijit/_WidgetsInTemplateMixin",
			"dijit/form/Button",
			// epi.shell
			"epi/dependency",
			"epi/i18n",
			"epi/shell/widget/_ValueRequiredMixin",
			// epi.cms
			"epi-cms/widget/_Droppable",
			"epi-cms/widget/_HasChildDialogMixin",
			"epi/shell/widget/dialog/Dialog",
			"dojo/dnd/Target",
			"dojo/dnd/Source",
			//itmeric
			"itmeric/scripts/helpers",
			//template
			"dojo/text!./templates/template.html"
		],
		function (
			// dojo
			dojo,
			domConstruct,
			mouse,
			on,
			declare,
			lang,
			domClass,
			domStyle,
			domProp,
			domAttr,
			domConstruct,
			when,
			// dijit
			_CssStateMixin,
			_TemplatedMixin,
			_Widget,
			_WidgetsInTemplateMixin,
			Button,
			// epi.shell
			dependency,
			i18n,
			_ValueRequiredMixin,
			// epi.cms
			_Droppable,
			_HasChildDialogMixin,
			Dialog,
			Target,
			Source,
			//itmeric
			helpers,
			//template
			template
		) {
		return declare("itmeric.Editors.ImageReferenceSelector", [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _CssStateMixin, _HasChildDialogMixin, _Droppable, _ValueRequiredMixin], {
		templateString: template,
		previewUrl: null,
		contentLink: null,
		value: null,
		mediaList: [],
		cropper: null,
		cropperData: null,
		allowedDndTypes: null,
		dialog: null,
		mediaSource: null,
		dropTarget: null,
		imageWidth: 120,

		postCreate: function () {

		  this.allowedDndTypes = this.get('allowedDndTypes');

		  this.inherited(arguments);

		  this.dropTarget = new Target(this.dropTarget, {
			accept: this.allowedDndTypes,
			createItemOnDrop: false
		  });

		  this.connect(this.dropTarget, "onDropData", "_onDropData");
		  this.calculatedHeight = Math.round(this.imageWidth / this.get('cropRatio'));
		  domStyle.set(this.dropAreaNode, "height", this.calculatedHeight + 'px');
		},

		buildRendering: function () {
		  this.inherited(arguments);
		},


		_setValueAttr: function (value) {

		  if (value != null) {

			if (value.hasOwnProperty('cropDetails')) {
			  when(this._getContentData(value.contentLink),
				lang.hitch(this,
				  function (content) {
					if (content) {
					  value.publicUrl = content.publicUrl;
					}

					this.value = value;
					this._updateDisplayNode(this.value);
				  }));
			} else {
			  alert('Unrecognized media type');
			}
		  }
		},

		postMixInProperties: function () {

		  this.inherited(arguments);

		  var registry = dependency.resolve("epi.storeregistry");
		  this._store = registry.get("epi.cms.contentdata");
		},

		_onDropData: function (dndData, source, nodes, copy) {

		  var item = dndData ? (dndData.length ? dndData[0] : dndData) : null;

		  if (!item) {
			return;
		  }

		  // invoke the onDropping required by SideBySideWrapper and other widgets listening on onDropping 
		  if (this.onDropping) {
			this.onDropping();
		  }

		  this._proccessDndData(item);

		},

		_proccessDndData: function (dropItem) {

		  when(dropItem.data, lang.hitch(this, function (model) {

			when(this._getContentData(model.contentLink), lang.hitch(this, function (content) {

				if (this.allowedDndTypes.indexOf(content.typeIdentifier) !== -1) {

				//Clear the pointer to the promise since it is resolved.
				this._valueChangedPromise = null;
				this.selectedMedia = helpers.serializeImage(content);
				this._showImageEditor(content);

			  } else {
				alert('Unsuported media type.');
			  }
			}));
		  }));
		},

		_setValue: function (value) {

		  this._set("value", value);		  
			this.onChange(value);
			this._updateDisplayNode(value);		  
		},


		_showImageEditor: function (content) {

			var body = dojo.body();
			dojo.addClass(body, "media-loading");

		  var imageUrl = content.publicUrl + '?quality=50';

		  helpers.preloadImage(imageUrl, (function () {
			var html = '<div style="width:520px;" class="ImageReferenceSelectorDialog"><div style="max-height:268px;"><img src="' + imageUrl + '" class="cropper-image"/></div>';	

			this.isShowingChildDialog = true;
			this.imageEditorDialog = new Dialog({
			  title: "Image Cropper",
			  content: html,
			  contentClass: 'dijitDialogScalablePaneContentArea',
			  onShow: (function () {
				var image = document.querySelector('#' + this.imageEditorDialog.id + ' .cropper-image');
				this.cropper = new Cropper(image, {
				  aspectRatio: this.get('cropRatio'),
				  viewMode: 1,
				  data: content.cropDetails,
				  autoCropArea: 1,
				  crop: (function (e) {					
					this.cropperData = e.detail;
				  }).bind(this)
				});
			  }).bind(this)
			});

			this.connect(this.imageEditorDialog, 'onHide', this._onImageEditorDialogHide);
			this.connect(this.imageEditorDialog, 'onExecute', this._onImageEditorDialogExecute);

			this.imageEditorDialog.show();

			dojo.removeClass(body, "media-loading");		
		  }).bind(this));
		},



		_onImageEditorDialogHide: function (evt) {
		  this.isShowingChildDialog = false;
		  this.selectedMedia = null;
		  this.cropperData = null;
		  this.imageEditorDialog.destroyRecursive();
		},

		_onImageEditorDialogExecute: function () {

		  
			this.selectedMedia.cropDetails = { x: Math.round(this.cropperData.x), y: Math.round(this.cropperData.y), width: Math.round(this.cropperData.width), height: Math.round(this.cropperData.height) };
		  
			this._setValue(this.selectedMedia);
		  this.onBlur();
		},

		_updateDisplayNode: function (item) {

		  dojo.empty(this.itemsContainer);

		  if (item != null && item.id) {
			dojo.setStyle(this.dropArea, 'display', 'none');

			node = domConstruct.create('li',
			  {
				id: item.id,
				'class': 'media-item dojoDndItem'
			  });

			var innerNode = domConstruct.create('div',
			  {
				'class': 'media-item-inner'
			  });

			var buttonsNode = domConstruct.create('div',
			  {
				'class': 'media-buttons'
			  });


			var img = domConstruct.create('img');

			if (item.hasOwnProperty('cropDetails')) {


			  domAttr.set(img, "src", helpers.getImageUrl(item, this.imageWidth));

			  var btnCrop = new domConstruct.create("a",
				{
				  href: "#",
				  innerHTML: "",
				  'class': "epi-chromeless epi-iconPen",
				  onclick: (function () {
					this.selectedMedia = item;
					this._showImageEditor(item);
				  }).bind(this)
				});

			  domConstruct.place(btnCrop, buttonsNode, "last");
			}

			var btnDelete = new domConstruct.create("a",
			  {
				href: "#",
				innerHTML: "",
				'class': "epi-chromeless epi-iconTrash",
				onclick: (function () {
				  this._removeImage();
				}).bind(this)

			  });


			domConstruct.place(btnDelete, buttonsNode, "last");
			domConstruct.place(img, innerNode, "last");
			domConstruct.place(buttonsNode, innerNode, "last");
			domConstruct.place(innerNode, node, "last");

			domConstruct.place(node, this.itemsContainer, "last");
		  } else {
			dojo.setStyle(this.dropArea, 'display', 'block');
		  }
		},

		_removeImage: function () {

		  this._setValue({});
		  this.onBlur();
		},

		_getContentData: function (contentLink) {
		  if (!contentLink) {

			return null;
		  }
		  return this._store.get(contentLink);
		}
	  });
	});
})()