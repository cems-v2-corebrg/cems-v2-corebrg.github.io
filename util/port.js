"use strict";

function Port() {
    this.initialize(arguments);
}
{
    const UNIT = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"];

    function toBPSString(value) {    
        for(var i=0, _i=UNIT.length -1; i<_i; i++) {
            if (value > 999) {
                value /= 1000;
            }
            else {
                break;
            }
        }
        
        return `${value.toFixed(2)}${UNIT[i]}`;
    }

    Port.prototype = {
        COLOR: {
            shutdown: "#8e24aa",
            disabled: "#999999",
            normal: "#008978"
        },
        GAUGESTYLE: {
            height: "2em",
            backgroundColor: "#fefefe",
            color: "#333333",
            border: "1px solid #ddd",
            borderRadius: "3px",
        },
        initialize: function (args) {
            const
                container = document.createElement("div"),
                inGauge = document.createElement("div"),
                outGauge = document.createElement("div"),
                ethernet = document.createElement("div"),
                icon = document.createElement("span"),
                label = document.createElement("div"),
                image = document.createElement("div"),
                config = args[1];

            container.style.width = "10em";
            container.style.textAlign = "center";

            ethernet.style.margin = "1em 0";

            icon.textContent = "\uf796";
            icon.style.font ="2em 'Font Awesome 5 Free'";
            icon.style.display = "inline-block";
            icon.style.transform = "rotate(180deg)";
            icon.style.padding = "0.5em";
            icon.style.border = "2px solid #dddddd";
            icon.style.borderRadius = "5px";
            icon.style.color =  "#ffffff";
            icon.style.backgroundColor = this.COLOR.disabled;

            ethernet.appendChild(icon);

            label.textContent = config.label;

            ethernet.appendChild(label);

            this.gauge = {
                in: new Gauge(inGauge, this.GAUGESTYLE),
                out: new Gauge(outGauge, this.GAUGESTYLE)
            };

            this.gauge.in.set(toBPSString(config.in), config.in / config.bandwidth *100);
            this.gauge.out.set(toBPSString(config.out), config.out / config.bandwidth *100);

            container.appendChild(inGauge);
            container.appendChild(outGauge);
            container.appendChild(ethernet);
            container.appendChild(label);

            if (config.peer) {
                const
                    link = document.createElement("div"),
                    path = document.createElement("div"),
                    label = document.createElement("div");
                let dot;

                path.style.width = "50%";
                path.style.height = "5em";
                path.style.position = "relative";
                path.style.borderRight = "1px solid #dddddd";

                dot = document.createElement("span");

                dot.style.position = "absolute";
                dot.style.inset = "0 0 -100% 100%";
                dot.style.borderRadius = "50%";
                dot.style.width = "1em";
                dot.style.height = "1em";
                dot.style.backgroundColor = "#aaaaaa";
                dot.style.transform = "translate(-50%, 0)";

                path.appendChild(dot);

                dot = dot.cloneNode(true);
                dot.style.inset = "100% 0 0 100%";
                dot.style.transform = "translate(-50%, -100%)";

                path.appendChild(dot);

                link.appendChild(path);

                image.style.height = "5em";
                image.style.background = "no-repeat center";
                image.style.backgroundImage = `url(${config.peer.image})`;

                link.appendChild(label).textContent = config.peer.label;
                link.appendChild(image);

                container.appendChild(link);
            }

            args[0].appendChild(container);
        }
    };
}