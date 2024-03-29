;"use strict";

/**
 * @namespace
 */
var ITAhM = ITAhM || {};

ITAhM.snmp = {
    oid: {
        axgate: {
            hrProcessorLoad: "1.3.6.1.4.1.37288.1.1.3.1.1",
            powerStatus: "1.3.6.1.4.1.37288.1.1.5.1.2",
            temperature: "1.3.6.1.4.1.37288.1.1.5.2.2",
            fanStatus: "1.3.6.1.4.1.37288.1.1.5.3.2",
        },
        cisco: {
            ciscoEnvMonFanState: "1.3.6.1.4.1.9.9.13.1.4.1.3",
            ciscoEnvmonSupplyState: "1.3.6.1.4.1.9.9.13.1.5.1.3",
            cpmCPUTotal5secRev: "1.3.6.1.4.1.9.9.109.1.1.1.1.6",
            ciscoEnvmonTemperatureStatusValue: "1.3.6.1.4.1.9.9.13.1.3.1.3"
        },
        corebrg: {
            bandwidth: "1.3.6.1.4.1.49447.3.5",
            responseTime: "1.3.6.1.4.1.49447.1.1",
            max: "1.3.6.1.4.1.49447.2",
            limit: "1.3.6.1.4.1.49447.3",
            match: "1.3.6.1.4.1.49447.4"
        },
        dasan: {
            dsCpuLoad5s: "1.3.6.1.4.1.6296.9.1.1.1.8"
        },
        juniper: {
            jnxOperatingStateFan: "1.3.6.1.4.1.2636.3.1.13.1.6.4",
            jnxOperatingTemp: "1.3.6.1.4.1.2636.3.1.13.1.7",
            jnxOperatingPower:"1.3.6.1.4.1.2636.3.1.13.1.6.2"
        },
        piolink: {
            CoreTemperature: "1.3.6.1.4.1.10188.5.6.1.1.1.2",
            hFANStatus:"1.3.6.1.4.1.10188.5.6.1.3.1.3",
            hPowerStatus: "1.3.6.1.4.1.10188.5.6.1.2.1.3"
        },
        fortinet: {
            fgProcessorUsage5sec: "1.3.6.1.4.1.12356.101.4.4.2.1.3",
            fgSysMemUsage: "1.3.6.1.4.1.12356.101.4.1.4"
        },
        hrSystemUptime: "1.3.6.1.2.1.25.1.1",
        hrStorageType: "1.3.6.1.2.1.25.2.3.1.2",
        hrStorageDescr: "1.3.6.1.2.1.25.2.3.1.3",
        hrStorageAllocationUnits: "1.3.6.1.2.1.25.2.3.1.4",
        hrStorageFixedDisk: "1.3.6.1.2.1.25.2.1.4",
        hrStorageRam: "1.3.6.1.2.1.25.2.1.2",
        hrStorageSize: "1.3.6.1.2.1.25.2.3.1.5",
        hrStorageUsed: "1.3.6.1.2.1.25.2.3.1.6",
        hrProcessorLoad: "1.3.6.1.2.1.25.3.3.1.2",
        ifDescr: "1.3.6.1.2.1.2.2.1.2",
        ifType: "1.3.6.1.2.1.2.2.1.3",
        ifSpeed: "1.3.6.1.2.1.2.2.1.5",
        ifPhysAddress: "1.3.6.1.2.1.2.2.1.6",
        ifAdminStatus: "1.3.6.1.2.1.2.2.1.7",
        ifOperStatus: "1.3.6.1.2.1.2.2.1.8",
        ifInOctets: "1.3.6.1.2.1.2.2.1.10",
        ifInErrors: "1.3.6.1.2.1.2.2.1.14",
        ifOutOctets: "1.3.6.1.2.1.2.2.1.16",
        ifOutErrors: "1.3.6.1.2.1.2.2.1.20",
        ipNetToMediaPhysAddress: "1.3.6.1.2.1.4.22.1.2",
        ipNetToMediaType: "1.3.6.1.2.1.4.22.1.4",
        ifName: "1.3.6.1.2.1.31.1.1.1.1",
        ifHCInOctets: "1.3.6.1.2.1.31.1.1.1.6",
        ifHCOutOctets: "1.3.6.1.2.1.31.1.1.1.10",
        ifHighSpeed: "1.3.6.1.2.1.31.1.1.1.15",
        ifAlias: "1.3.6.1.2.1.31.1.1.1.18",
        sysDescr: "1.3.6.1.2.1.1.1",
        sysObjectID: "1.3.6.1.2.1.1.2",
        sysUpTime: "1.3.6.1.2.1.1.3",
        sysName: "1.3.6.1.2.1.1.5"
    },
    enterprise: {
        2: {
            name: "IBM"
        },
        9: {
            name: "ciscoSystems",
            logo: "/img/enterprise/cisco.png"
        },
        11: {
            name: "Hewlett-Packard",
            logo: "/img/enterprise/hewlettpackard.gif"
        },
        311: {
            name: "Microsoft",
            logo: "/img/enterprise/microsoft.png"
        },
        318: {
            name: "American Power Conversion Corp.",
            logo: "/img/enterprise/apc.svg"
        },
        368: {
            name: "Axis Communications AB"
        },
        789: {
            name: "Network Appliance Corporation"
        },
        1411: {
            name: "Juniper Networks/Funk Software",
            logo: "/img/enterprise/juniper.svg"
        },
        2142: {
            name: "Future Systems, Inc."
        },
        2636: {
            name: "Juniper Networks, Inc.",
            logo: "/img/enterprise/juniper.svg"
        },
        3417: {
            name: "CacheFlow Inc."
        },
        6296: {
            name: "DASAN Co.,LTD."
        },
        8072: {
            name: "net-snmp",
            logo: "/img/enterprise/net-snmp.jpg"
        },
        10188: {
            name: "Piolink, Inc",
            logo: "/img/enterprise/piolink.png"
        },
        12356: {
            name: "Fortinet, Inc.",
            logo: "/img/enterprise/fortinet.svg"
        },
        12532: {
            name: "Neoteris, Inc.",
            logo: "/img/enterprise/pulsesecure.svg"
        },
        18334: {
            name: "KONICA MINOLTA HOLDINGS, INC.",
            logo: "/img/enterprise/konicaminolta.png"
        },
        21726: {
            name: "HappyComm"
        },
        24681: {
            name: "QNAP Systems, Inc.",
            logo: "/img/enterprise/qnap.svg"
        },
        37288: {
            name: "AXGATE CO., LTD",
            logo: "/img/enterprise/axgate2.png"
        },
        55062: {
            name: "QNAP Systems, Inc.",
            logo: "/img/enterprise/qnap.svg"
        }
    },
    ifAdminStatus: {
        1: "up",
        2: "down",
        3: "testing"
    },
    ifOperStatus: {
        1: "up",
        2: "down",
        3: "testing",
        4: "unknown",
        5: "dormant",
        6: "notPresent",
        7: "lowerLayerDown"
    },
    hrStorageType: {
        1: "hrStorageOther",
        2: "hrStorageRam",
        3: "hrStorageVirtualMemory",
        4: "hrStorageFixedDisk",
        5: "hrStorageRemovableDisk",
        6: "hrStorageFloppyDisk",
        7: "hrStorageCompactDisc ",
        8: "hrStorageRamDisk",
        9: "hrStorageFlashMemory",
        10: "hrStorageNetworkDisk"
    },
    ifType: {
        1: "other",
        2: "regular1822",
        3: "hdh1822",
        4: "ddnX25",
        5: "rfc877x25",
        6: "ethernetCsmacd",
        7: "iso88023Csmacd",
        8: "iso88024TokenBus",
        9: "iso88025TokenRin",
        10: "iso88026Man",
        11: "starLan",
        12: "proteon10Mbit",
        13: "proteon80Mbit",
        14: "hyperchannel",
        15: "fddi",
        16: "lapb",
        17: "sdlc",
        18: "ds1",
        19: "e1",
        20: "basicISDN",
        21: "primaryISDN",
        22: "propPointToPointSerial",
        23: "ppp",
        24: "softwareLoopback",
        25: "eon",
        26: "ethernet3Mbit",
        27: "nsip",
        28: "slip",
        29: "ultra",
        30: "ds3",
        31: "sip",
        32: "frameRelay",
        33: "rs232",
        34: "para",
        35: "arcnet",
        36: "arcnetPlus",
        37: "atm",
        38: "miox25",
        39: "sonet",
        40: "x25ple",
        41: "iso88022llc",
        42: "localTalk",
        43: "smdsDxi",
        44: "frameRelayService",
        45: "v35",
        46: "hssi",
        47: "hippi",
        48: "modem",
        49: "aal5",
        50: "sonetPath",
        51: "sonetVT",
        52: "smdsIcip",
        53: "propVirtual",
        54: "propMultiplexor",
        55: "ieee80212",
        56: "fibreChannel",
        57: "hippiInterface",
        58: "frameRelayInterconnect",
        59: "aflane8023",
        60: "aflane8025",
        61: "cctEmul",
        62: "fastEther",
        63: "isdn",
        64: "v11",
        65: "v36",
        66: "g703at64k",
        67: "g703at2mb",
        68: "qllc",
        69: "fastEtherFX",
        70: "channel",
        71: "ieee80211",
        72: "ibm370parChan",
        73: "escon",
        74: "dlsw",
        75: "isdns",
        76: "isdnu",
        77: "lapd",
        78: "ipSwitch",
        79: "rsrb",
        80: "atmLogical",
        81: "ds0",
        82: "ds0Bundle",
        83: "bsc",
        84: "async",
        85: "cnr",
        86: "iso88025Dtr",
        87: "eplrs",
        88: "arap",
        89: "propCnls",
        90: "hostPad",
        91: "termPad",
        92: "frameRelayMPI",
        93: "x213",
        94: "adsl",
        95: "radsl",
        96: "sdsl",
        97: "vdsl",
        98: "iso88025CRFPInt",
        99: "myrinet",
        100: "voiceEM",
        101: "voiceFXO",
        102: "voiceFXS",
        103: "voiceEncap",
        104: "voiceOverIp",
        105: "atmDxi",
        106: "atmFuni",
        107: "atmIma",
        108: "pppMultilinkBundl",
        109: "ipOverCdlc",
        110: "ipOverClaw",
        111: "stackToStack",
        112: "virtualIpAddress",
        113: "mpc",
        114: "ipOverAtm",
        115: "iso88025Fiber",
        116: "tdlc",
        117: "gigabitEthernet",
        118: "hdlc",
        119: "lapf",
        120: "v37",
        121: "x25mlp",
        122: "x25huntGroup",
        123: "trasnpHdlc",
        124: "interleave",
        125: "fast",
        126: "ip",
        127: "docsCableMaclayer",
        128: "docsCableDownstream",
        129: "docsCableUpstream",
        130: "a12MppSwitch",
        131: "tunnel",
        132: "coffee",
        133: "ces",
        134: "atmSubInterface",
        135: "l2vlan",
        136: "l3ipvlan",
        137: "l3ipxvlan",
        138: "digitalPowerline",
        139: "mediaMailOverIp",
        140: "dtm",
        141: "dcn",
        142: "ipForward",
        143: "msdsl",
        144: "ieee1394",
        145: "if-gsn",
        146: "dvbRccMacLayer",
        147: "dvbRccDownstream",
        148: "dvbRccUpstream",
        149: "atmVirtual",
        150: "mplsTunnel",
        151: "srp",
        152: "voiceOverAtm",
        153: "voiceOverFrameRelay",
        154: "idsl",
        155: "compositeLink",
        156: "ss7SigLink",
        157: "propWirelessP2P",
        158: "frForward",
        159: "rfc1483",
        160: "usb",
        161: "ieee8023adLag",
        162: "bgppolicyaccounting",
        163: "frf16MfrBundle",
        164: "h323Gatekeeper",
        165: "h323Proxy",
        166: "mpls",
        167: "mfSigLink",
        168: "hdsl2",
        169: "shdsl",
        170: "ds1FDL",
        171: "pos",
        172: "dvbAsiIn",
        173: "dvbAsiOut",
        174: "plc",
        175: "nfas",
        176: "tr008",
        177: "gr303RDT",
        178: "gr303IDT",
        179: "isup",
        180: "propDocsWirelessMaclayer",
        181: "propDocsWirelessDownstream",
        182: "propDocsWirelessUpstream",
        183: "hiperlan2",
        184: "propBWAp2Mp",
        185: "sonetOverheadChannel",
        186: "digitalWrapperOverheadChannel",
        187: "aal2",
        188: "radioMAC",
        189: "atmRadio",
        190: "imt",
        191: "mvl",
        192: "reachDSL",
        193: "frDlciEndPt",
        194: "atmVciEndPt",
        195: "opticalChannel",
        196: "opticalTransport",
        197: "propAtm",
        198: "voiceOverCable",
        199: "infiniband",
        200: "teLink",
        201: "q2931",
        202: "virtualTg",
        203: "sipTg",
        204: "sipSig",
        205: "docsCableUpstreamChannel",
        206: "econet",
        207: "pon155",
        208: "pon622",
        209: "bridge",
        210: "linegroup",
        211: "voiceEMFGD",
        212: "voiceFGDEANA",
        213: "voiceDID",
        214: "mpegTransport",
        215: "sixToFour",
        216: "gtp",
        217: "pdnEtherLoop1",
        218: "pdnEtherLoop2",
        219: "opticalChannelGroup",
        220: "homepna",
        221: "gfp",
        222: "ciscoISLvlan",
        223: "actelisMetaLOOP",
        224: "fcipLink",
        225: "rpr: ",
        226: "qam",
        227: "lmp",
        228: "cblVectaStar",
        229: "docsCableMCmtsDownstream",
        230: "adsl2",
        231: "macSecControlledIF",
        232: "macSecUncontrolledIF",
        233: "aviciOpticalEther",
        234: "atmbond",
        235: "voiceFGDOS",
        236: "mocaVersion1",
        237: "ieee80216WMAN",
        238: "adsl2plus",
        239: "dvbRcsMacLayer",
        240: "dvbTdm",
        241: "dvbRcsTdma"
    }
};

{
    const map = new Map();

    function parseOID(value, key) {
        if (typeof value === typeof "") {
            map.set(value, key);
        } else if (typeof value === typeof {}) {
			for (let key in value) {
				parseOID(value[key], key);
			}
        }
    }

    parseOID(ITAhM.snmp.oid);

    window.getNameOfOID = oid => map.get(oid);
}
