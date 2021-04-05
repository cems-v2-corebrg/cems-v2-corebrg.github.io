"use strict";

{
    const form = document.getElementById("facility");

    if (top.account.level == 0) {
        form.onsubmit = onSubmit;
        form.onreset = onReset;
    }

    form.elements["type"].onchange = function (e) {
        Array.from(this.options).forEach(option =>
            document.body.classList.remove(option.value)
        );
        
        document.body.classList.add(this.value);
    };

    function onReset (e) {
        e.preventDefault();
    
        if (!(confirm("Warning!\n\nRack에 거치된 장치 정보가 함께 삭제됩니다.\n계속 하겠습니까?"))) {
            return;
        }
    
        document.body.classList.add("loading");
    
        $.request.execute({
            command: "remove",
            target: "facility",
            id: $.id
        }, function () {
            switch(this.status) {
            case 200:    
                break;
            default:
                throw showMessage(this);
            }

            top.closeDialog(true);
        });
    };
    
    function onSubmit (e) {
        e.preventDefault();
    
        document.body.classList.add("loading");
        
        const request = {
                target: "facility",
                facility: {
                    name: this.elements["name"].value,
                    type: this.elements["type"].value,
                    width: Number(this.elements["width"].value),
                    height: Number(this.elements["height"].value),
                    depth: Number(this.elements["depth"].value),
                    rotate: Number(this.elements["rotate"].value),
                    unit: Number(this.elements["unit"].value),
                    image: this.elements["image"].value || ""
                }
            };
        
        if ($.id) {
            request.command = "set";
            request.id = $.id;
        } else {
            request.command = "add";
        }
    
        $.request.execute(request, function () {
            switch(this.status) {
            case 200:
                break;
            default:
                throw showMessage(this);
            }

            if ($.id) {
                top.resetParent();

                const search = new URLSearchParams();

                search.set("facility", $.id);
                
                window.location.search = search;
            } else {
                top.closeDialog(true);
            }
        });
    };
}