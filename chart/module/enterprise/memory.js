"use strict";

import Enterprise from "./enterprise.js";

export default class Storage extends Enterprise {

    static COLOR_GREEN = "#00897b";
    static COLOR_ORANGE = "#f6bf26";
    static COLOR_RED = "#8e24aa";

    constructor (container, onselect) {
        super(container, mibData, "memory", onselect);
    }

    add (oid, index, onselect) {
        const container = document.createElement("li");
        
        super.setData(index, new Map()
            .set("container", container)
            .set("oid", oid)
            .set("index", oid)
            .set("chart", new Chart(container.appendChild(document.createElement("canvas")), {
                type: 'bar',
                data: {
                    labels: [indexData[ITAhM.snmp.oid.hrStorageDescr] || ""]
                },
                options: {
                    scales: {
                        xAxes: [{
                            stacked: true,
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: "#ffffff",
                                callback: value => value.substr(0, 30)
                            }
                        }],
                        yAxes: [{
                            stacked: true,
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                display: false,
                                max: 100,
                                min: 0
                            }
                        }]
                    },
                    layout: {
                        padding: {
                            right: 20,
                            left: 20
                        }
                    }
                }
            })));
        
        if (onselect) {
            container.onclick = e => onselect(super.getData(index));

            container.classList.add("selectable");
        }

        container.classList.add("status");

        super.addContainer(container);
    }

    update ({resourceData, criticalData}) {
        let indexData, chart, used, datasets;

        super.forEach((index, map) => {
            oid = map.get("oid");
            chart = map.get("chart");
            
            used = Number(resourceData[index][oid]);

            datasets = [{
                data: [0],
                backgroundColor: Storage.COLOR_GREEN
            }, {
                data: [0],
                backgroundColor: Storage.COLOR_ORANGE
            }, {
                data: [0],
                backgroundColor: Storage.COLOR_RED
            }];

            if (used <= 70) {
                datasets[0].data[0] = Math.round(used);
            } else {
                datasets[0].data[0] = 70;

                if (used <= 90) {
                    datasets[1].data[0] = used -70;
                } else {
                    datasets[1].data[0] = 20;
                    datasets[2].data[0] = used -90;
                }
            }
            
            chart.config.label = `${value.toFixed(2)}%`;
            chart.config.data.datasets = datasets;

            chart.update();

            map.get("container").classList[criticalData[index]?.[oid] === false? "add": "remove"]("critical");
        });

    }
}