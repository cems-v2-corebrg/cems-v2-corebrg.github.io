"use strict";

export default class Response {
    
    #container;
    #index;
    #status;

    constructor (container, onselect) {
        this.#container = container.querySelector(".container");
        this.#status = container.classList;
        this.#container.onclick = e => onselect({
            index: this.#index
        });
    }

    parse (index, indexData) {
        if (ITAhM.snmp.oid.corebrg.responseTime in indexData) {
            this.#index = index;
        }
    }

    update ({resourceData, criticalData}) {
        this.#status.remove("shutdown", "critical");

        this.#container.querySelector("li.content").textContent
            = `${resourceData[this.#index]?.[ITAhM.snmp.oid.corebrg.responseTime]}ms`;

        this.#status[criticalData[this.#index]?.[ITAhM.snmp.oid.corebrg.responseTime] === false? "add": "remove"]("critical");
    }

    get size () {
        return this.#index? 1: 0;
    }
}