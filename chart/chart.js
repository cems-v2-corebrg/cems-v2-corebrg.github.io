"use strict";

function SummaryData() {
    this.initialize(arguments);
}

function ChartData() {
    this.initialize(arguments);
}

{
    SummaryData.prototype = {
        initialize: function(args) {
            this.data = args[0];
            this.unit = args[1] || 1;
        },
        parse: function (from, to) {
            var resultKeyArray = [],
                blockKeyArrary = [],
                date = new Date(from),
                mills = date.setMinutes(0, 0, 0),
                value, high, low, max = [], min = [];
            
            do {
                value = this.data[String(mills)];
                
                if (value) {
                    blockKeyArrary.push(mills);
                    
                    max.push(value.max);
                    min.push(value.min);
                }
                else if (blockKeyArrary.length > 0){
                    resultKeyArray.push(blockKeyArrary);
                    
                    blockKeyArrary = [];
                }

                mills = date.setHours(date.getHours() +1);
            } while (mills < to);
            
            if (blockKeyArrary.length > 0) {
                resultKeyArray.push(blockKeyArrary);
            }
            
            high = max.length > 0? max.reduce((a, b) => a>b? a: b): 0;
            low = min.length > 0? min.reduce((a, b) => a>b? b: a): 0;
            
            if (high === low) {
                high++;
                low--;
            }
            
            return resultKeyArray.length > 0? {
                high: high * this.unit,
                low: low * this.unit,
                keys: resultKeyArray
            }: undefined;
        },
        get: function (millis) {
            const value = this.data[String(millis)];

            return value? {
                max: value.max * this.unit,
                avg: value.avg * this.unit,
                min: value.min * this.unit
            }: undefined;
        },
        download: function (from, to, fileName) {
            const rows = [];
            let i = 1;

            rows.push("Index,Date,Max,Avg,Min");

            const summaryData = this.parse(from, to);

            if (summaryData) {
                summaryData.keys.forEach(keys => keys.forEach(timestamp => {
                    const value = this.get(timestamp);
                    
                    rows.push([i++, toDateTimeString(timestamp), toString(value.max * this.unit), toString(value.avg * this.unit), toString(value.min * this.unit)].join(","));
                }));
            }

            download(new Blob([rows.join("\n")] ,{
                type: "text/csv;charset=utf-8;"
            }), fileName);
        }
    };

    ChartData.prototype = {
        initialize: function(args) {
            this.timestampToValue = args[0];
            this.timestampArray = Object.keys(this.timestampToValue)
                .sort((a, b) => Number(a) - Number(b));
            this.unit = args[1] || 1;
        },
        forEach: function (f) {
            this.timestampArray
                .forEach(timestamp => f(Number(timestamp), (({max, avg, min}) => ({max: max * this.unit, avg: avg * this.unit, min: min * this.unit}))(this.timestampToValue[timestamp])));
        },
        download: function (fileName) {
            const rows = [];
            let i = 1;

            rows.push("Index,Date,Max,Avg,Min");

            this.forEach((timestamp, value) => {
                rows.push([i++, toDateTimeString(timestamp), toString(value.max * this.unit), toString(value.avg * this.unit), toString(value.min * this.unit)].join(","));
            });

            download(new Blob([rows.join("\n")] ,{
                type: "text/csv;charset=utf-8;"
            }), fileName);
        }
    };

    function download(blob, fileName) {
        const a = document.createElement("a");
    
        a.setAttribute("download", fileName);
        a.setAttribute("href", URL.createObjectURL(blob));
    
        a.dispatchEvent(new MouseEvent("click"));
    }
}

function showMessage(xhr) {
    if (xhr instanceof XMLHttpRequest) {
        switch (xhr.status) {
        case 401:
            alert(NOTICE_SESS_EXPIRE["kr"]);

            break;
        default:
            alert(ERROR_RES_CODE(xhr.status)["kr"]);
        }

        try {
            console.log(JSON.parse(xhr.responseText).error);
        } catch (e) {}
    } else if (xhr instanceof Error) {
        console.error(xhr);
    } else {
        console.trace(xhr);
    }
}

