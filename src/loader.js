/**
 * Created with JetBrains WebStorm.
 * User: SSA 7
 * Date: 27.10.13
 * Time: 18:51
 * To change this template use File | Settings | File Templates.
 */
var imgLoader = (function() {
    var Loader = function () {
        this.cache = {};
        this.counter = 0;
        this.readyCallback = null;

        this.load = function (resource, url) {
            var self = this,
                id;
            if (typeof resource === "object") {
                for (id in resource) {
                    if (resource.hasOwnProperty(id)) {
                        self.loadResource(id, resource[id]);
                    }
                }
            }
            if (typeof resource === "string") {
                self.loadResource(resource, url);
            }

            return this;
        };
        this.getData = function (id) {
            if (this.cache.hasOwnProperty(id) && this.cache[id]) {
                return this.cache[id];
            }
            return null;
        };
        this.loadResource = function (id, url) {
            var self = this,
                img = null;

            if (self.cache[id]) {
                return self.cache[id];
            }

            self.counter++;
            img = new Image();
            img.onload = function () {
                self.cache[id] = img;
                self.counter--;

                if (self.isDone()) {
                    if (self.readyCallback) {
                        self.readyCallback();
                    }
                }
            };
            self.cache[id] = null;
            img.src = url;

            return null;
        };
        this.isDone = function () {
            return !this.counter;
        };

        this.onReady = function (callback) {
            if (callback instanceof Function) {
                this.readyCallback = callback;
            }
            return this;
        };
    };

    return new Loader();
}());