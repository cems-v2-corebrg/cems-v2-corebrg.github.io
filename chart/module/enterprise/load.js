"use strict";

import Enterprise from "./enterprise.js";

export default class Load extends Enterprise {
    static COLOR_NORMAL = "#00897b";
    static COLOR_CRITICAL = "#fe6a50";
    static COLOR_MAJOR = "#f6bf26";
    static COLOR_SHUTDOWN = "#8e24aa";
    static COLOR_NULL = "transparent";
    static COLOR_GAUGE = "#dddddd";
    
    constructor (container, mibData, onselect) {
        super(container, mibData, "load", onselect);
    }

    add (oid, index, onselect) {
        const
            container = document.createElement("li"),
            unit = super.value(oid);

        super.setData(index, new Map()
            .set("container", container)
            .set("chart", new Chart(container.appendChild(document.createElement("canvas")), {
                type: "doughnut",
                data: {
                    datasets: [{
                        data: [70, 20, 10],
                        backgroundColor: [Load.COLOR_NORMAL, Load.COLOR_CRITICAL, Load.COLOR_SHUTDOWN]
                    }]
                },
                options: {
                    cutoutPercentage: 70,
                    circumference: Math.PI,
                    rotation: Math.PI *-1
                }
            }))
            .set("oid", oid)
            .set("index", index)
            .set("unit", unit));

        if (onselect) {
            container.onclick = e => onselect(super.getData(index));

            container.classList.add("selectable");
        }

        container.classList.add("status");

        super.addContainer(container);
    }

    update ({resourceData, criticalData}) {
        let chart, value, oid;

        super.forEach((index, map) => {
            oid = map.get("oid");
            chart = map.get("chart");
            
            value = Number(resourceData[index][oid]);

            chart.config.data.datasets[1] = {
                data: [value, 100 - value],
                backgroundColor: [Load.COLOR_GAUGE, Load.COLOR_NULL]
            };
            
            chart.config.label = `${value.toFixed(2)}%`;

            chart.update();

            map.get("container").classList[criticalData[index]?.[oid] === false? "add": "remove"]("critical");
        });
    }
}