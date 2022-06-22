{
    "use strict";

    const
        SVG_NS_URI = "http://www.w3.org/2000/svg",
        XLINK_NS_URI = "http://www.w3.org/1999/xlink",
        ICON_SIZE = 40,
        TEXT_TRIM = 20;

    const
        root = document.createElementNS(SVG_NS_URI, "svg"),
        container = document.createElementNS(SVG_NS_URI, "g"),
        transform = {
            resize: container.transform.baseVal.appendItem(root.createSVGTransform()),
            scale: container.transform.baseVal.appendItem(root.createSVGTransform()),
            translate: container.transform.baseVal.appendItem(root.createSVGTransform())
        },
        layerMap = {
            path: document.createElementNS(SVG_NS_URI, "g"),
            device: document.createElementNS(SVG_NS_URI, "g")
        },
        nodeMap = {},
        pathMap = {},
        linkMap = {},
        upLinkMap = {},
        shutdown = [],
        critical = [];
    let
        stage,
        scale = 1,
        intersect, size, dragOrigin;

    document.body.appendChild(root);
    
    for (let name in layerMap) {
        container.appendChild(layerMap[name]);
    }
    
    root.appendChild(container);
    
    window.addEventListener("resize", onResize);

    root.addEventListener("wheel", onScale, {
        passive: false
    });
    root.addEventListener("mousedown", onMouseDown);
    root.addEventListener("mouseup", onMouseUp);
    root.addEventListener("mousemove", onMouseMove);
    root.addEventListener("contextmenu", e => e.preventDefault());

    onResize();

    function onScale (e) {
        if (e.deltaY < 0) {
            scale *= 1.1;
        } else {
            scale /= 1.1;
        }

        transform.scale.setScale(scale, scale);
    }

    function onMouseUp(e) {
        e.preventDefault();

        if (e.which !== 1) {
            return;
        }

        const device = getIntersect(e);
        
        if (intersect && (device === intersect)) {
            device.dispatchEvent(new Event("_click"));
        }

        dragOrigin = undefined;
    }

    function onMouseDown(e) {
        e.preventDefault();
        
        if (e.which !== 1) {
            return;
        }
        
        dragOrigin = {
            e: transform.translate.matrix.e,
            f: transform.translate.matrix.f,
            x: e.clientX,
            y: e.clientY
        };

        intersect = getIntersect(e);
    }

    function onMouseMove(e) {
        e.preventDefault();

        if (dragOrigin) {
            intersect = undefined;

            transform.translate.setTranslate(dragOrigin.e + (e.clientX - dragOrigin.x) / scale, dragOrigin.f + (e.clientY - dragOrigin.y) / scale);
        }
    }

    function getIntersect(e) {
        if (e.target !== e.currentTarget) {
            return e.target;
        }
    }

    function onResize() {
        size = document.body.getBoundingClientRect();
        
        transform.resize.setTranslate(size.width /2, size.height /2);
    }

    window.render = function () {      
        const delta = clock.getDelta();
    
        animation(delta);

        requestAnimationFrame(render);
    }

    function animation(delta) {
    }

    const createNode = function (args) {
        const
            node = args.node,
            icon = args.icon,
            pos = args.position,
            svgDevice = document.createElementNS(SVG_NS_URI, "g"),
            svgIcon = document.createElementNS(SVG_NS_URI, "image"),
            svgLabel = document.createElementNS(SVG_NS_URI, "text"),
            svgAddr = document.createElementNS(SVG_NS_URI, "tspan"),
            svgName = document.createElementNS(SVG_NS_URI, "tspan"),
            svgBG = document.createElementNS(SVG_NS_URI, "circle"),
            size = args.size || ICON_SIZE,
            radius = size * Math.sin(Math.PI /4);

        svgIcon.setAttribute("x", -size /2);
        svgIcon.setAttribute("y", -size /2);
        svgIcon.setAttribute("width", size +"px");
        svgIcon.setAttribute("height", size +"px");
        
        svgDevice.setAttribute("transform", "translate("+ pos.x +","+ pos.y +")");
        
        svgBG.setAttribute("r", radius);
        svgBG.setAttribute("stroke-width", radius);
        svgBG.setAttribute("cx", 0);
        svgBG.setAttribute("cy", 0);

        svgDevice.dataset.id = node.id;

        if (args.click) {
            svgIcon.addEventListener("_click", e => args.click(node.id));
        }
        
        svgName.textContent = node.name || node.ip || "";
        svgAddr.textContent = node.ip || node.name || "";
        
        svgLabel.appendChild(svgName);
        svgLabel.appendChild(svgAddr);
        
        svgLabel.setAttribute("x", 0);
        svgLabel.setAttribute("y", size);
        svgLabel.setAttribute("dominant-baseline", "top");

        svgDevice.appendChild(svgBG);
        svgDevice.appendChild(svgIcon);
        svgDevice.appendChild(svgLabel);
        
        svgDevice.classList.add("node");
        
        layerMap.device.appendChild(svgDevice);
        
        svgIcon.setAttributeNS(XLINK_NS_URI, "xlink:href", icon[args.path === "critical"? "shutdown": args.path]);
        
        if (args.path === "critical" || args.path === "shutdown") {
            setStatus(svgDevice, args.path);
        }

        return svgDevice;
    };

    const draw = {
        clock: (container, from, to) => {
            const
                svgLine = container.querySelector("polyline"),
                labels = container.querySelectorAll("text"),
                x1 = from.x,
                y1 = from.y,
                x = to.x - x1,
                y = to.y - y1;
            
            svgLine.setAttribute("points", `0,0 ${x},0 ${x},${y}`);

            labels[0].setAttribute("x", x /2);
            labels[0].setAttribute("y", 0);

            labels[1].setAttribute("x", x);
            labels[1].setAttribute("y", y /2);

            container.setAttribute("transform", `translate(${x1},${y1})`);
        },
        counter: (container, from, to) => {
            const
                svgLine = container.querySelector("polyline"),
                labels = container.querySelectorAll("text"),
                x1 = from.x,
                y1 = from.y,
                x = to.x - x1,
                y = to.y - y1;
            
            svgLine.setAttribute("points", `0,0 0,${y} ${x},${y}`);

            labels[0].setAttribute("x", 0);
            labels[0].setAttribute("y", y /2);

            labels[1].setAttribute("x", x /2);
            labels[1].setAttribute("y", y);
            
            container.setAttribute("transform", `translate(${x1},${y1})`);
        },
        line: (container, from, to) => {
            const
                svgLine = container.querySelector("polyline"),
                labels = container.querySelectorAll("text"),
                x1 = from.x,
                y1 = from.y,
                x = to.x - x1,
                y = to.y - y1;

            svgLine.setAttribute("points", `0,0 ${x},${y}`);

            labels[0].setAttribute("x", x /3);
            labels[0].setAttribute("y", y /3);

            labels[1].setAttribute("x", x *2/3);
            labels[1].setAttribute("y", y *2/3);

            container.setAttribute("transform", `translate(${x1},${y1})`);
        },
        upLink: (container, from, to) => {
            const
                svgLine = container.querySelector("polyline"),
                labels = container.querySelectorAll("text"),
                peer = document.createElementNS(SVG_NS_URI, "circle"),
                x = 0,
                y = -100,
                pos = from || to;

            peer.setAttribute("cx", x);
            peer.setAttribute("cy", y);
            peer.setAttribute("r", 10);

            svgLine.setAttribute("points", `0,0 ${x},${y}`);

            labels[0].setAttribute("x", x);
            labels[0].setAttribute("y", y /3);

            labels[1].setAttribute("x", x);
            labels[1].setAttribute("y", y *2/3);

            container.appendChild(peer);

            container.setAttribute("transform", `translate(${pos.x},${pos.y})`);
        }
    };

    const setLabel = (container, id, labels = []) => {
        labels.forEach(label => {
            const tspan = document.createElementNS(SVG_NS_URI, "tspan");

            tspan.textContent = " "+ (label.name.length >= TEXT_TRIM?
                label.name.substring(0, TEXT_TRIM) +"...":
                label.name) +" ";
/*
            if (label.click) {
                tspan.onclick = e => label.click(id, label.index);
            }
*/
            container.appendChild(tspan);
        });
    };

    const createPath2 = function (args, func) {
        const
            svgPath = document.createElementNS(SVG_NS_URI, "g"),
            svgLine = document.createElementNS(SVG_NS_URI, "polyline"),
            labelFrom = document.createElementNS(SVG_NS_URI, "text"),
            labelTo = document.createElementNS(SVG_NS_URI, "text");
        
        svgPath.classList.add("path");

        svgPath.appendChild(svgLine);
        svgPath.appendChild(labelFrom);
        svgPath.appendChild(labelTo);

        svgLine.setAttribute("stroke", args.option.color);
        svgLine.setAttribute("stroke-width", args.option.size);
        
        setLabel(labelFrom, args.from.id, args.from.label);
        setLabel(labelTo, args.to.id, args.to.label);

        draw[func](svgPath, args.from.pos, args.to.pos);
        
        return svgPath;
    };

    const createPath = function (args) {
        if (args.from.pos && args.to.pos) {
            return createPath2(args, args.option.type || "line");
        } else {
            let id;

            if (!args.from.pos) {
                const tmp = args.to;

                args.to = args.from;
                args.from = tmp;
            }

            id = String(args.from.id); 
            
            if (id in upLinkMap) {
                const
                    svgPath = upLinkMap[id],
                    labels = svgPath.querySelectorAll("text");

                setLabel(labels[0], args.from.id, args.from.label);
                setLabel(labels[1], args.to.id, args.to.label);
            } else {
                return upLinkMap[id] = createPath2(args, "upLink");
            }
        }
    };

    function findBranch(id) {
        id = String(id);

        for (let pos; pos = window.positionData[id]; id = String(pos.parent)) {
            if (pos.parent === stage) {
                return id;
            }

            if (!("parent" in pos)) {
                break;
            }
        }
    }

    function setStatus (svg, status) {
        if (!svg.querySelector("circle")) {
            const status = document.createElementNS(SVG_NS_URI, "circle");

            status.setAttribute("r", window.OFFSET_C);
            status.setAttribute("cx", 0);
            status.setAttribute("cy", 0);
            
            svg.appendChild(status);
        }

        svg.classList.add(status);
    };

    function focusNode (id) {
        const node = nodeMap[String(id)];

        if (node) {
            const matrix = node.transform.baseVal.getItem(0).matrix;

            transform.translate.setTranslate(-matrix.e, -matrix.f);

            scale = 0;

            let start;

            const animation = t => {
                if (isNaN(start)) {
                    start = t;
                }
                else {
                    scale = Math.min(1, (t - start) /1000) *3;
        
                    transform.scale.setScale(scale, scale);
        
                    if (scale >= 3) {
                        return;
                    }
                }
        
                requestAnimationFrame(animation);
            };
        
            animation();
        }
    };

    function initBranch() {
        const
            df = document.createDocumentFragment(),
            linkMap = {};
        let node, pos, group, link, peerMap, args, id;
        
        for (let id in window.branchData) {
            node = window.branchData[id];
            pos = window.positionData[id];
            
            // 동기화 안된 node의 pos 정보가 없음
            if (!pos) {
                window.positionData[id] = pos = {
                    x: 0,
                    y: 0
                };
            }
            
            // 상위 그룹이 삭제 되었음
            if (pos.parent && !(pos.parent in window.branchData)) {
                pos.parent = undefined;
            }
            
            if (pos.parent !== stage) {
                continue;
            }
            
            args = {
                node: node,
                icon: window.iconData[node.type || "unknown"] || window.iconData["unknown"],
                position: window.positionData[id],
                click: moveStage,
                path: shutdown.indexOf(id) !== -1? "shutdown": critical.indexOf(id) !== -1? "critical": "src",
                size: 60
            };

            df.appendChild(nodeMap[id] = createNode(args));
        }

        layerMap.device.appendChild(df);
    }

    function initNode() {
        const
            df = document.createDocumentFragment(),
            linkMap = {};
        let node, pos, branch, args;
        
        for (let id in window.nodeData) {
            node = window.nodeData[id];
            pos = window.positionData[id];
            
            // 동기화 안된 node의 pos 정보가 없음
            if (!pos) {
                window.positionData[id] = pos = {
                    x: 0,
                    y: 0
                };
            }
            
            // 상위 그룹이 삭제 되었음
            if (pos.parent && !(pos.parent in window.branchData)) {
                pos.parent = undefined;
            }
            
            if (pos.parent === stage) {
                args = {
                    node: node,
                    icon: window.iconData[node.type || "unknown"] || window.iconData["unknown"],
                    position: window.positionData[id],
                    path: "disabled"
                };
    
                if ("protocol" in node) {
                    args.click = e => showChart(id);
    
                    if ("status" in node && !node.status) {
                        args.path = "shutdown";
                    }
                    else if ("critical" in node && !node.critical) {
                        args.path = "critical";
                    } else {
                        args.path = "src";
                    }
                }
    
                df.appendChild(nodeMap[id] = createNode(args));
            }
            else if (pos.parent && (branch = findBranch(pos.parent))) {
                // 하위
                if ("protocol" in node) {
                    if ("status" in node && !node.status) {
                        shutdown.push(branch);
                    }
                    else if ("critical" in node && !node.critical) {
                        critical.push(branch);
                    }
                }
            }
        }

        layerMap.device.appendChild(df);
    }

    function initLink() {
        for (let id in window.linkData) {
            link = window.linkData[id];

            if (!linkMap[link.nodeFrom]) {
                linkMap[link.nodeFrom] = {};
            }

            if (!linkMap[link.nodeTo]) {
                linkMap[link.nodeTo] = {};
            }

            if (linkMap[link.nodeFrom][link.nodeTo]) {
                linkMap[link.nodeFrom][link.nodeTo].push(id);
            } else {
                linkMap[link.nodeFrom][link.nodeTo] =
                linkMap[link.nodeTo][link.nodeFrom] = [id];
            } 
        }
    }

    function initPath() {
        const df = document.createDocumentFragment();
        let path, from;
    
        for (let id in window.pathData) {
            path = window.pathData[id];
    
            from = String(path.from);
    
            if (!(from in pathMap)) {
                pathMap[from] = {};
            }
            
            pathMap[from][String(path.to)] = path;
        }

        for (let nodeFrom in pathMap) {
            peerMap = pathMap[nodeFrom];
    
            for (let nodeTo in peerMap) {
                args = {
                    from: {
                        id: nodeFrom,
                        label: []
                    },
                    to: {
                        id: nodeTo,
                        label: []
                    },
                    option: peerMap[nodeTo],
                };
                
                id = findBranch(nodeFrom);
    
                if (id) {
                    args.from.pos = window.positionData[id];
                }
                
                id = findBranch(nodeTo);
    
                if (id) {
                    args.to.pos = window.positionData[id];
                }
    
                if ((args.from.pos === args.to.pos)) {
                    continue;
                }

                if (!args.from.pos && !args.to.pos) {
                    continue;
                }

                if (!args.option.color) {
                    args.option.color = window.settingData["LINKCOLOR"];
                }
    
                if (!args.option.size) {
                    args.option.size = window.settingData["LINKSIZE"];
                }
    
                link = linkMap[nodeFrom];
    
                if (link) {
                    link = link[nodeTo];
    
                    if (link) {
                        link.forEach(id => {
                            const link = window.linkData[id];
    
                            if (link.indexFrom) {
                                args.from.label.push({
                                    index: link.indexFrom,
                                    name: link.indexFromName,
                                    click: showChart
                                });
                            }
                            
                            if (link.indexTo) {
                                args.to.label.push({
                                    index: link.indexTo,
                                    name: link.indexToName,
                                    click: showChart
                                });
                            }
                        });
                    }
                }

                path = createPath(args);

                path && df.appendChild(path);
            }
        }

        layerMap.path.appendChild(df);
    }

    function initialize(id) {
        stage = id;
        
        initNode();
        initBranch();
        initLink();
        initPath();
    }
}