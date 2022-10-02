"use strict";

export default class Enterprise {
    #container;
    #mibData = new Map();
    #indexToMap = new Map();

    constructor (container, mibData, template) {
        this.#container = container;

        let mib;
        for (let oid in mibData) {
            mib = mibData[oid];

            if (mib.template === template) {
                this.#mibData.set(oid, mib);
            }
        }
    }

    parse (index, indexData, callback) {
        for (let oid in indexData) {
            if (this.try(oid)) {
                this.add(oid, index, callback);

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
        const classList = this.#container.classList;

        if (classList.contains("status")) {
            switch (status) {
            case "normal":
                classList.remove("shutdown", "critical");
                
                break;
            case "shutdown":
                classList.add("shutdown");
                classList.remove("critical");
                
                break;
            case "critical":
                classList.remove("shutdown");
                classList.add("critical");

                break;
            }
        }
    }
}