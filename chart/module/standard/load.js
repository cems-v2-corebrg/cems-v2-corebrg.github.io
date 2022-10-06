"use strict";

export default class Load {

    static OPTIONS = {
        cutoutPercentage: 70,
        circumference: Math.PI,
        rotation: Math.PI *-1
    };
    static COLOR_GREEN = "#00897b"; //"#2FE3FE"
    static COLOR_ORANGE = "#f6bf26";//"#FE6A50"
    static COLOR_RED = "#8e24aa"; //"#8900FF"
    static COLOR_NULL = "transparent";
    static COLOR_GAUGE = "#dddddd";
    static BACKGROUND = {
        data: [70, 20, 10],
        backgroundColor: [Load.COLOR_GREEN, Load.COLOR_ORANGE, Load.COLOR_RED]
    }

    #container;
    #status;
    #indexList = [];
    #nameToChart = new Map();

    constructor (container, onselect) {
        this.#container = container.querySelector(".container");
        this.#status = container.classList;

        const
            min = document.createElement("li"),
            avg = document.createElement("li"),
            max = document.createElement("li"),
            df = document.createDocumentFragment();
        
        this.#nameToChart.set("min", new Chart(min.appendChild(document.createElement("canvas")), {
            type: "doughnut",
            data: {
                datasets: [Load.BACKGROUND]
            },
            options: Load.OPTIONS
        }));
        
        
        this.#nameToChart.set("avg", new Chart(avg.appendChild(document.createElement("canvas")), {
            type: "doughnut",
            data: {
                datasets: [Load.BACKGROUND]
            },
            options: Load.OPTIONS
        }));

        this.#nameToChart.set("max", new Chart(max.appendChild(document.createElement("canvas")), {
            type: "doughnut",
            data: {
                datasets: [Load.BACKGROUND]
            },
            options: Load.OPTIONS
        }));

        df.appendChild(min);
        df.appendChild(avg);
        df.appendChild(max);

        this.#container.onclick = e=> onselect({
            oid: ITAhM.snmp.oid.hrProcessorLoad
        });

        this.#container.appendChild(df);
    }

    parse (index, indexData) {
        if (!(ITAhM.snmp.oid.hrProcessorLoad in indexData)) {
            return;
        }
        
        this.#indexList.push(index);
    }

    update ({resourceData, criticalData}) {
        if (this.#indexList.length === 0) {
            return;
        }

        const loads = [];
        let load;

        this.#status.remove("critical");

        this.#indexList.forEach(index => {
            loads.push(Number(resourceData[index][ITAhM.snmp.oid.hrProcessorLoad]));

            if (criticalData[index]?.[ITAhM.snmp.oid.hrProcessorLoad] === false) {
                this.#status.add("critical");
            }
        });
        
        for (let [name, chart] of this.#nameToChart) {
            switch (name) {
            case "min":
                load = Math.min(...loads);

                break;
            case "avg":
                load = loads.reduce((a, b) => a + b) / loads.length;
                
                break;
            case "max":
                load = Math.max(...loads);
                
                break;
            }

            chart.config.data.datasets[1] = {
                data: [load, 100 - load],
                backgroundColor: [Load.COLOR_GAUGE, Load.COLOR_NULL]
            }
        
            chart.config.label = `${load.toFixed(2)}%`;

            chart.update();
        }
    }

    get size () {
        return this.#indexList.length;
    }
}