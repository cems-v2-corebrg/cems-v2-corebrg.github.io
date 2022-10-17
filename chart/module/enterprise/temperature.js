"use strict";

import Enterprise from "./enterprise.js";

export default class Temperature extends Enterprise {
    
    constructor (container, mibData, onselect) {
        super(container, mibData, "temperature", onselect);
    }

    add (oid, index, onselect) {
        const
            container = document.createElement("li"),
            unit = super.value(oid);

        container.appendChild(document.createElement("label"));

        super.setData(index, new Map()
            .set("container", container)
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
        let oid, container, unit;

        super.forEach((index, map) => {
            oid = map.get("oid");
            container = map.get("container");
            unit = map.get("unit")

            container.querySelector("label").textContent = `${(Number(resourceData[index][oid]) * unit).toFixed(1)} ${String.fromCodePoint("0x2103")}`;

            container.classList[criticalData[index]?.[oid] === false? "add": "remove"]("critical");
        });
    }
}