function toDateTimeString(millis) {
    var
        date = new Date(millis),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day  = date.getDate(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    
    return year +"-"+ (month > 9? "": "0") + month +"-"+ (day > 9? "": "0") + day +" "
        + (h > 9? "": "0") + h +":"+ (m > 9? "": "0") + m +":"+ (s > 9? "": "0") + s;
}

{
    const
        INTERVAL = 5000,
        search = new URLSearchParams(window.location.search),
        request =  new Request(),
        max = Number(search.get("max")),
        unit = Number(search.get("unit")) || 1,
        query = {
            command: "get",
            target: "resource",
            from: Number(search.get("from")),
            to: Number(search.get("to"))
        };
    let
        summaryData, detailData;

    if (top.account.level == 0) {
        document.body.classList.add("root");
    }

    document.getElementById("max") && (document.getElementById("max").textContent = max && toString(max)|| "");

    document.getElementById("chart").onload = function (e) {
        this.contentWindow.initialize({
            summary: summaryData,
            from: query.from,
            to: query.to,
            max: max,
            toString: toString
        });
    };

    document.getElementById("realtime").onload = function (e) {
        if (this.contentWindow.location.protocol === "http:") {
    
            this.contentWindow.initialize({
                toString: toString,
                fileName: `${window.document.title}_REALTIME.csv`
            });
    
            postRealtimeRequest();

            document.querySelector("dialog").showModal();
        } else {
            document.querySelector("dialog").close();
        }
    };

    function postRealtimeRequest () {
        request.query({
            command: "get",
            target: "resource",
            id: query.id,
            oid: query.oid,
            index: query.index
        }).then(value => {
            const valueArray = [];

            // ProcessorLoad 와 같이 index를 특정할 수 없는 경우 때문에
            for (let index in value) {
                valueArray.push(Number(value[index]) * unit);
            }

            try {
                document.getElementById("realtime").contentWindow.update(valueArray.reduce((a, b) => a + b) / valueArray.length);

                window.setTimeout(postRealtimeRequest, INTERVAL);
            } catch (e) {/*closed*/}
        })
        .catch(showMessage);
    }
    
    document.querySelector("form").onsubmit = function (e) {
        e.preventDefault();

        const limit = Number(this.elements["limit"].value);

        document.body.classList.add("loading");

        request.query({
            command: "set",
            target: "critical",
            critical: {
                id: query.id,
                index: query.index,
                oid: query.oid,
                limit: max? Math.round(limit * max / unit /100): limit / unit
            }
        })
        .then(() => {
            this.elements["limit"].classList.add("critical");

            alert("Information.\n\n임계를 설정 했습니다.");
            
            document.body.classList.remove("loading");
        })
        .catch(showMessage);
    };

    document.querySelector("form").onreset = function (e) {
        e.preventDefault();

        document.body.classList.add("loading");

        request.query({
            command: "remove",
            target: "critical",
            critical: {
                id: query.id,
                index: query.index,
                oid: query.oid
            }
        })
        .then(() => {
            const input = this.elements["limit"];

            input.value = "";
            input.classList.remove("critical");

            alert("Information.\n\n임계를 해제 했습니다.");

            document.body.classList.remove("loading");
        })
        .catch(showMessage);
    };

    var initialize = function (oid, index) {
        const title = search.get("title");

        title && (document.getElementById("title").textContent = title);

        query.id = Number(search.get("id"));
        query.oid = oid;
        query.index = index;

        request.query({
            command: "get",
            target: "critical",
            critical: {
                id: query.id,
                oid: oid,
                index: index
            }
        })
        .then(critical => {
            if (critical) {
                const input = document.body.querySelector("[name=limit]");

                input.value = Math.round(max? critical.limit * unit *100 / max: critical.limit * unit);
                
                input.classList.add("critical");
            }
            
            return request.query(query);
        })
        .then(resourceData => {
            resourceData = resourceData || {};

            summaryData = new SummaryData(resourceData, unit);
        
            parent.preview(resourceData);
        
            document.body.classList.remove("loading");
        
            document.getElementById("chart").src = "/chart/base.html";
        })
        .catch(showMessage);
    };

    var draw = function (from, to) {
        query.from = from;
        query.to = to;

        detailData = undefined;

        document.getElementById("chart").contentWindow.location.reload();
    };

    var detail = function () {
        const date = new Date(query.from);
    
        if (date.setDate(date.getDate() +1) == query.to) {
            document.body.classList.add("loading");
    
            query.date = query.from;
            
            request.query(query)
            .then(resourceData => {
                detailData = new ChartData(resourceData || {}, unit);

                document.getElementById("chart").contentWindow.draw(detailData);
    
                document.body.classList.remove("loading");
            })
            .catch(showMessage);
        }
    };

    var download = function () {
        if (detailData) {
            detailData.download(`${window.document.title}.csv`);
        } else {
            summaryData.download(query.from, query.to, `${window.document.title}.csv`);
        }
    };

    var realtime = function (realtime) {
        document.getElementById("realtime").contentWindow.location.replace(realtime? "/chart/realtime.html": "about:blank");
    }
}