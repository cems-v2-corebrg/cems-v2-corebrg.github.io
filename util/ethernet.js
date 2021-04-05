"use strict";

function Ethernet() {
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
    
    function Background() {
        this.initialize(arguments);
    }

    Ethernet.STATUS_NORMAL = 0;
    Ethernet.STATUS_CRITICAL = 1;
    Ethernet.STATUS_SHUTDOWN = 2;
    Ethernet.STATUS_DISABLED = 9;
    Ethernet.fontColor = "#000000";

    Background.prototype = {
        initialize: function (args) {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
            this.config = args[0] || {};

            this.canvas.width =
            this.canvas.height = this.config.size;

            this.update();
        },
        update: function () {
            this.context.save();
            
            this.context.clearRect(0, 0, this.config.size, this.config.size);

            this.context.drawImage(this.config.image, 0, 0, this.config.size, this.config.size);
            
            switch(this.config.status) {
            case Ethernet.STATUS_SHUTDOWN:
                this.context.fillStyle = "#8e24aa";

                break;
            case Ethernet.STATUS_CRITICAL:
                this.context.fillStyle = "#f6bf26";

                break;
            case Ethernet.STATUS_NORMAL:
                this.context.fillStyle = "#00897b";

                break;
            default:
                this.context.fillStyle = "#666666";
            }

            this.context.globalCompositeOperation = "source-in";
            this.context.fillRect(0, 0, this.config.size, this.config.size);

            this.context.restore();
        }
    };

    function Gauge() {
        this.initialize(arguments);
    }

    Gauge.prototype = {
        initialize: function (args) {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
            this.config = args[0]|| {};

            this.canvas.width =
            this.canvas.height = this.config.size;

            this.barHeight = Math.round(this.config.size * 0.3);
            this.offsetInGauge = Math.round(this.config.size * 0.2);
            this.offsetOutGauge = Math.round(this.config.size * 0.5);
            this.offsetInText = Math.round(this.config.size * 0.35);
            this.offsetOutText = Math.round(this.config.size * 0.65);
            this.context.textBaseline = "middle";
            this.context.textAlign = "right";
            this.context.font = `${Math.round(this.config.size *0.15)}px "맑은 고딕", "Tahoma", "Arial`;
        },
        update: function () {
            this.context.clearRect(0, 0, this.config.size, this.config.size);

            if (this.config.gauge) {
                this.context.save();

                this.context.fillStyle = "rgba(200, 200, 200, 0.5)";
                this.context.fillRect(0, this.offsetInGauge, this.config.size, this.barHeight);
                this.context.fillRect(0, this.offsetOutGauge, this.config.size, this.barHeight);

                this.context.fillStyle = "rgba(0, 255, 0, 0.6)";
                this.context.fillRect(0, this.offsetInGauge, Math.round(this.config.gauge.in.length * this.config.size /100), this.barHeight);

                this.context.fillStyle = "rgba(255, 150, 0, 0.6)";
                this.context.fillRect(0, this.offsetOutGauge, Math.round(this.config.gauge.out.length), this.barHeight);

                this.context.fillStyle = Ethernet.fontColor;
                //this.context.globalCompositeOperation='darker';
                this.context.fillText(this.config.gauge.in.text, this.config.size, this.offsetInText);
                this.context.fillText(this.config.gauge.out.text, this.config.size, this.offsetOutText);

                this.context.restore();
            }
        }
    };

    Ethernet.prototype = {
        initialize: function (args) {
            this.container = args[0];
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
            this.config = args[1] || {};
            this.config.in = {
                text: toBPSString(0),
                gauge: 0
            };
            this.config.out = {
                text: toBPSString(0),
                gauge: 0
            };
            this.config.size = args[0].getBoundingClientRect().width;

            this.canvas.width =
            this.canvas.height = this.config.size;

            this.background = new Background(this.config);
            this.gauge = new Gauge(this.config);

            this.update();

            this.container.appendChild(this.canvas);
        },
        update: function () {
            this.context.clearRect(0, 0, this.config.size, this.config.size);

            this.context.drawImage(this.background.canvas, 0, 0);

            this.gauge.update();
            this.context.drawImage(this.gauge.canvas, 0, 0);
        },
        set: function (input, output) {
            if (arguments.length === 2) {
                this.input = input;
                this.output = output;

                this.animate();
            } else {
                delete this.config.gauge;

                this.update();
            }
        },
        status: function (status) {
            this.context.clearRect(0, 0, this.config.size, this.config.size);

            this.config.status = status;

            this.background.update();
            this.context.drawImage(this.background.canvas, 0, 0);

            this.context.drawImage(this.gauge.canvas, 0, 0);
        },
        animate: function (t) {
            if (t) {
                if (!this.start) {
                    this.start = t;
                }

                if (t < this.start +1000) {
                    this.draw(this.input *(t - this.start) / 1000, this.output *(t - this.start) /1000);
                } else {
                    return this.draw(this.input, this.output);
                }
            } else {
                delete this.start;
            }

            window.requestAnimationFrame(this.animate.bind(this));
        },
        draw: function (input, output) {
            this.config.gauge = {
                in: {
                    text: toBPSString(Math.round(input)),
                    length: Math.round(input /this.config.bandwidth *100)
                },
                out: {
                    text: toBPSString(Math.round(output)),
                    length: Math.round(output / this.config.bandwidth *100)
                }
            }

            this.update();
        },
        label: function (text) {
            const labelHeight = this.config.size *0.2;

            this.canvas.height = this.config.size + labelHeight;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.drawImage(this.background.canvas, 0, 0);
            this.context.drawImage(this.gauge.canvas, 0, 0);

            this.context.save();

            this.context.font = `12px "맑은 고딕", "Tahoma", "Arial"`;
            this.context.fillStyle = Ethernet.fontColor;
            this.context.textBaseline = "middle";

            if (this.context.measureText(text).width > this.config.size) {
                this.context.textAlign = "start";
                this.context.fillText(text, 0, this.canvas.height - labelHeight /2);
            } else {
                this.context.textAlign = "center";
                this.context.fillText(text, this.config.size /2, this.canvas.height - labelHeight /2);
            }

            this.context.restore();
        },
        link: function (text, image) {
            const
                canvas = document.createElement("canvas"),
                offsetY = this.canvas.height,
                offsetX = this.canvas.width /2,
                radius = 5,
                textHeight = this.config.size *0.2,
                lineLength = this.config.size *0.6,
                imageRect = {
                    x: this.config.size *0.3,
                    y: this.config.size *2,
                    width: this.config.size *0.4,
                    height: this.config.size *0.4
                };

            canvas.width = this.config.size;
            canvas.height = this.config.size *2.4;

            canvas.getContext("2d").drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);
            
            this.canvas.height = canvas.height;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.drawImage(canvas, 0, 0, this.canvas.width, this.canvas.height);

            this.context.drawImage(image, imageRect.x, imageRect.y, imageRect.width, imageRect.height);

            this.context.save();

            this.context.beginPath();
            this.context.moveTo(offsetX, offsetY);
            this.context.lineTo(offsetX, offsetY + lineLength);
            this.context.strokeStyle = "#ffffff";
            this.context.stroke();
            
            this.context.fillStyle = Ethernet.fontColor;

            this.context.beginPath();
            this.context.arc(offsetX, offsetY + radius, radius, 0, Math.PI *2);
            this.context.fill();

            this.context.beginPath();
            this.context.arc(offsetX, offsetY + lineLength - radius, radius, 0, Math.PI *2);
            this.context.fill();

            this.context.font = `${Math.round(this.config.size *0.12)}px "맑은 고딕", "Tahoma", "Arial`;
            this.context.fillStyle = Ethernet.fontColor;
            this.context.textBaseline = "bottom";

            if (this.context.measureText(text).width > this.config.size) {
                this.context.textAlign = "start";
                this.context.fillText(text, 0, offsetY + lineLength + textHeight);
            } else {
                this.context.textAlign = "center";
                this.context.fillText(text, offsetX, offsetY + lineLength + textHeight);
            }
            
            this.context.restore();
        }
    };
}