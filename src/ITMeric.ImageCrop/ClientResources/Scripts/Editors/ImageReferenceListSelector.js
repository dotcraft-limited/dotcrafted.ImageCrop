
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
		"dojo/query",
		"dojo/when",
		"dojo/dnd/Target",
		"dojo/dnd/Source",
		// dijit,
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

		"itmeric/scripts/helpers",

		//template
		"dojo/text!./templates/template.html",
				

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
			query,
			when,
			DndTarget,
			DndSource,

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
			
			//itmeric
			helpers,

			template

		) {
			return declare("itmeric.Editors.ImageReferenceListSelector", [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin, _CssStateMixin, _HasChildDialogMixin, _Droppable, _ValueRequiredMixin], {
				templateString: template,
				previewUrl: null,
				contentLink: null,
				value: null,
				items: [],
				cropper: null,
				cropperData: null,
				allowedDndTypes: null,
				dialog: null,
				dndSource: null,
				dropTarget: null,
				imageWidth: 120,

				postCreate: function () {
					
					this.inherited(arguments);
					this.allowedDndTypes = this.get('allowedDndTypes');
					  
					this.dndSource = new DndSource(this.itemsContainer,
						{
							creator: lang.hitch(this, this._createDndElement),
							autoSync: true,
							copyOnly: true,
							selfCopy: false,
							horizontal: true,
							accept: ['image']
						});

					this.dropTarget = new DndTarget(this.dropTarget, {
						accept: this.allowedDndTypes,
						createItemOnDrop: false
					});


					this.connect(this.dropTarget, "onDropData", "_onDropData");
					this.connect(this.dndSource, "onDrop", lang.hitch(this, this._onDrop));

					this.calculatedHeight = Math.round(this.imageWidth / this.get('cropRatio'));
					domStyle.set(this.dropAreaNode, "height", this.calculatedHeight + 'px');
				}, 


				postMixInProperties: function () {

					this.inherited(arguments);
					var registry = dependency.resolve("epi.storeregistry");
					this._store = registry.get("epi.cms.contentdata");

				},

				_setValue: function (value) {					
					this._set("value", value);
					this.onChange(value);
				},
				_setValueAttr: function (value) {					
					this._setValue(value);
					this.items = value;
					this.dndSource.insertNodes(false, value);
					this.dndSource.sync();
				},

				_onDrop: function (source, node, copy) {					
					var list = [];

					source.getAllNodes().forEach(function (obj, j) {
						dojo.forEach(this.value, function (item, i) {							
							if (obj.id === item.id) {
								list.push(this.value[i]);
							}
						}, this);
					}, this);

					this.items = list;
					this._setValue(list);
				},

				_onDropData: function (dndData, source, nodes, copy) {
					
					var item = dndData ? (dndData.length ? dndData[0] : dndData) : null;

					if (!item) {
						return;
					}

					if (this.onDropping) {
						this.onDropping();
					}

					this._proccessDndData(item);

				},

				_proccessDndData: function (dropItem) {

					when(dropItem.data, lang.hitch(this, function (model) {

						this._valueChangedPromise = when(this._getContentData(model.contentLink), lang.hitch(this, function (content) {

						  if (this.allowedDndTypes.indexOf(content.typeIdentifier) !== -1) {

								//Clear the pointer to the promise since it is resolved.
								this._valueChangedPromise = null;
								this.selectedMedia = content;
								this._showImageEditor(content);
								
							} else {
								alert('Unsuported media type.');
							}
						}));
					}));
				},

				_showImageEditor: function (content) {

				  var body = dojo.body();
				  dojo.addClass(body, "media-loading");
					
				  var imageUrl = content.publicUrl + '?quality=50';
									
				  helpers.preloadImage(imageUrl,  (function () {
					  var html = '<div style="width:520px;" class="ImageReferenceSelectorDialog"><div style="max-height:268px;"><img src="' + imageUrl + '" class="cropper-image"/></div>';							

						this.isShowingChildDialog = true;

					  this.imageEditorDialog = new Dialog({
						  title: "Image Cropper",
						  content: html,
						  contentClass: 'ImageReferenceSelectorDialog',
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

					var cropDetails = { x: Math.round(this.cropperData.x), y: Math.round(this.cropperData.y), width: Math.round(this.cropperData.width), height: Math.round(this.cropperData.height) };
					var updated = false;

					//checking if in edit mode
					dojo.forEach(this.items, (function (item, i) {
						if (item && item.id && item.id === this.selectedMedia.id) {
							this.items[i].cropDetails = cropDetails;
							updated = true;
							return;
						}
					}).bind(this));
					if (updated === false) {

						var item = helpers.serializeImage(this.selectedMedia, cropDetails);

						this.items.push(item);
						this.dndSource.insertNodes(false, [item]);
					} else {
						this._reload();
					}

					this._setValue(this.items);
					this.onBlur();
				},

				_reload: function () {
					this.dndSource.selectAll().deleteSelectedNodes();
					this.dndSource.insertNodes(false, this.value);
				},


				_createDndElement: function (item, hint) {

					
					var node;

					if (hint !== "avatar") {

						node = domConstruct.create('li',
							{
								id: item.id,
								'class': 'media-item dojoDndItem'
							});

						var innerNode = domConstruct.create('div',
							{
								'class': 'media-item-inner'
							});


						var img = domConstruct.create('img',
							{
								'src': helpers.getImageUrl(item, this.imageWidth)
							});
						

						var buttonsNode = domConstruct.create('div',
							{
							  'class': 'media-buttons'
							});

						

						if (item.hasOwnProperty('cropDetails')) {

							var btnCrop = new domConstruct.create("a",
								{
									href: "#",
									innerHTML: "",
									'class': "epi-chromeless epi-iconPen",
									onclick: (function (e) {
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
								onclick: (function(a) {
									
									dojo.forEach(this.items,
										(function(post, i) {
											if (post && post.id && post.id === item.id) {
												this.items.splice(i, 1);
												this.dndSource.selectAll().deleteSelectedNodes();
												this.dndSource.insertNodes(false, this.items);
												return;
											}
										}).bind(this));

									this.value = this.items;

									this._setValue(this.value);

								}).bind(this)
							});


						domConstruct.place(btnDelete, buttonsNode, "last");
						domConstruct.place(img, innerNode, "last");
						domConstruct.place(buttonsNode, innerNode, "last");
						domConstruct.place(innerNode, node, "last");

						domConstruct.place(node, this.itemsContainer, "last");
					} else {

						 node = domConstruct.create("div", { class: "source-avatar" });
						
						 var avatarImg = dojo.doc.createElement('img');
						
						 domAttr.set(avatarImg, "src", helpers.getImageUrl(item, this.imageWidth));
						domConstruct.place(avatarImg, node);
					}

					return {
						"node": node,
						"type": ['image'],
						"data": item
					};



				},

				
				_removeImage: function (id) {

					dojo.forEach(this.items, (function (item, i) {
						if (item && item.id && item.id === id) {
							this.items.splice(i, 1);
							return;
						}
					}).bind(this));

					this._setValue(this.items);
					this._reload();

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