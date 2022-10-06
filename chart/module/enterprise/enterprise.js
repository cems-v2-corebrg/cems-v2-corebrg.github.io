"use strict";

export default class Enterprise {
    #container;
    #status;
    #onselect;
    #mibData = new Map();
    #indexToMap = new Map();

    constructor (container, mibData, template, onselect) {
        this.#container = container.querySelector(".container");

        if (container.classList.contains("status")) {
            this.#status = container.classList;
        }

        let mib;
        for (let oid in mibData) {
            mib = mibData[oid];

            if (mib.template === template) {
                this.#mibData.set(oid, mib);
            }
        }

        this.#onselect = onselect;
    }

    parse (index, indexData) {
        for (let oid in indexData) {
            if (this.try(oid)) {
                this.add(oid, index, this.#onselect);

                break;
            }
        }
    }

    try (oid) {
        if (!this.#mibData.has(oid)) {
            let some = false;
            for (let key of this.#mibData.keys()) {
                if (oid.indexOf(key) !== -1) {
                    some = true;

                    break;
                }
            }

            if (!some) {
                return false;
            }
        }

        return true;
    }

    addContainer (container) {
        this.#container.appendChild(container);
    }

    get size () {
        return this.#indexToMap.size;
    }

    value (oid) {
        return this.#mibData.get(oid).value;
    }

    setData (index, map) {
        this.#indexToMap.set(index, map);
    }

    getData (index) {
        const map = {};

        for (let [key, value] of this.#indexToMap.get(index)) {
            map[key] = value;
        }

        return map;
    }

    forEach (forEach) {
        for (let [index, map] of this.#indexToMap) {
            forEach(index, map);
        }
    }

    set status (status) {
        if (this.#status) {
            switch (status) {
            case "normal":
                this.#status.remove("shutdown", "critical");
                
                break;
            case "shutdown":
                this.#status.add("shutdown");
                this.#status.remove("critical");
                
                break;
            case "critical":
                this.#status.remove("shutdown");
                this.#status.add("critical");

                break;
            }
        }
    }
}