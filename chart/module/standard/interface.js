"use strict";

export default class Interface {
    
    #container;
    #onselect;
    #onerror
    #indexToMap = new Map();
    #typeToArray = new Map();
    #cache = document.createDocumentFragment();
    #prefix;
    #image;

    constructor (container, image, onselect, onerror) {
        this.#container = container;
        this.#image = image;
        this.#onselect = onselect;
        this.#onerror = onerror;
    }

    parse (index, indexData) {
        
        const container = document.createElement("li");
        let bandwidth = 0, label = "", names = [];

        if (!(ITAhM.snmp.oid.ifAdminStatus in indexData)) {
            return;
        }

        if (!(ITAhM.snmp.oid.ifOperStatus in indexData)) {
            return;
        }

        if (ITAhM.snmp.oid.ifHCInOctets in indexData && ITAhM.snmp.oid.ifHCOutOctets in indexData) {
            this.#prefix = "ifHC";
        } else if (ITAhM.snmp.oid.ifInOctets in indexData && ITAhM.snmp.oid.ifOutOctets in indexData) {
            this.#prefix = "if";
        } else {
            return;
        }

        if (ITAhM.snmp.oid.ifSpeed in indexData) {
            bandwidth = Number(indexData[ITAhM.snmp.oid.ifSpeed]);
        }
        
        if (ITAhM.snmp.oid.ifHighSpeed in indexData) {
            bandwidth = Math.max(bandwidth, Number(indexData[ITAhM.snmp.oid.ifHighSpeed]) *1000000);
        }

        if (ITAhM.snmp.oid.ifType in indexData) {
            const type = indexData[ITAhM.snmp.oid.ifType];
            let array = this.#typeToArray.get(type);

            if (!array) {
                array = [];

                this.#typeToArray.set(type, array);
            }

            array.push(container);
        }

        [ITAhM.snmp.oid.ifName, ITAhM.snmp.oid.ifDescr, ITAhM.snmp.oid.ifAlias]
            .forEach(name => indexData[name] && names.push(indexData[name]));

        names.sort((n1, n2) => n1.length - n2.length);

        container.appendChild(document.createElement("label")).onclick = e => {
            e.stopPropagation();
            
            this.#onerror({
                index: index,
                title: names[0] || ""
            });
        };

        container.classList.add("selectable");

        container.onclick = e => this.#onselect({
            index: index,
            oid: this.#prefix,
            max: bandwidth,
            unit: 8,
            title: names[0]
        });

        this.#indexToMap.set(index, new Ethernet(this.#container.appendChild(container), {
            image: this.#image,
            bandwidth: bandwidth,
            label: names[0]
        }));

        if (names.length > 0) {
            container.title = names.pop();
        }
    }

    update ({resourceData, criticalData, matchData}) {
        const
            oidIn = ITAhM.snmp.oid[`${this.#prefix}InOctets`],
            oidOut = ITAhM.snmp.oid[`${this.#prefix}OutOctets`];
        let indexData, ifAdminStatus, ifOperStatus, inOctets, outOctets, inErrors, outErrors;

        for (let [index, port] of this.#indexToMap) {
            indexData = resourceData[index];

            ifAdminStatus = Number(indexData[ITAhM.snmp.oid.ifAdminStatus]);
            ifOperStatus = Number(indexData[ITAhM.snmp.oid.ifOperStatus]);
            inOctets = indexData[oidIn];
            outOctets = indexData[oidOut];
            inErrors = Number(indexData[ITAhM.snmp.oid.ifInErrors]);
            outErrors = Number(indexData[ITAhM.snmp.oid.ifOutErrors]);

            if (ifAdminStatus !== 1) {
                port.status(Ethernet.STATUS_DISABLED);
                port.set();
            } else if (ifOperStatus !== 1) {
                if (matchData[index]?.[ITAhM.snmp.oid.ifOperStatus] === false) {
                    port.status(Ethernet.STATUS_MAJOR);
                } else {
                    port.status(Ethernet.STATUS_SHUTDOWN);
                }

                port.set();
            } else {
                if (criticalData[index]?.[oidIn] === false || criticalData[index]?.[oidOut] === false) {
                    port.status(Ethernet.STATUS_CRITICAL);
                } else {
                    port.status(Ethernet.STATUS_NORMAL);
                }
                
                port.set(Number(inOctets) * 8, Number(outOctets) * 8);
            }
        }
        
    }

    forEach (forEach) {
        const iterator = this.#typeToArray.keys();

        for (let type=iterator.next(); !type.done; type=iterator.next()) {
            forEach(type.value);
        }
    }

    set type (type) {
        const array = this.#typeToArray.get(type);

        if (array) {
            const cache = document.createDocumentFragment();

            array.forEach(container => cache.appendChild(container));
            
            for (let container; container=this.#container.firstChild;) {
                this.#cache.appendChild(container);
            }

            this.#container.appendChild(cache);
        }
    }

    get size () {
        return this.#indexToMap.size;
    }
}