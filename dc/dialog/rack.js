"use strict";

{
    const
        SCALE = 0.4,
        UNIT_SIZE = 44.5,
        form = document.getElementById("location");
    let rack, position, locationData;

    if (top.account.level == 0) {
        form.onsubmit = onSubmit;
        form.onreset = onReset;
    }
    
    function onSubmit(e) {
        e.preventDefault();
    
        document.body.classList.add("loading");
        
        $.request.execute({
            command: "set",
            target: "location",
            node: $.devID,
            location: {
                maker: this.elements["maker"].value,
                model: this.elements["model"].value,
                rack: $.id,
                position: Number(this.elements["position"].value)
            }
        }, function () {
            switch(this.status) {
            case 200:
                break;
            default:
                throw showMessage(this);
            }
    
            const search = new URLSearchParams();

            search.set("facility", $.id);
            
            window.location.search = search;
        });
    }
    
    function onReset(e) {
        e.preventDefault();
        if (!confirm("Confirm.\n\n장치를 Rack에서 분리하겠습니까?")) {
            return;
        }

        document.body.classList.add("loading");

        $.request.execute({
            command: "remove",
            target: "location",
            node: $.devID
        }, function () {
            switch(this.status) {
            case 200:
                break;
            default:
                throw showMessage(this);
            }

            const search = new URLSearchParams();

            search.set("facility", $.id);
            
            window.location.search = search;
        });
    }

    function selectMaker(maker) {
        const
            df = document.createDocumentFragment(),
            select = document.querySelector("select[name=model]"),
            map = modelData[maker];
        let option;
    
        [
            select,
            document.querySelector("select[name=position]")
        ].forEach(select => {
            for (let option; option = select.firstChild;) {
                select.removeChild(option);
            }
        });
        
        form.elements["position"].value = "";

        for (let model in map) {
            option = document.createElement("option");

            option.text = model;
            option.value = model;

            df.appendChild(option);
        }
    
        select.appendChild(df);
    
        select.selectedIndex = -1;
    
        select.onchange = function (e) {
            selectModel(maker, this.value);
        }
    }

    function selectModel(maker, model, pos) {
        const
            df = document.createDocumentFragment(),
            select = form.elements["position"],
            unit = 1;
        
            try {
            unit = modelData[maker][model].unit;
        } catch (e) {}
        
        form.elements["unit"].value = unit;
    
        position.forEach((id, i) =>{
            if (id && !pos) {
                return;
            }

            if (pos != i +1) {
                for (let j=0; j<unit; j++) {
                    if (position[j + i]) {
                        return;
                    }
                }
            }
            
            const option = document.createElement("option");

            option.text = i +1;
            option.value = i +1;

            df.appendChild(option);
        });

        select.appendChild(df);

        if (pos) {
            select.value = pos;
        } else {
            select.selectedIndex = -1;
        }
    }

    function setLocation (id) {
        const location = locationData[id];
        
        form.elements["name"].value = location.name || "";
        
        form.elements["maker"].value = location.maker;
        form.elements["maker"].disabled = false;

        selectMaker(location.maker);
        
        form.elements["model"].value = location.model;

        selectModel(location.maker, location.model, location.position);
        
        $.devID = id;

        form.classList.add("edit");
    }

    function onSelectDevice(e) {
        setLocation(this.dataset.id);
    }

    window.initRack = function (facility, data) {
        const
            size = document.querySelector("section.rack").style,
            df = document.createDocumentFragment();
        let location, next = 0, unit;

        rack = facility;
        position = Array(rack.unit).fill(null);
        locationData = data;

        size.width = `${rack.width * SCALE}px`;
        size.height = `${rack.height * SCALE}px`;

        for (let id in locationData) {
            location = locationData[id];
try {
    unit = modelData[location.maker][location.model].unit;
} catch (e) {
    unit = 1;
}
            for (let i=unit, j=location.position -1; i-->0;) {
                position[j + i] = id;
            }
        }

        position.forEach((id, i) => {
            if (i < next) {
                return;
            }

            const device = document.createElement("li");
            
            if (id) {
                const location = locationData[id];
                let model;
                try {
                    model = modelData[location.maker][location.model];
                } catch (e){
                    console.error(e);

                    model = {
                        unit: 1,
                        front: "/dc/img/unknown.png"
                    }
                };

                next = i + model.unit;

                device.dataset.id = id;
                
                device.onclick = onSelectDevice;
                
                device.style.height = `${UNIT_SIZE * SCALE * model.unit}px`;
                device.style.backgroundImage = `url("${model.front}")`;
            }

            device.dataset.position = i +1;

            df.insertBefore(device, df.firstChild);
        });

        document.querySelector("ul").appendChild(df);
    };

    {
        const
            df = document.createDocumentFragment(),
            select = document.querySelector("select[name=maker]");

        for (let maker in modelData) {
            df.appendChild(document.createElement("option")).text = maker;
        }
    
        select.appendChild(df);
    
        select.selectedIndex = -1;
    
        select.onchange = function (e) {
            selectMaker(this.value);
        }
    }
}