/// <reference path="jquery-vsdoc.js" />

//<![CDATA[
var PhotoGallery = {
    classNames: {
        disabled: 'disabled',
        selected: 'selected',
        photoHover: 'gallery-photo-hover',
        resizeHover: 'gallery-photo-resize-hover',
        liquidLayout: 'layout-lqd'
    },

    lang: {
        enlarge: FTranslate.Get("vergrootfoto"),
        shrink: FTranslate.Get("verkleinfoto")
    },

    url: {
        seperator: '#',
        delimiter: '&',
        prefix: 'foto-',
        size: 'groot'
    },

    photo: null,

    photos: [],
    largePhotos: [],

    carousel: null,
    prev: null,
    next: null,

    currentSelectedIdx: 0,

    firstrun: true,

    resized: false,

    advertSrc: null,

    init: function(photo, photoPrevious, photoNext, carousel, carouselPrevious, carouselNext, carouselContainer, resizeButton, isLargeMode) {
        // Initialize carousel
        Carrousel.init(carousel, carouselPrevious, carouselNext, carouselContainer);

        PhotoGallery.resized = isLargeMode;

        // Store elements
        PhotoGallery.parent = getParentElement(photo, 'div');
        PhotoGallery.carousel = Carrousel;
        PhotoGallery.photo = photo;
        PhotoGallery.prev = photoPrevious;
        PhotoGallery.next = photoNext;
        if (resizeButton) PhotoGallery.resizeButton = resizeButton;

        // Apply onclick behaviour to carousel elements
        for (var i = 0; i < PhotoGallery.carousel.elements.length; i++) {
            var thumbnail = PhotoGallery.carousel.elements[i];
            if (hasClass(thumbnail, PhotoGallery.classNames.selected)) {
                PhotoGallery.currentSelectedIdx = i;
            }
            thumbnail.onclick = PhotoGallery.onclick;
        }

        // Overwrite previous / next button behaviour
        PhotoGallery.carousel.prev.onclick = PhotoGallery.left;
        PhotoGallery.carousel.next.onclick = PhotoGallery.right;
        if ($.browser.msie) {
            PhotoGallery.carousel.prev.ondblclick = PhotoGallery.left;
            PhotoGallery.carousel.next.ondblclick = PhotoGallery.right;
        }

        // Rewire photo navigation to carousel navigation
        PhotoGallery.prev.onclick = PhotoGallery.left;
        PhotoGallery.next.onclick = PhotoGallery.right;
        if ($.browser.msie) {
            PhotoGallery.prev.ondblclick = PhotoGallery.left;
            PhotoGallery.next.ondblclick = PhotoGallery.right;
        }

        // handle left and right arrow on keyboard
        $(document).bind('keydown', PhotoGallery.checkPressedKeyboardKeys);

        // onmouseout behaviour for photo navigation
        PhotoGallery.prev.onmouseout = PhotoGallery.onmouseout;
        PhotoGallery.next.onmouseout = PhotoGallery.onmouseout;

        // Full screen navigation
        PhotoGallery.parent.onmouseover = PhotoGallery.photoOnmouseover;
        PhotoGallery.parent.onmouseout = PhotoGallery.photoOnmouseout;

        if (PhotoGallery.resizeButton) {
            PhotoGallery.resizeButton.onmouseover = PhotoGallery.resizeOnmouseover;
            PhotoGallery.resizeButton.onmouseout = PhotoGallery.resizeOnmouseout;

            PhotoGallery.resizeButton.onclick = PhotoGallery.resize;
        }


        // Set currently selected photo based on URL fragment
        // else default to the selected element in the HTML
        var view = PhotoGallery.getIndexFromUrlFragment();
        if (view.idx) {
            view.idx = (view.idx > 0 && view.idx <= PhotoGallery.carousel.elements.length) ? view.idx - 1 : 0;
        } else {
            view.idx = PhotoGallery.currentSelectedIdx;
        }

        if (view.resized) {
            PhotoGallery.resize.call(PhotoGallery.resizeButton);
        }

        // Call currently selected photo
        PhotoGallery.onclick.call(PhotoGallery.carousel.elements[view.idx]);

        // Preload selected image
        var img = document.createElement('img');
        img.onload = function() {
            // Remove hide class from image
            removeClass(photo, 'hide');
            var parent = getParentElement(PhotoGallery.parent, 'table');
            if (hasClass(parent, PhotoGallery.classNames.liquidLayout)) {
                PhotoGallery.centerVertical();
            }
        };
        img.src = PhotoGallery.resized ? PhotoGallery.largePhotos[view.idx] : PhotoGallery.photos[view.idx];

        // Hide focus outlines in IE
        if (typeof PhotoGallery.prev.hideFocus == 'boolean') {
            PhotoGallery.prev.hideFocus = true;
            PhotoGallery.next.hideFocus = true;
        }

        // Hide title attributes on next / prev buttons (do in JS for compatib with non-js compliant clients)
        PhotoGallery.prev.title = '';
        PhotoGallery.next.title = '';

        // Finish initialization
        PhotoGallery.firstrun = false;
    },

    checkPressedKeyboardKeys: function(event) {

        var target = $(event.target);

        // don't do anything if focus is on an input element
        if (target.filter(":input").length == 0) {
            switch (event.which) {
                case 37: // left button
                    PhotoGallery.left();
                    break;
                case 39: // right button
                    PhotoGallery.right();
                    break;
            }
        }
    },

    left: function() {
        if (PhotoGallery.currentSelectedIdx > 0) {
            PhotoGallery.onclick.call(PhotoGallery.carousel.elements[PhotoGallery.currentSelectedIdx - 1]);
        }
        PhotoGallery.displayCurrent();

        return false;
    },

    right: function() {
        if (PhotoGallery.currentSelectedIdx < PhotoGallery.carousel.elements.length - 1) {
            PhotoGallery.onclick.call(PhotoGallery.carousel.elements[PhotoGallery.currentSelectedIdx + 1]);
        }
        PhotoGallery.displayCurrent();

        return false;
    },

    onclick: function() {
        // Deselect previously selected thumbnail
        removeClass(PhotoGallery.carousel.elements[PhotoGallery.currentSelectedIdx], PhotoGallery.classNames.selected);

        // Find, select and scroll currently selected into view
        PhotoGallery.currentSelectedIdx = PhotoGallery.carousel.getElementIndex(this);
        addClass(PhotoGallery.carousel.elements[PhotoGallery.currentSelectedIdx], PhotoGallery.classNames.selected);
        PhotoGallery.carousel.scrollIntoView(this);

        // lets do jquery
        $(PhotoGallery.carousel.prev).toggleClass('disabled-l', PhotoGallery.currentSelectedIdx === 0);
        $(PhotoGallery.carousel.next).toggleClass('disabled-r', PhotoGallery.currentSelectedIdx === PhotoGallery.carousel.elements.length - 1);

        // Display current photo
        PhotoGallery.displayCurrent();

        if (!PhotoGallery.firstrun) {
            // Set URL fragment to current index
            PhotoGallery.setIndexInUrlFragment();
        }

        return false;
    },

    onmouseout: function() {
        this.blur();
    },

    displayCurrent: function() {
        var src = PhotoGallery.resized ? PhotoGallery.largePhotos[PhotoGallery.currentSelectedIdx] : PhotoGallery.photos[PhotoGallery.currentSelectedIdx];
        if (src) {

            // Vertically center photo
            PhotoGallery.photo.onload = function() {
                var parent = getParentElement(PhotoGallery.parent, 'table');
                if (hasClass(parent, PhotoGallery.classNames.liquidLayout)) {
                    PhotoGallery.centerVertical();
                } else {
                    PhotoGallery.photo.style.top = 0;
                }
                removeClass(PhotoGallery.photo, 'hide');
            }

            // Replace photo
            PhotoGallery.photo.src = src;

            // Show/hide in-photo navigation
            if (PhotoGallery.currentSelectedIdx > 0) {
                removeClass(PhotoGallery.prev, PhotoGallery.classNames.disabled);
            } else {
                addClass(PhotoGallery.prev, PhotoGallery.classNames.disabled);
            }

            if (PhotoGallery.currentSelectedIdx < PhotoGallery.carousel.elements.length - 1) {
                removeClass(PhotoGallery.next, PhotoGallery.classNames.disabled);

                // Pre-load next photo
                var img = new Image();
                if (PhotoGallery.resized) {
                    img.src = PhotoGallery.largePhotos[PhotoGallery.currentSelectedIdx + 1];
                } else {
                    img.src = PhotoGallery.photos[PhotoGallery.currentSelectedIdx + 1];
                }
            } else {
                addClass(PhotoGallery.next, PhotoGallery.classNames.disabled);
            }
        }

    },

    resize: function() {
        // Hide the photo until loaded
        addClass(PhotoGallery.photo, 'hide');

        // Resize layout
        var parent = getParentElement(PhotoGallery.parent, 'table');
        if (hasClass(parent, PhotoGallery.classNames.liquidLayout)) {
            removeClass(parent, PhotoGallery.classNames.liquidLayout);

            // Set tooltip
            PhotoGallery.resizeButton.title = PhotoGallery.lang.enlarge;

            // Store state
            PhotoGallery.resized = false;
        } else {
            addClass(parent, PhotoGallery.classNames.liquidLayout);

            // Set tooltip
            PhotoGallery.resizeButton.title = PhotoGallery.lang.shrink;

            // Store state
            PhotoGallery.resized = true;
        }
        this.blur();
        PhotoGallery.displayCurrent();

        // Set current URL
        PhotoGallery.setIndexInUrlFragment();

        // Fire event
        PhotoGallery.onResize();

        return false;
    },

    resizeOnmouseout: function() {
        if (hasClass(PhotoGallery.parent, PhotoGallery.classNames.resizeHover)) {
            removeClass(PhotoGallery.parent, PhotoGallery.classNames.resizeHover);
        }
    },

    resizeOnmouseover: function() {
        if (!(hasClass(PhotoGallery.parent, PhotoGallery.classNames.resizeHover))) {
            addClass(PhotoGallery.parent, PhotoGallery.classNames.resizeHover);
        }
    },

    photoOnmouseover: function() {
        if (!$(this).hasClass(PhotoGallery.classNames.photoHover)) {
            addClass(this, PhotoGallery.classNames.photoHover);
        }
    },

    photoOnmouseout: function() {
        removeClass(this, PhotoGallery.classNames.photoHover);
    },

    centerVertical: function() {
        var photoContainer = PhotoGallery.photo.parentNode;
        var height = PhotoGallery.photo.parentNode.clientHeight;
        height = parseInt(height);
        PhotoGallery.photo.style.top = ((height - PhotoGallery.photo.clientHeight) / 2) + "px";
    },

    parseUrl: function() {
        var chunks = window.location.href.split(PhotoGallery.url.seperator);
        return { url: chunks[0], fragment: chunks[1] };
    },

    getIndexFromUrlFragment: function() {
        var idx = 0;
        var resized = false;
        var url = PhotoGallery.parseUrl();
        if (url.fragment) {
            var chunks = url.fragment.split(PhotoGallery.url.delimiter);
            if (chunks[0] === PhotoGallery.url.size) {
                resized = true;
                idx = chunks[1];
            } else {
                idx = chunks[0];
            }
            idx = idx.replace(PhotoGallery.url.prefix, '');
        }
        return { idx: idx, resized: resized };
    },

    setIndexInUrlFragment: function() {
        // Use replace() to prevent a new entry in the history
        //except in webkit, because it creates history items always
        if ($.browser.safari) return;

        var url = PhotoGallery.parseUrl(top.location);
        var hash = PhotoGallery.url.seperator;
        hash += PhotoGallery.resized ? PhotoGallery.url.size + PhotoGallery.url.delimiter : '';
        hash += PhotoGallery.url.prefix;
        hash += PhotoGallery.currentSelectedIdx + 1;

        top.location.replace(url.url + hash);
    },

    // Event hooks
    onResize: function() { }
};
//]]>