"use strict";

{
    const
        root = document.getElementById("svg"),
        container = document.getElementById("container"),
        selector = document.getElementById("selector"),
        copy = document.querySelector("defs>g.node"),
        greed = document.getElementById("grid"),
        helperX = greed.querySelector("div:first-of-type"),
        helperY = greed.querySelector("div:last-of-type"),
        gridX = greed.elements["x"],
        gridY = greed.elements["y"],
        gridZ = greed.elements["z"],
        transform = {
            resize: container.transform.baseVal.appendItem(root.createSVGTransform()),
            scale: container.transform.baseVal.appendItem(root.createSVGTransform()),
            translate: container.transform.baseVal.appendItem(root.createSVGTransform())
        },
        layerMap = {
            node: document.getElementById("node"),
            select: document.getElementById("select")
        },
        map = {};
    let
        scale = 0.1,
        positionData,
        selected,
        screen,
        mouseDown;

    function onResize(e) {
        screen = root.getBoundingClientRect();
        
        transform.resize.setTranslate(screen.width /2, screen.height /2);        
    }

    function onScale(e) {
        e.deltaY < 0? scale *= 1.1: scale /= 1.1;

        transform.scale.setScale(scale, scale);

        moveHelper();
    }

    function onMouseDown(e) {
        e.preventDefault();

        if (e.which !== 1) {
            return;
        }

        mouseDown = {
            origin: e.target,
            x: e.clientX,
            y: e.clientY,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey
        };
    }

    function onMouseMove(e) {
        e.preventDefault();

        if (!mouseDown) {
            return;
        }
        
        //DragStart
        if (!mouseDown.drag) {
            if (mouseDown.shiftKey || mouseDown.ctrlKey) {// DragStartSelector
                mouseDown.origin = this;

                const matrix = selector.transform.baseVal.getItem(0).matrix;
                
                matrix.e = mouseDown.x;
                matrix.f = mouseDown.y;
            } else if (mouseDown.origin !== this) {// DragStart
                const node = mouseDown.origin.parentNode;

                if (node.parentNode !== layerMap.select) {// DragStartNodeAll
                    mouseDown.origin = this;
                } else {// DragStartSelectAll
                }
            } else {// DragStartNodeAll
            }

            mouseDown.drag = true;
        }
        
        //DragMove
        if (mouseDown.origin === this) {
            if (mouseDown.shiftKey || mouseDown.ctrlKey) {//DragMoveSelecter
                const matrix = selector.transform.baseVal.getItem(0).matrix;
                
                matrix.a = e.clientX - mouseDown.x;
                matrix.d = e.clientY - mouseDown.y;
            } else {//DragMoveNodeAll
                transform.translate.setTranslate(Math.round((e.clientX - mouseDown.x) / scale), Math.round((e.clientY - mouseDown.y) / scale));

                moveHelper();
            }
        } else {// DragMoveSelectAll
            document.body.classList.add("drag");

            const
                x = Math.round((e.clientX - mouseDown.x) / scale),
                y = Math.round((e.clientY - mouseDown.y) / scale);

            [].forEach.call(layerMap.select.querySelectorAll("g"), node => {
                const matrix = node.transform.baseVal.getItem(1).matrix;

                matrix.e = x;
                matrix.f = y;
            });

            moveHelper();
        }
    }

    function onMouseUp(e) {
        e.preventDefault();

        if (e.which !== 1 || !mouseDown) {
            return;
        }

        //DragEnd
        if (mouseDown.drag) {
            if (mouseDown.origin === this) {
                if (mouseDown.shiftKey || mouseDown.ctrlKey) {// DragEndSelector
                    const matrix = selector.transform.baseVal.getItem(0).matrix;
                    let x1, y1, x2, y2;

                    x1 = (matrix.e - screen.width /2) /scale;
                    y1 = (matrix.f - screen.height /2) /scale;
            
                    if (matrix.a < 0) {
                        x2 = x1;
                        x1 = x1 + matrix.a / scale;
                    }
                    else {
                        x2 = x1 + matrix.a / scale;
                    }
                    
                    if (matrix.d < 0) {
                        y2 = y1;
                        y1 = y1 + matrix.d / scale;
                    }
                    else {
                        y2 = y1 + matrix.d / scale;
                    }

                    if (mouseDown.shiftKey) {
                        const layer = layerMap.select;

                        [].forEach.call(layerMap.node.querySelectorAll("g"), node => {
                            const matrix = node.transform.baseVal.getItem(0).matrix;

                            if (x1 <= matrix.e && x2 >= matrix.e && y1 <= matrix.f && y2 >= matrix.f) {
                                layer.appendChild(node);
                            }
                        });
                    } else {
                        const
                            df = document.createDocumentFragment(),
                            layer = layerMap.node;

                        [].forEach.call(layerMap.node.querySelectorAll("g"), node => {
                            const matrix = node.transform.baseVal.getItem(0).matrix;

                            if (x1 <= matrix.e && x2 >= matrix.e && y1 <= matrix.f && y2 >= matrix.f) {
                                df.appendChild(node);
                            }
                        });

                        [].forEach.call(layerMap.select.querySelectorAll("g"), node => {
                            const matrix = node.transform.baseVal.getItem(0).matrix;

                            if (x1 <= matrix.e && x2 >= matrix.e && y1 <= matrix.f && y2 >= matrix.f) {
                                layer.appendChild(node);
                            }
                        });

                        layerMap.select.appendChild(df);
                    }

                    matrix.a = 0;
                    matrix.d = 0;    
                } else {// DragEndNodeAll
                    const
                        matrix = transform.translate.matrix,
                        x = matrix.e,
                        y = matrix.f;

                    [layerMap.node, layerMap.select].forEach(layer => 
                        [].forEach.call(layer.querySelectorAll("g"), node => {
                            const
                                matrix = node.transform.baseVal.getItem(0).matrix,
                                pos = positionData[node.dataset.id];

                            pos.x = matrix.e += x;
                            pos.y = matrix.f += y;
                        }));

                    transform.translate.setTranslate(0, 0);
                }
            } else {// DragEndSelectAll
                [].forEach.call(layerMap.select.querySelectorAll("g"), node => {
                    const
                        transform = node.transform.baseVal,
                        matrix0 = transform.getItem(0).matrix,
                        matrix1 = transform.getItem(1).matrix,
                        pos = positionData[node.dataset.id];

                    pos.x = matrix0.e += matrix1.e;
                    pos.y = matrix0.f += matrix1.f;

                    matrix1.e = 0;
                    matrix1.f = 0;
                });

                document.body.classList.remove("drag");
            }
        // Click
        } else {
            if (mouseDown.origin === this) {// CancelNode
                [].forEach.call(layerMap.select.querySelectorAll("g"), node => layerMap.node.appendChild(node));

                if (selected) {
                    selected.classList.remove("selected");
                }
        
                selected = undefined;
        
                document.body.classList.remove("grid");
            } else { // Select
                const node = mouseDown.origin.parentNode;

                if (mouseDown.shiftKey) { // AddNode
                    layerMap.select.appendChild(node);
                } else if (mouseDown.ctrlKey) { // ToggleNode
                    if (node.parentNode === layerMap.node) {
                        layerMap.select.appendChild(node);
                    } else {
                        layerMap.node.appendChild(node);
                    }
                } else { // SelectNode
                    [].forEach.call(layerMap.select.querySelectorAll("g"), node => layerMap.node.appendChild(node));

                    e.stopPropagation();

                    if (selected) {
                        selected.classList.remove("selected");
                    }

                    selected = node;
                    
                    selected.classList.add("selected");

                    moveHelper();

                    document.body.classList.add("grid");

                    layerMap.select.appendChild(node);
                }
            }
        }

        mouseDown = undefined;
    }

    function onMenu(e) {
        e.preventDefault();

        if (e.target !== this) {
            const node = e.target.parentNode;

            top.showDialog(`/dc/dialog/location.html?facility=${node.dataset.id}`, window);
        }
    }

    function moveHelper() {
        if (!selected) {
            return;
        }

        const
            rect = selected.querySelector("circle").getBoundingClientRect(),
            pos = positionData[selected.dataset.id],
            matrix1 = transform.translate.matrix,
            matrix2 = selected.transform.baseVal.getItem(1).matrix;

        helperX.style.left = `${rect.x}px`;
        helperY.style.top = `${rect.y}px`;
        gridZ.style.marginLeft = `${rect.x}px`;
        
        gridX.value = pos.x + matrix1.e + matrix2.e;
        gridY.value = pos.y + matrix1.f + matrix2.f;
    }

    window.initialize = function (data) {
        positionData = data;
        
        transform.scale.setScale(scale, scale);

        onResize();
    };

    /**
     * @param {string} id
     **/
    window.addFacility = function (id, rack) {
        const node = copy.cloneNode(true);
        let pos = positionData[id], transform;
        
        if (!pos) {
            pos = {
                x: 0,
                y: 0
            };

            positionData[id] = pos;
        }
        
        node.classList.add("node");

        if (rack.rotate) {
            transform = `translate(${pos.x},${pos.y}) translate(0,0) rotate(${rack.rotate})`;
        } else {
            transform = `translate(${pos.x},${pos.y}) translate(0,0)`
        }

        node.setAttribute("transform", transform);
        
        node.querySelector("rect").setAttribute("width", rack.width);
        node.querySelector("rect").setAttribute("height", rack.depth);

        node.querySelector("text").textContent = rack.name;
        
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
            
            top.showDialog(`/dc/dialog/location.html?facility=${id}&device=${e.dataTransfer.getData("id")}&name=${e.dataTransfer.getData("name")}`, window);

            node.classList.remove("over");
        });
        
        node.dataset.id = id;

        map[id] = node;

        layerMap.node.appendChild(node);
    };

    root.addEventListener("wheel", onScale);
    root.addEventListener("mousedown", onMouseDown);
    root.addEventListener("mouseup", onMouseUp);
    root.addEventListener("mousemove", onMouseMove);
    root.addEventListener("contextmenu", onMenu);

    document.getElementById("grid").onsubmit = e => {
        e.preventDefault();

        const
            pos = positionData[selected.dataset.id];

        selected.transform.baseVal.getItem(0).setTranslate(pos.x = Number(gridX.value), pos.y = Number(gridY.value));
        pos.z = Number(gridZ.value);

        moveHelper();
    };

    window.addEventListener("resize", onResize);
}