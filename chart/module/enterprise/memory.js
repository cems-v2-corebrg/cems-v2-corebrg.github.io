"use strict";

import Enterprise from "./enterprise.js";

export default class Memory {
    static COLOR_GREEN = "#00897b";
    static COLOR_ORANGE = "#f6bf26";
    static COLOR_RED = "#8e24aa";
    
    #container;
    #mibData = new Map();
    #indexToChart = new Map();
    
    constructor (container) {
        this.#container = container;
    }

    add (oid, index, callback) {
        const container = document.createElement("li");

        if (callback) {
            container.callback = e => callback({
                chart: "/chart/memory.html",
                oid: oid,
                index: index,
                unit: 1
            });

            container.classList.add("selectable");
        }

        container.classList.add("status");

        this.#indexToChart.set(index, new Map()
            .set("container", container)
            .set("chart", new Chart(container.appendChild(document.createElement("canvas")), {
                type: 'bar',
                data: {
                    labels: [""],
                    datasets: [{
                        data: [0],
                        backgroundColor: Memory.COLOR_GREEN
                    }, {
                        data: [0],
                        backgroundColor: Memory.COLOR_ORANGE
                    }, {
                        data: [0],
                        backgroundColor: Memory.COLOR_RED
                    }]
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
            }))
            .set("oid", oid));

        this.#container.appendChild(container);
    }

    update ({resourceData, criticalData}) {
        let chart, value, oid, datasets;

        for (let [index, map] of this.#indexToChart) {
            oid = map.get("oid");
            value = Number(resourceData[index][oid]);
            chart = map.get("chart");

            datasets = chart.config.data.datasets;

            if (value > 90) {
                datasets[0].data[0] = 70;
                datasets[1].data[0] = 20;
                datasets[2].data[0] = value -90;
            } else if (value > 70) {
                datasets[0].data[0] = 70;
                datasets[1].data[0] = value -70;
                datasets[2].data[0] = 0;
                
            } else {
                datasets[0].data[0] = value;
                datasets[1].data[0] = 0;
                datasets[2].data[0] = 0;
            }
            
            chart.config.label = `${value.toFixed(2)}%`;
            
            chart.update();

            map.get("container").classList[criticalData[index]?.[oid] === false? "add": "remove"]("critical");
        }
    }
}
