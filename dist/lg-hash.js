/**!
 * @danmmx/lg-hash.js | 1.0.4 | December 11th 2018
 * http://sachinchoolur.github.io/lg-hash.js
 * Copyright (c) 2016 Sachin N; 
 * @license GPLv3 
 */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgHash = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        var mod = {
            exports: {}
        };
        factory();
        global.lgHash = mod.exports;
    }
})(this, function () {
    'use strict';

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    var hashDefaults = {
        hash: true
    };
    var Hash = function Hash(element) {
        this.el = element;
        this.core = window.lgData[this.el.getAttribute('lg-uid')];
        this.core.s = _extends({}, hashDefaults, this.core.s);
        if (this.core.s.hash) {
            this.oldHash = window.location.hash;
            this.init();
        }

        return this;
    };

    Hash.prototype.init = function () {
        var _this = this;
        var _hash;
        var _hasArtworkId = false;

        if (window.location.hash.indexOf('artworkId') >= 0) {
            _hasArtworkId = true;
        }

        // Change hash value on after each slide transition
        utils.on(_this.core.el, 'onAfterSlide.lgtm', function (event) {
            var idx = event.detail.index;
            if (_hasArtworkId) {
                window.location.hash = 'lg=' + _this.core.s.galleryId + '&artworkId=' + _this.core.s.dynamicEl[idx].id;
            } else {
                window.location.hash = 'lg=' + _this.core.s.galleryId + '&slide=' + idx;
            }
        });

        // Listen hash change and change the slide according to slide value
        utils.on(window, 'hashchange.lghash', function () {
            _hash = window.location.hash;
            var _idx;
            if (_hasArtworkId) {
                _idx = parseInt(_hash.split('&slide=')[1], 10);
            } else {
                _idx = parseInt(_hash.split('&artworkId=')[1], 10);
            }

            // it galleryId doesn't exist in the url close the gallery
            if (_hash.indexOf('lg=' + _this.core.s.galleryId) > -1) {
                _this.core.slide(_idx, false, false);
            } else if (_this.core.lGalleryOn) {
                _this.core.destroy();
            }
        });
    };

    Hash.prototype.destroy = function () {
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
});

},{}]},{},[1])(1)
});
