var hashDefaults = {
    hash: true
};
var Hash = function(element, items) {
    this.el = element;
    this.items = items;
    this.core = window.lgData[this.el.getAttribute('lg-uid')];
    this.core.s = Object.assign({}, hashDefaults, this.core.s);
    if (this.core.s.hash) {
        this.oldHash = window.location.hash;
        this.init();
    }

    return this;
};

Hash.prototype.init = function() {
    var _this = this;
    var _hash;
    var _hasArtworkId = false;

    if (window.location.hash.indexOf('artworkId') >= 0) {
      _hasArtworkId = true;
    }

    // Change hash value on after each slide transition
    utils.on(_this.core.el, 'onAfterSlide.lgtm', function(event) {
        var idx = event.detail.index;

        if (_hasArtworkId) {
          window.location.hash = 'lg=' + _this.core.s.galleryId + '&artworkId=' + _this.core.s.dynamicEl[idx].id;
        } else {
          window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + idx;
        }
    });

    // Listen hash change and change the slide according to slide value
    utils.on(window, 'hashchange.lghash', function() {
        _hash = window.location.hash;
        var _idx;

        if (!utils.hasClass(document.body, 'lg-on')) {
          utils.addClass(document.body, 'lg-on');
          setTimeout(function() {
              _this.build(_this.index);
          });
        }

        if (_hasArtworkId) {
          const artworkId = _hash.split('&artworkId=')[1];

          _idx = parseInt(_this.items.findIndex(function(item) {
            return item.id === artworkId;
          }));
        } else {
          _idx = parseInt(_hash.split('&slide=')[1], 10);
        }

        // it galleryId doesn't exist in the url close the gallery
        if ((_hash.indexOf('lg=' + _this.core.s.galleryId) > -1)) {
            _this.core.slide(_idx, false, false);
        } else if (_this.core.lGalleryOn) {
            _this.core.destroy();
        }
    });
};

Hash.prototype.destroy = function() {
    if (!this.core.s.hash) {
        return;
    }

    // Reset to old hash value
    if (this.oldHash && this.oldHash.indexOf('lg=' + this.core.s.galleryId) < 0) {
        window.location.hash = this.oldHash;
    } else {
        if (history.pushState) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        } else {
            window.location.hash = '';
        }
    }

    utils.off(this.core.el, '.lghash');
};

window.lgModules.hash = Hash;
