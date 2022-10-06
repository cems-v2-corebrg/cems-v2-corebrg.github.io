"use strict";

export default class Storage {

    static COLOR_GREEN = "#00897b";
    static COLOR_ORANGE = "#f6bf26";
    static COLOR_RED = "#8e24aa";

    #container;
    #onselect;
    #indexToMap = new Map();

    constructor (container, onselect) {
        this.#container = container.querySelector(".container");
        this.#onselect = onselect;
    }

    parse (index, indexData) {
        if (!this.isValidType(indexData[ITAhM.snmp.oid.hrStorageType]) ||
            [ITAhM.snmp.oid.hrStorageUsed,
            ITAhM.snmp.oid.hrStorageSize,
            ITAhM.snmp.oid.hrStorageAllocationUnits]
            .some(oid => !(oid in indexData))) {
                return;
            }
            
        const container = document.createElement("li");
        
        this.#indexToMap.set(index, new Map()
            .set("container", container)
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

        container.classList.add("selectable");

        const units = Number(indexData[ITAhM.snmp.oid.hrStorageAllocationUnits]);

        container.onclick = e => this.#onselect({
            index: index,
            max: Number(indexData[ITAhM.snmp.oid.hrStorageSize]) * units,
            unit: units,
            title: indexData[ITAhM.snmp.oid.hrStorageDescr] || undefined
        });

        container.classList.add("status", "selectable");

        this.#container.appendChild(container);
    }

    update ({resourceData, criticalData}) {
        let container, indexData, chart, used, datasets;

        for (let [index, map] of this.#indexToMap) {
            container = map.get("container");
            chart = map.get("chart");

            indexData = resourceData[index];

            used = Number(indexData[ITAhM.snmp.oid.hrStorageUsed])
                / Number(indexData[ITAhM.snmp.oid.hrStorageSize]) *100;

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

            chart.config.label = `${used.toFixed(2)}%`
            chart.config.data.datasets = datasets;

            chart.update();

            container.classList[criticalData[index]?.[ITAhM.snmp.oid.hrStorageUsed] === false? "add": "remove"]("critical");
        }
    }

    isValidType (type) {
        return type === ITAhM.snmp.oid.hrStorageFixedDisk;
    }

    get size () {
        return this.#indexToMap.size;
    }
}