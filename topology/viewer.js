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
        shutdown = [],
        critical = [];
    let
        stage,
        moveStage,
        positionData,
        branchData,
        scale = 1,
        intersect, size, dragOrigin;

    document.body.appendChild(root);
    
    for (let name in layerMap) {
        container.appendChild(layerMap[name]);
    }
    
    root.appendChild(container);
    
    window.addEventListener("resize", onResize);

    root.addEventListener("wheel", onScale);
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

    const addPath = function (args) {
        const
            nodeFrom = args.nodeFrom,
            nodeTo = args.nodeTo,
            labelFrom = args.labelFrom,
            labelTo = args.labelTo,
            option = args.option,
            svgPath = document.createElementNS(SVG_NS_URI, "g"),
            svgLine = document.createElementNS(SVG_NS_URI, "polyline");
        let textFrom, textTo;

        svgPath.classList.add("path");

        svgLine.setAttribute("stroke", option.color);
        svgLine.setAttribute("stroke-width", option.size);

        svgPath.appendChild(svgLine);

        if (labelFrom) {
            textFrom = document.createElementNS(SVG_NS_URI, "text");

            labelFrom.forEach(label => {
                const tspan = document.createElementNS(SVG_NS_URI, "tspan");

                tspan.textContent = " "+ (label.name.length >= TEXT_TRIM?
                    label.name.substring(0, TEXT_TRIM) +"...":
                    label.name) +" ";

                if (label.click) {
                    tspan.onclick = e => label.click(nodeFrom, label.index);
                }

                textFrom.appendChild(tspan);
            });

            if (textFrom.querySelector("tspan")) {
                svgPath.appendChild(textFrom);
            } else {
                textFrom = undefined;
            }
        }

        if (labelTo) {
            textTo = document.createElementNS(SVG_NS_URI, "text");

            labelTo.forEach(label => {
                const tspan = document.createElementNS(SVG_NS_URI, "tspan");

                tspan.textContent = " "+ (label.name.length >= TEXT_TRIM?
                    label.name.substring(0, TEXT_TRIM) +"...":
                    label.name) +" ";
                
                if (label.click) {
                    tspan.onclick = e => label.click(nodeTo, label.index);
                }

                textTo.appendChild(tspan);
            });

            if (textTo.querySelector("tspan")) {
                svgPath.appendChild(textTo);
            } else {
                textTo = undefined;
            }
        }

        if (args.posFrom && args.posTo) {
            const
                x1 = args.posFrom.x,
                y1 = args.posFrom.y,
                x = args.posTo.x - x1,
                y = args.posTo.y - y1;

            switch (option.type) {
            case "clock":
                svgLine.setAttribute("points", `0,0 ${x},0 ${x},${y}`);

                if (textFrom) {
                    textFrom.setAttribute("x", x /2);
                    textFrom.setAttribute("y", 0);
                }

                if (textTo) {
                    textTo.setAttribute("x", x);
                    textTo.setAttribute("y", y /2);
                }

                break;
            case "counter":
                svgLine.setAttribute("points", `0,0 0,${y} ${x},${y}`);

                if (textFrom) {
                    textFrom.setAttribute("x", 0);
                    textFrom.setAttribute("y", y /2);
                }

                if (textTo) {
                    textTo.setAttribute("x", x /2);
                    textTo.setAttribute("y", y);
                }

                break;
            default:
                svgLine.setAttribute("points", `0,0 ${x},${y}`);

                if (textFrom) {
                    textFrom.setAttribute("x", x /3);
                    textFrom.setAttribute("y", y /3);
                }

                if (textTo) {
                    textTo.setAttribute("x", x *2/3);
                    textTo.setAttribute("y", y *2/3);
                }
            }

            svgPath.setAttribute("transform", `translate(${x1},${y1})`);
        } else {
            const
                pos = args.posFrom || args.posTo,
                peer = document.createElementNS(SVG_NS_URI, "circle")
            
            x = 0;
            y = -100;

            svgLine.setAttribute("points", `0,0 ${x},${y}`);

            peer.setAttribute("cx", x);
            peer.setAttribute("cy", y);
            peer.setAttribute("r", 10);

            svgPath.appendChild(peer);

            if (textFrom) {
                textFrom.setAttribute("x", x);

                if (args.posFrom) {
                    textFrom.setAttribute("y", y /3);
                } else {
                    textFrom.setAttribute("y", y *2/3);
                }
            }

            if (textTo) {
                textTo.setAttribute("x", x);
                
                if (args.posTo) {
                    textTo.setAttribute("y", y /3);
                } else {
                    textTo.setAttribute("y", y *2/3);
                }
            }

            svgPath.setAttribute("transform", `translate(${pos.x},${pos.y})`);
        }

        return svgPath;
    };

    function findBranch(id) {
        id = String(id);

        for (let pos; pos = positionData[id]; id = String(pos.parent)) {
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
        
        for (let id in branchData) {
            node = branchData[id];
            pos = positionData[id];
            
            // 동기화 안된 node의 pos 정보가 없음
            if (!pos) {
                positionData[id] = pos = {
                    x: 0,
                    y: 0
                };
            }
            
            // 상위 그룹이 삭제 되었음
            if (pos.parent && !(pos.parent in branchData)) {
                pos.parent = undefined;
            }
            
            if (pos.parent !== stage) {
                continue;
            }
            
            args = {
                node: node,
                icon: parent.iconData[node.type || "unknown"] || parent.iconData["unknown"],
                position: positionData[id],
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
        let node, pos, branch, link, peerMap, args, id;
        
        for (let id in nodeData) {
            node = nodeData[id];
            pos = positionData[id];
            
            // 동기화 안된 node의 pos 정보가 없음
            if (!pos) {
                positionData[id] = pos = {
                    x: 0,
                    y: 0
                };
            }
            
            // 상위 그룹이 삭제 되었음
            if (pos.parent && !(pos.parent in branchData)) {
                pos.parent = undefined;
            }
            
            if (pos.parent === stage) {
                args = {
                    node: node,
                    icon: parent.iconData[node.type || "unknown"] || parent.iconData["unknown"],
                    position: parent.positionData[id],
                    path: "disabled"
                };
    
                if ("protocol" in node) {
                    args.click = e => showChart(id);
    
                    if ("status" in node && !node.status) {
                        args.path = "shutdown";
                    }
                    else if ("critical" in node && node.critical) {
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
                    else if ("critical" in node && node.critical) {
                        critical.push(branch);
                    }
                }
            }
        }

        layerMap.device.appendChild(df);
    }

    function initLink(linkData) {
        for (let id in linkData) {
            link = linkData[id];

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

    function initPath(pathData) {
        const df = document.createDocumentFragment();
        let path, from;
    
        for (let id in pathData) {
            path = pathData[id];
    
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
                    nodeFrom: nodeFrom,
                    nodeTo: nodeTo,
                    option: peerMap[nodeTo],
                    labelFrom: [],
                    labelTo: []
                };
                
                id = findBranch(nodeFrom);
    
                if (id) {
                    args.posFrom = parent.positionData[id];
                }
                
                id = findBranch(nodeTo);
    
                if (id) {
                    args.posTo = parent.positionData[id];
                }
    
                if ((args.posFrom === args.posTo)) {
                    continue;
                }

                if (!args.posFrom && !args.posTo) {
                    continue;
                }

                if (!args.option.color) {
                    args.option.color = parent.settingData.linkColor || "#ffffff";
                }
    
                if (!args.option.size) {
                    args.option.size = parent.settingData.linkSize || 1;
                }
    
                link = linkMap[nodeFrom];
    
                if (link) {
                    link = link[nodeTo];
    
                    if (link) {
                        link.forEach(id => {
                            const link = parent.linkData[id];
    
                            if (link.indexFrom) {
                                args.labelFrom.push({
                                    index: link.indexFrom,
                                    name: link.indexFromName,
                                    click: showChart
                                });
                            }
                            
                            if (link.indexTo) {
                                args.labelTo.push({
                                    index: link.indexTo,
                                    name: link.indexToName,
                                    click: showChart
                                });
                            }
                        });
                    }
                }

                df.appendChild(addPath(args));
            }
        }

        layerMap.path.appendChild(df);
    }

    function initialize(id, args) {
        stage = id;
        moveStage = args.moveStage;
        positionData = args.positionData;
        nodeData = args.nodeData;
        branchData = args.branchData;
        
        initNode();
        initBranch();
        initLink(args.linkData);
        initPath(args.pathData);
    }
}