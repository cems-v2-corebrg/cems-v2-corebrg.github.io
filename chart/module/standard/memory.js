"use strict";

import Storage from "./storage.js";

export default class Memory extends Storage {

    constructor (container, onselect) {
        super(container, onselect);
    }

    isValidType (type) {
        return type === ITAhM.snmp.oid.hrStorageRam;
    }
}