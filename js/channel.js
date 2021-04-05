; "use strict";

function Channel() {
}

{
    const event = new BroadcastChannel("bc_event");

    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }


    Channel.getAccount = function(callback) {
        const
            channel = new BroadcastChannel("bc_root"),
            uuid = uuidv4(),
            tmp = new BroadcastChannel(uuid);

        tmp.onmessage = e => {
            callback(e.data);

            tmp.close();
        };

        channel.postMessage({
            command: "get",
            target: "account",
            channel: uuid
        });
    }

    Channel.create = uuidv4;

    Channel.sendEvent = e => event.postMessage(e);

    Channel.listen = callback =>
        (new BroadcastChannel("bc_event").onmessage = callback);
}
