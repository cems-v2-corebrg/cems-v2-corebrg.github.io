"use strict";

{
    const
        svg = document.getElementById("svg"),
        container = document.getElementById("container"),
        copy = document.querySelector("defs>g"),
        map = {};
    let
        selected,
        dragOrigin,
        selectedOrigin,
        scale = 5;

    window.onResize = function (e) {
        const rect = svg.getBoundingClientRect();
        
        container.transform.baseVal.getItem(0).setTranslate(rect.width /2, rect.height /2);
    };

    function onScale(e) {
        e.deltaY < 0? scale *= 1.1: scale /= 1.1;

        container.transform.baseVal.getItem(1).setScale(scale, scale);
    }

    function onCancel(e) {
        if (selected) {
            selected.classList.remove("selected");
        }

        selected = undefined;

        document.body.classList.remove("grid");
    }

    function onSelect(e) {
        e.stopPropagation();

        if (selected) {
            selected.classList.remove("selected");
        }

        selected = this;
        
        container.appendChild(this);

        document.body.classList.add("grid");

        selected.classList.add("selected");
    }

    function onDragStart(e) {
        if (selected && e.target.parentNode === selected) {
            dragOrigin = {
                x: e.clientX,
                y: e.clientY
            };
        }
    }

    function onDragMove(e) {
        if (dragOrigin) {
            const
                pos = map[selected.dataset.id],
                x = Math.round((e.clientX - dragOrigin.x) /scale /1) *1 + pos.x,
                y = Math.round((e.clientY - dragOrigin.y) /scale /1) *1 + pos.y;

            selected.setAttribute("transform", `translate(${x},${y})`);
        }
    }

    function onDragEnd(e) {
        if (dragOrigin) {
            const pos = map[selected.dataset.id];

            pos.x += Math.round((e.clientX - dragOrigin.x) /scale /1) *1;
            pos.y += Math.round((e.clientY - dragOrigin.y) /scale /1) *1;

            dragOrigin = undefined;
        }
    }    

    function onMenu(e) {
        e.preventDefault();

        top.showDialog(`/dc/dialog/rack.html?rack=${this.dataset.id}`, this);
    }

    /**
     * @param {string} id
     **/
    window.addRack = function (id, rack) {
        const node = copy.cloneNode(true);
        
        node.setAttribute("transform", `translate(${rack.x},${rack.y})`);

        node.querySelector("text").textContent = rack.name;
        node.addEventListener("click", onSelect);
        node.addEventListener("contextmenu", onMenu);
        node.addEventListener("dragenter", e => {
            e.preventDefault();

            node.classList.add("over");
        });

        node.addEventListener("dragleave", e => {
            e.preventDefault();

            node.classList.remove("over");
        });

        node.addEventListener("dragover", e => {
            e.preventDefault();

            e.dataTransfer.dropEffect = "copy";

            return false;
        });
        
        node.addEventListener("drop", e => {
            e.stopPropagation();
        
            top.showDialog(`/dc/dialog/location.html?rack=${id}&device=${e.dataTransfer.getData("text")}`, this);

            node.classList.remove("over");
        });
        
        node.dataset.id = id;

        map[id] = node;

        container.appendChild(node);
    };

    svg.addEventListener("click", onCancel);
    svg.addEventListener("wheel", onScale);
    svg.addEventListener("mousedown", onDragStart);
    svg.addEventListener("mousemove", onDragMove);
    svg.addEventListener("mouseup", onDragEnd);

    window.addEventListener("resize", onResize);
}