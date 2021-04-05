"use strict";

function ImageLoader() {
    this.initialize(arguments);
}

{
    function load(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = e => resolve(img);
            img.onerror = e => reject(e);

            img.src = url;
        });
    }

    ImageLoader.prototype = {
        initialize: function (args) {
            this.callback = args[0];
            this.f = args[1] || load;
            this.map = {};
        },
        load: function (array) {
            Promise.all(array.map(url => this.f(url)))
                .then(images => {
                    array.forEach((url, i) => {
                        this.map[url] = images[i];
                    });
                    
                    this.callback(images);
                })
                .catch(e => this.callback(undefined, e));
        }
    };
}