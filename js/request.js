;"use strict";

function Request() {
    this.agent = window.localStorage.getItem("agent");
    this.session = window.localStorage.getItem("session");
}

{
    const
        signIn = JSON.stringify({
            command: "order",
            target:"signin"
        }),
        echo =  JSON.stringify({
            command: "order",
            target: "echo"
        }),
        listener = {
            command: "listen"
        },
        TIMEOUT = 5000,
        INTERVAL = 10000;

    let sendEcho;

    Request.prototype = {
        reset: function () {
            window.localStorage.removeItem("agent");

            this.agent = undefined;
        },
        // if !agent return false
        // if session 200
        // if !session 400
        // else fail
        try: function (callback) {
            if (!this.agent) {
                return false;
            }
            
            const xhr = new XMLHttpRequest();

            xhr.open("POST", `${this.agent}request`, true);
            xhr.withCredentials = true;

            if (this.session) {
                xhr.setRequestHeader("Session", this.session);
            }

            xhr.onloadend = callback;
            
            xhr.send(signIn);

            return true;
        },
        // if session 200
        // if !session 400, 401
        // else fail
        connect: function (agent, callback) {
            const xhr = new XMLHttpRequest();

            xhr.open("POST", `${agent}/request`, true);
            xhr.withCredentials = true;
            xhr.timeout = TIMEOUT;

            if (this.session) {
                xhr.setRequestHeader("Session", this.session);
            }

            xhr.onloadend = e => {
                switch (xhr.status) {
                case 200:
                case 400:
                case 401:
                    this.agent = agent;

                    window.localStorage.setItem("agent", agent);
                }

                callback.call(xhr);
            }

            xhr.send(signIn);
        },
        // if !agent return false
        // if session 200
        // if !sesssion 401
        // else fail
        signIn: function (id, password, callback) {
            if (!this.agent) {
                return false;
            }

            const xhr = new XMLHttpRequest();

            xhr.open("POST", `${this.agent}request`, true);
            xhr.withCredentials = true;
            xhr.timeout = TIMEOUT;

            xhr.onloadend = e => {
                switch (xhr.status) {
                case 200:
                    const session = xhr.getResponseHeader("Set-Session");

                    if (session) {
                        this.session = session;

                        window.localStorage.setItem("session", session);
                    }
                }

                callback.call(xhr);
            }

            xhr.send(JSON.stringify({
                command: "order",
                target: "signin",
                id: id,
                password: password
            }));

            return true;
        },
        // if !agent || !sesssion return false
        // else fail
        execute: function (request, callback) {
            if (!this.agent || !this.session) {
                return false;
            }

            const xhr = new XMLHttpRequest();
                
            xhr.open("POST", `${this.agent}request`, true);
            xhr.withCredentials = true;

            xhr.setRequestHeader("Session", this.session);
            xhr.onloadend = callback;

            xhr.send(JSON.stringify(request));

            return true;
        },
        query: function (request) {
            return new Promise ((resolve, reject) => {
                this.execute(request, function (e) {
                    switch(this.status) {
                    case 200:
                        try {
                            resolve(JSON.parse(this.responseText));
        
                            break;
                        } catch {}
                    case 204:
                        resolve();
        
                        break;
                    default:
                        reject(this);
                    }
                });
            });
        },
        listen: function (callback) {
            if (!this.agent || !this.session) {
                return false;
            }

            const xhr = new XMLHttpRequest();
                
            xhr.open("POST", `${this.agent}request`, true);
            xhr.withCredentials = true;

            xhr.setRequestHeader("Session", this.session);

            xhr.onloadend = e => {
                if (xhr.status === 200) {
                    const event = JSON.parse(xhr.responseText);

                    callback(event);
                    
                    listener.id = event.id +1;

                    this.listen(callback);
                } else {
                    callback(null, xhr.status);
                }
            };
            
            xhr.send(JSON.stringify(listener));

            return true;
        },
        echo: function (callback) {
            if (!this.agent || !this.session) {
                return false;
            }

            const xhr = new XMLHttpRequest();
                
            xhr.open("POST", `${this.agent}request`, true);
            xhr.withCredentials = true;

            xhr.setRequestHeader("Session", this.session);
            
            xhr.onloadend = e => {
                callback(xhr.status, new Date().getTime() - sendEcho);

                setTimeout(this.echo.bind(this), INTERVAL, callback);
            };

            sendEcho = new Date().getTime();

            try {
                xhr.send(echo);
            } catch (e) {}

            return true;
        },
        download: function (request) {
            const xhr = new XMLHttpRequest();
                
            xhr.open("POST", `${this.agent}request`, true);
            xhr.withCredentials = true;
            xhr.responseType = "blob";
    
            xhr.setRequestHeader("Session", this.session);
            
            return new Promise ((resolve, reject) => {
                xhr.onloadend = function (e) {
                    if (xhr.status == 200) {
                        const
                            a = document.createElement("a"),
                            event = new MouseEvent("click");
                        
                        a.setAttribute("download", request.name);
                        a.setAttribute("href", URL.createObjectURL(new Blob([xhr.response] ,{})));
                        
                        a.dispatchEvent(event);

                        resolve();
                    } else {
                        reject(this);
                    }
                };

                xhr.send(JSON.stringify(request));
            });
        }
    };
}