"use strict";

function Gauge() {
    this.initialize(arguments);
}

Gauge.prototype = {
    initialize: function (args) {
        this.container = document.createElement("div");
        this.gauge = document.createElement("div");
        this.mask = document.createElement("div");
        this.label = document.createElement("div");

        this.container.style.position = "relative";
        this.container.style.backgroundColor = "inherit";
        this.container.style.height = "1em";
        
        if (args[1]) {
            for (let key in args[1]) {
                this.container.style[key] = args[1][key];
            }
        }

        this.gauge.style.background = "linear-gradient(to right, rgb(0, 137, 123) 70%, rgb(246, 191, 38) 70% 90%, rgb(142, 36, 170) 90%)";
        this.gauge.style.position = "absolute";
        this.gauge.style.inset = "0 0 0 0";
        
        this.mask.style.position = "absolute";
        this.mask.style.inset = "0 0 0 0";
        this.mask.style.backgroundColor = "inherit";
        this.mask.style.color = "inherit";
        this.mask.style.transition = "all 1s cubic-bezier(0, 1, 1, 1.2)";
        
        this.label.style.position = "absolute";
        this.label.style.top = "50%";
        this.label.style.right = "1em";
        this.label.style.transform = "translateY(-50%)";

        //args[1] && (this.mask.style.animation = args[1]);

        this.container.appendChild(this.gauge);
        this.container.appendChild(this.mask);
        this.container.appendChild(this.label);

        args[0].appendChild(this.container);
    },
    set: function (value, rate) {
        this.mask.style.left = `${rate}%`;
        this.label.textContent = value;
    },
    set height (height) {
        this.container.style.height = height;
    }
};