; "use strict";

var com = com || {};

com.itahm = {};

com.itahm.InetAddress = function (array) {
    this.array = array;
}

com.itahm.InetAddress.getByName = function (host) {
    var array;

    array = host.split(".");

    if (array.length === 4) {
        if (!array.every(n => !isNaN(n) && (0 <= n && n <=255))) {
            return null;
        }
    }
    else {
        let i = host.indexOf(":");

        if (i === -1) {
            return null;
        }

        i = host.indexOf("::");

        if (i !== -1) {
            if (i !== host.lastIndexOf("::")) {
                return null;
            }

            let
                sep = "::";
                tmp = host.split(sep),
                len = tmp[0].split(":").length + tmp[1].split(":").length;

            if (len > 7) {
                return null;
            }

            for (; len < 7; len++) {
                sep += ":";
            }

            host = tmp.join(sep);
        }

        array = host.split(":").map(n => n && parseInt("0x"+ n, 16) || 0);
            
        if (!array.every(n => !isNaN(n) && (0 <= n && n <= 0xffff))) {
            return null;
        }
    }

    return new com.itahm.InetAddress(array);
};