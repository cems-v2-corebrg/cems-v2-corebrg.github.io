;"use strict";

const
    oidData = {
        "sysDescr": {
            value: "1.3.6.1.2.1.1.1",
            type: "OctetString"
        },
        "sysObjectID": {
            value: "1.3.6.1.2.1.1.2",
            type: "OID"
        },
        "sysUpTime": {
            value: "1.3.6.1.2.1.1.3",
            type: "TimeTicks"
        },
        "hrSystemUptime": {
            value: "1.3.6.1.2.1.25.1.1",
            type: "TimeTicks"
        },
        "sysName": {
            value: "1.3.6.1.2.1.1.5",
            type: "OctetString"
        },
        "ifDescr": {
            value: "1.3.6.1.2.1.2.2.1.2",
            type: "OctetString"
        },
        "ifName": {
            value: "1.3.6.1.2.1.31.1.1.1.1",
            type: "OctetString"
        },
        "ifAlias": {
            value: "1.3.6.1.2.1.31.1.1.1.18",
            type: "OctetString"
        },
        "ifType": {
            value: "1.3.6.1.2.1.2.2.1.3",
            type: "Integer32"
        },
        "ifSpeed": {
            value: "1.3.6.1.2.1.2.2.1.5",
            type: "Gauge32"
        },
        "ifHighSpeed": {
            value: "1.3.6.1.2.1.31.1.1.1.15",
            type: "Gauge32"
        },
        "ifAdminStatus": {
            value: "1.3.6.1.2.1.2.2.1.7",
            type: "Integer32"
        },
        "ifOperStatus": {
            value: "1.3.6.1.2.1.2.2.1.8",
            type: "Integer32"
        },
        "ifInOctets": {
            value: "1.3.6.1.2.1.2.2.1.10",
            type: "Counter32",
            log: true
        },
        "ifHCInOctets": {
            value: "1.3.6.1.2.1.31.1.1.1.6",
            type: "Counter64",
            log: true
        },
        "ifInErrors": {
            value: "1.3.6.1.2.1.2.2.1.14",
            type: "Counter32"
        },
        "ifOutOctets": {
            value: "1.3.6.1.2.1.2.2.1.16",
            type: "Counter32",
            log: true
        },
        "ifHCOutOctets": {
            value: "1.3.6.1.2.1.31.1.1.1.10",
            type: "Counter64",
            log: true
        },
        "ifOutErrors": {
            value: "1.3.6.1.2.1.2.2.1.20",
            type: "Counter32"
        },
        "hrProcessorLoad": {
            value: "1.3.6.1.2.1.25.3.3.1.2",
            type: "Integer32",
            log: true
        },
        "hrStorageUsed": {
            value: "1.3.6.1.2.1.25.2.3.1.6",
            type: "Integer32",
            log: true
        },
        "hrStorageType": {
            value: "1.3.6.1.2.1.25.2.3.1.2",
            type: "OID"
        },
        "hrStorageDescr": {
            value: "1.3.6.1.2.1.25.2.3.1.3",
            type: "OctetString"
        },
        "hrStorageAllocationUnits": {
            value: "1.3.6.1.2.1.25.2.3.1.4",
            type: "Integer32"
        },
        "hrStorageSize": {
            value: "1.3.6.1.2.1.25.2.3.1.5",
            type: "Integer32"
        },
        "hrStorageUsed": {
            value: "1.3.6.1.2.1.25.2.3.1.6",
            type: "Integer32",
            log: true
        }
    },
    queryCard = {
        "sysDescr": {
            "sysDescr": {
                value: "1.3.6.1.2.1.1.1",
                type: "OctetString"
            }
        },
        "hrProcessorLoad": {
            "hrProcessorLoad": {
                //match: any,
                //condition: none,
                //weight: 1,
                //name: none,
                value: "1.3.6.1.2.1.25.3.3.1.2",
                max: 100,
                type: "Integer32"
            }
        },
        "hrStorageUsed": {
            "hrStorageUsed": {
                match: "1.3.6.1.2.1.25.2.1.2",
                condition: "1.3.6.1.2.1.25.2.3.1.2",
                weight: "1.3.6.1.2.1.25.2.3.1.4",
                value: "1.3.6.1.2.1.25.2.3.1.6",
                max: "1.3.6.1.2.1.25.2.3.1.5",
                name: "1.3.6.1.2.1.25.2.3.1.3"
            }
        },
        "hrMemoryUsed": {
            "hrMemoryUsed": {
                match: "1.3.6.1.2.1.25.2.1.4",
                condition: "1.3.6.1.2.1.25.2.3.1.2",
                weight: "1.3.6.1.2.1.25.2.3.1.4",
                value: "1.3.6.1.2.1.25.2.3.1.6",
                max: "1.3.6.1.2.1.25.2.3.1.5",
                name: "1.3.6.1.2.1.25.2.3.1.3"
            }
        }
    },
    querySet = {
        "기본": {
            name: "기본",
            "프로세서 로드": "표준",
            "메모리": "표준",
            "스토리지": "표준"
        }
    };

function Query () {
}

Query.toString = function (name) {
    querySet[name]
};