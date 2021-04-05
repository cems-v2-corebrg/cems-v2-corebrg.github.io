;"use strict";

const modelData = {
    "aruba": {
        "7030": {
            name: "7030",
            unit: 1,
            front: "/dc/img/front/aruba 7030.png",
            rear: "/dc/img/rear/aruba 7030.png"
        },
        "7210": {
            name: "7210",
            unit: 1,
            front: "/dc/img/front/aruba 7210.png",
            rear: "/dc/img/rear/aruba 7210.png"
        }
    },
    "aten": {
        "kvm switch": {
            name: "kvm switch",
            unit: 1,
            front: "dc/img/front/aten kvm switch.png",
            rear: "dc/img/rear/aten kvm switch.png"
        }
    },
    "axgate": {
        "axgate-40d": {
            name: "axgate-40d",
            unit: 1,
            front: "/dc/img/front/axgate-40d.jpg",
            rear: "/dc/img/rear/axgate-40d.jpg"
        }
    },
    "brocade": {
        "fcx624": {
            name: "fcx624",
            unit: 1,
            front: "/dc/img/front/brocade fcx624.png",
            rear: "/dc/img/rear/brocade fcx624.png"
        },
        "turboiron 24x": {
            name: "turboiron 24x",
            unit: 1,
            front: "/dc/img/front/brocade turboiron 24x.png",
            rear: "/dc/img/rear/brocade turboiron 24x.png"
        }
    },
    "cisco": {
        "2960-24tc-s": {
            name: "2960-24tc-s",
            unit: 1,
            front: "/dc/img/front/cisco.png",
            rear: "/dc/img/rear/cisco 2960-24tc-s.png"
        },
        "catalyst4948": {
            name: "catalyst4948",
            unit: 1,
            front: "/dc/img/front/cisco.png",
            rear: "/dc/img/rear/cisco.png"
        },
        "sg300-20": {
            name: "sg300-20",
            unit: 1,
            front: "/dc/img/front/cisco sg300-20.png",
            rear: "/dc/img/rear/cisco sg300-20.png"
        },
        "sg300-28": {
            name: "sg300-28",
            unit: 1,
            front: "/dc/img/front/cisco sg300-28.png",
            rear: "/dc/img/rear/cisco sg300-20.png"
        },
        "3750g": {
            name: "3750g",
            unit: 1,
            front: "/dc/img/front/cisco 3750g.png",
            rear: "/dc/img/rear/cisco 3750.png"
        },
        "4948e-f": {
            name: "4948e-f",
            unit: 1,
            front: "/dc/img/front/cisco 4948e-f.png",
            rear: "/dc/img/rear/cisco 4948e-f.png"
        },
        "ucs 6248up": {
            name: "UCS 6248UP",
            unit: 1,
            front: "/dc/img/front/cisco ucs6248up.jpg",
            rear: "/dc/img/rear/cisco ucs6248up.jpg"
        },
        "ucs 6296up": {
            name: "UCS 6296UP",
            unit: 2,
            front: "/dc/img/front/cisco ucs6296up.png",
            rear: "/dc/img/rear/cisco ucs6296up.jpg"
        },
        "7609-s": {
            name: "7609-s",
            unit: 21,
            front: "/dc/img/front/cisco 7609-s.png",
            rear: "/dc/img/rear/cisco 7609-s.png"
        }
    },
    "commvault lenovo": {
        "lc4000": {
            name: "lc4000",
            unit: 2,
            front: "/dc/img/front/commvault lenovo lc4000.png",
            rear: "/dc/img/unknown.png"
        }
    },
    "corebridge": {
        "unknown": {
            name: "unknown",
            unit: 1,
            front: "/dc/img/unknown.png",
            rear: "/dc/img/unknown.png"
        }
    },
    "dasan": {
        "v8607": {
            name: "v8607",
            unit: 8,
            front: "/dc/img/front/dasan v8607.png",
            rear: "/dc/img/unknown.png"
        }
    },
    "dell": {
        "n3048p": {
            name: "n3048p",
            unit: 1,
            front: "/dc/img/front/n3048p.jpg",
            rear: "/dc/img/unknown.png"
        },
        "poweredge 1750": {
            name: "poweredge 1750",
            unit: 1,
            front: "/dc/img/front/dell poweredge 1750.png",
            rear: "/dc/img/unknown.png"
        },
        "poweredge r330": {
            name: "poweredge r330",
            unit: 1,
            front: "/dc/img/front/dell poweredge r330.png",
            rear: "/dc/img/rear/dell poweredge r330.png"
        },
        "poweredge r440": {
            name: "poweredge r440",
            unit: 1,
            front: "/dc/img/front/dell poweredge r440.png",
            rear: "/dc/img/rear/dell poweredge r440.png"
        },
        "poweredge r630": {
            name: "poweredge r630",
            unit: 1,
            front: "/dc/img/front/dell poweredge r630.png",
            rear: "/dc/img/rear/dell poweredge r630.png"
        },
        "poweredge r730": {
            name: "poweredge r730",
            unit: 1,
            front: "/dc/img/front/dell poweredge r730.png",
            rear: "/dc/img/rear/dell poweredge r730.png"
        },
        "poweredge r930": {
            name: "poweredge r930",
            unit: 1,
            front: "/dc/img/front/dell poweredge r930.png",
            rear: "/dc/img/rear/dell poweredge r930.png"
        }
    },
    "emc": {
        "brocade 300": {
            name: "brocade 300",
            unit: 1,
            front: "/dc/img/front/emc brocade 300.png",
            rear: "/dc/img/rear/emc brocade 300.png"
        },
        "unity 300h": {
            name: "unity 300h",
            unit: 2,
            front: "/dc/img/front/emc unity 300h.png",
            rear: "/dc/img/unknown.png"
        }
    },
    "ibm": {
        "x3250m5": {
            name: "x3250m5",
            unit: 1,
            front: "/dc/img/front/ibm x3250m5.png",
            rear: "/dc/img/rear/ibm x3250m5.png"
        },
        "x3650m5": {
            name: "x3650m5",
            unit: 2,
            front: "/dc/img/front/ibm x3650m5.jpg",
            rear: "/dc/img/rear/ibm x3650m5.jpg"
        },
        "server": {
            name: "server",
            front: "/dc/img/front/ibm.jpg",
            rear: "/dc/img/rear/828642a.jpg",
            unit: 5
        }
    },
    "intel": {
        "r2308wt": {
            name: "r2308wt",
            unit: 2,
            front: "/dc/img/front/intel r2308wt.png",
            rear: "/dc/img/rear/intel r2308wt.png"
        }
    },
    "jiransoft": {
        "spamsniper 5000b": {
            name: "spamsniper 5000b",
            unit: 1,
            front: "/dc/img/front/jiransoft spamsniper 5000b.png",
            rear: "/dc/img/unknown.png"
        }
    },
    "juniper": {
        "srx4200": {
            name: "xs748t",
            unit: 1,
            front: "/dc/img/front/juniper srx4200.jpg",
            rear: "/dc/img/rear/juniper srx4200.jpg"
        }
    },
    "netgear": {
        "xs708t": {
            name: "xs708t",
            unit: 1,
            front: "/dc/img/front/netgear xs708t.png",
            rear: "/dc/img/rear/netgear xs708t.png"
        },
        "xs712t": {
            name: "xs712t",
            unit: 1,
            front: "/dc/img/front/netgear xs712t.png",
            rear: "/dc/img/rear/netgear xs712t.png"
        },
        "xs716t": {
            name: "xs716t",
            unit: 1,
            front: "/dc/img/front/netgear xs716t.png",
            rear: "/dc/img/rear/netgear xs716t.png"
        },
        "xs728t": {
            name: "xs728t",
            unit: 1,
            front: "/dc/img/front/netgear xs728t.jpg",
            rear: "/dc/img/rear/netgear xs728t.jpg"
        },
        "xs748t": {
            name: "xs748t",
            unit: 1,
            front: "/dc/img/front/netgear xs748t.png",
            rear: "/dc/img/rear/netgear xs748t.png"
        }
    },
    "paloalto": {
        "pa3040": {
            name: "pa3040",
            unit: 2,
            front: "/dc/img/front/paloalto pa3060.png",
            rear: "/dc/img/rear/paloalto pa3060.png"
        },
        "pa4020": {
            name: "pa4020",
            unit: 2,
            front: "/dc/img/front/paloalto pa4020.png",
            rear: "/dc/img/rear/paloalto pa3060.png"
        },
        "pa5050": {
            name: "pa5050",
            unit: 2,
            front: "/dc/img/front/paloalto pa5050.png",
            rear: "/dc/img/rear/paloalto pa5050.png"
        }
    },
    "pentasecurity": {
        "wapples 5200": {
            name: "wapples 5200",
            unit: 2,
            front: "/dc/img/front/pentasecurity wapples 5200.png",
            rear: "/dc/img/rear/828642a.jpg"
        }
    },
    "piolink": {
        "pas k1716": {
            name: "pas k1716",
            unit: 1,
            front: "/dc/img/front/piolink pas k1716.png",
            rear: "/dc/img/unknown.png"
        },
        "pas 10000": {
            name: "pas 10000",
            unit: 2,
            front: "/dc/img/front/piolink pas 10000.png",
            rear: "/dc/img/unknown.png"
        }
    },
    "ruckus": {
        "icx 7150": {
            name: "icx 7150",
            unit: 1,
            front: "/dc/img/front/ruckus icx 7150.png",
            rear: "/dc/img/rear/ruckus icx 7150.png",
        }
    },
    "secui": {
        "bluemax ngf": {
            name: "bluemax ngf",
            unit: 2,
            front: "/dc/img/front/secui bluemax ngf.png",
            rear: "/dc/img/unknown.png"
        },
        "mfi 4100": {
            name: "mfi 4100",
            unit: 2,
            front: "/dc/img/front/secui mfi 4100.png",
            rear: "/dc/img/rear/secui mf2 6000.png"
        },
        "mf2 6000": {
            name: "mf2 6000",
            unit: 2,
            front: "/dc/img/front/secui mf2 6000.png",
            rear: "/dc/img/rear/secui mf2 6000.png"
        }
    },
    "supermicro": {
        "superserver 1029p-wtr": {
            name: "superserver 1029p-wtr",
            unit: 1,
            front: "/dc/img/front/supermicro superserver 1029p-wtr.png",
            rear: "/dc/img/rear/supermicro superserver 1029p-wtr.png"
        }
    },
    "ubiquiti": {
        "es-48-lite": {
            name: "axgate-40d",
            unit: 1,
            front: "/dc/img/front/ubiquiti es-48-lite.jpg",
            rear: "/dc/img/rear/ubiquiti es-48-lite.jpg"
        }
    },
    "uside": {
        "ddx-tap 1000": {
            name: "ddx-tap 1000",
            unit: 1,
            front: "/dc/img/front/uside ddx-tap 1000.png",
            rear: "/dc/img/unknown.png"
        }
    },
    "watchguard": {
        "xtm 870": {
            name: "xtm 870",
            unit: 1,
            front: "/dc/img/front/watchguard xtm 870.png",
            rear: "/dc/img/unknown.png"
        },
        "xtm 2050": {
            name: "xtm 2050",
            unit: 2,
            front: "/dc/img/front/watchguard xtm 2050.png",
            rear: "/dc/img/rear/watchguard xtm 1050.png"
        }
    },
    "genians":{
        "c30": {
            name: "c30",
            unit: 2,
            front: "/dc/img/front/genians c30.png",
            rear: "/dc/img/unknown.png"
        },
        "s20h": {
            name: "s20h",
            unit: 1,
            front: "/dc/img/front/genians s20h.png",
            rear: "/dc/img/unknown.png"
        }
    },
    "handreamnet": {
        "vipm": {
            name: "vipm",
            unit: 1,
            front: "/dc/img/front/handreamnet vipm.png",
            rear: "/dc/img/unknown.png"
        }
    }
};