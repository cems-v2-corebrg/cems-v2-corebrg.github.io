"use strict";

import Enterprise from "./enterprise.js";

export default class Power extends Enterprise {
    constructor (container, mibData) {
        super(container, mibData, "power");
    }

    add (oid, index) {
        const container = document.createElement("li");

        super.setData(index, new Map()
            .set("container", container)
            .set("oid", oid));

        super.addContainer(container);
    }

    update ({matchData}) {
        let container, status, oid, count = 0;

        super.forEach((index, map) => {
            container = map.get("container");
            oid = map.get("oid");

            status = matchData[index]?.[oid] !== false;

            if (status) {
                container.classList.add("normal");

                count++;
            } else {
                container.classList.remove("normal");
            }
        });

        if (super.size === count) {
            super.status = "normal";
        } else if (count === 0) {
            super.status = "shutdown";
        } else {
            super.status = "critical";
        }
    }
}