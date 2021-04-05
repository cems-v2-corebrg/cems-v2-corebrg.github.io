{
    "use strict";

    const
        SCALE = 0.01,
        UNIT_SIZE = 44.5 *SCALE,
        RACK19_WIDTH = 482.6 *SCALE,
        GUIDE_WIDTH = 15.875 *SCALE,
        PDU_WIDTH = 25 *SCALE,
        Label = function() {
            this.initialize(arguments);
        },
        Target = function () {
            this.initialize(arguments);
        },
        FocusAnimation = function () {
            const
                duration = arguments[1] || 3000,
                target = arguments[0],
                origin = camera.position.clone(),
                distance = arguments[0].clone().sub(camera.position);
            var start;

            requestAnimationFrame(update);
            
            function update(t) {
                if (!start) {
                    start = t;
                }
    
                const elapse = t - start;
                
                if (elapse < duration) {
                    camera.position.x = origin.x + distance.x * elapse / duration;
                    camera.position.y = origin.y + distance.y * elapse / duration;
                    camera.position.z = origin.z + distance.z * elapse / duration;

                    requestAnimationFrame(update);
                } else {
                    camera.position.copy(target);
                }

                draw();
            }
        },
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        }),
        scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 2000), // 시야각이 클수록 외곡
        controls = new THREE.OrbitControls(camera, renderer.domElement),
        rackMap = {},
        intersectArray = [],
        deviceMap = {};
    let isDrag, intersect, screen, target, rafID;
    
    Label.map = [];
    Label.prototype = {
        initialize: function (args) {
            this.position = args[0];
            this.rack = args[1];
            this.label = document.createElement("div");

            this.label.appendChild(document.createElement("span")).textContent = args[3];
            
            this.label.className = "label";

            document.body.insertBefore(this.label, renderer.domElement);

            this.label.onclick = e => window.onSelectRack && onSelectRack(args[2]);

            Label.map.push(this);
        },
        update: function() {
            const
                box = new THREE.Box3().setFromObject(this.rack),
                position = new THREE.Vector3(0, 0, 0);

            position.copy(this.position);
            //position.x -= (box.max.x - box.min.x) /2;
            position.z += (box.max.z - box.min.z);
            position.y += (box.max.y - box.min.y);

            position.project(camera);

            position.x = (position.x +1) * screen.width /2;
            position.y = -(position.y -1) * screen.height /2;
            
            this.label.style.left = `${position.x}px`;
            this.label.style.top = `${position.y}px`;
        }
    };

    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.insertBefore(renderer.domElement, document.body.firstElementChild);
    
    //camera.zoom = 0.1;
    camera.position.set(40, 20, 80);

    //scene.scale.set(0.1, 0.1, 0.1);
    scene.add(camera);
    
    controls.maxPolarAngle = Math.PI /2 -0.1;
    //controls.maxPolarAngle = Math.PI /2;
    
    /*Directional light*/
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);

        light.position.set(100, 100, 100);
        scene.add(light);
    }

    /*Hemisphere light*/
    {
        const light = new THREE.HemisphereLight(0xffffff, 0x777777, 1);

        light.position.set(0, 100, 0);

        scene.add(light);
    }

    /*Ground*/
    window._setFloor = size => {
        new THREE.TextureLoader().load("/dc/img/floor.jpg", function (texture) {
            texture.minFilter = THREE.LinearFilter;
            
            const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(size.width *SCALE, size.height *SCALE), new THREE.MeshBasicMaterial({
                    map: texture
                }));
        
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            texture.repeat.set(Math.round(size.width /600), Math.round(size.height /600));

            floor.rotation.x = Math.PI /-2;
        
            scene.add(floor);
        });
    }

    window.setFloor = size => {
        const mat = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0x999999)
            });

        new THREE.TextureLoader().load("/dc/img/floor.jpg", function (texture) {
            texture.minFilter = THREE.LinearFilter;

            const
                mat2 = new THREE.MeshPhongMaterial({
                    map: texture
                }),
                mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(size.width *SCALE, size.width *SCALE, size.height *SCALE), [mat, mat, mat2, mat, mat, mat]);

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            
            texture.repeat.set(Math.round(size.width /600), Math.round(size.height /600));
            
            mesh.position.set(0, size.width *SCALE /-2, 0);

            scene.add(mesh);
        });
    }
    
    window.addEventListener("resize", onResize);
    //renderer.domElement.addEventListener("mousedown", onMouseDown);
    //renderer.domElement.addEventListener("mouseup", onMouseUp);
    //renderer.domElement.addEventListener("mousemove", onMouseMove);

    onResize();
    
    function onMouseUp(e) {
        e.preventDefault();

        const node = getIntersect(e);

        if (node && node === intersect && node.onclick) {
            node.onclick();
        }

        isDrag = false;
    }

    function onMouseDown(e) {
        e.preventDefault();
        
        isDrag = true;

        intersect = getIntersect(e);
    }

    function onMouseMove(e) {
        e.preventDefault();

        if (isDrag) {
            intersect = undefined;
        }
    }

    function getIntersect(e) {
        const
            raycaster = new THREE.Raycaster(),
            mouse = new THREE.Vector2();
            
        mouse.x = e.clientX / screen.width *2 -1;
        mouse.y = e.clientY / screen.height *-2 +1;
        
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(intersectArray);
        
        if (intersects.length > 0) {
            return intersects[0].object.parent;
        }
    }

    function onResize() {
        screen = document.body.getBoundingClientRect();
        
        camera.aspect = screen.width / screen.height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(screen.width, screen.height);

        draw();
    }

    Target.prototype = {
        initialize: function (args) {
            this.step = args[1] || 30;
            this.target = args[0];
            this.x = (args[0].x - camera.position.x) /this.step;
            this.y = (args[0].y - camera.position.y) /this.step;
            this.z = (args[0].z - camera.position.z) /this.step;            
        },
        update: function() {
            if (this.step-- > 1) {
                camera.position.x += this.x;
                camera.position.y += this.y;
                camera.position.z += this.z;
            } else if (this.step === 0) {
                camera.position.copy(this.target);
            }
        }
    };
    
    function draw() {
        controls.update();

        renderer.render(scene, camera);

        Label.map.forEach(label => label.update());

        window.requestAnimationFrame(draw);
    }

    function putDevice(rackID, id, args) {
        const rack = rackMap[String(rackID)];

        if (!rack) {console.log("Rack not found.");
            return;
        }

        const
            device = new THREE.Group(),
            mesh = args.model? new THREE.Mesh(
            new THREE.BoxBufferGeometry(RACK19_WIDTH, args.model.unit *UNIT_SIZE, rack.facility.depth *SCALE - PDU_WIDTH),
            [
                new THREE.MeshBasicMaterial(),
                new THREE.MeshBasicMaterial(),
                new THREE.MeshBasicMaterial(),
                new THREE.MeshBasicMaterial(),
                new THREE.MeshBasicMaterial({
                    map: args.model.front
                }),
                new THREE.MeshBasicMaterial({
                    map: args.model.rear
                })
            ]):
            new THREE.Mesh(
                new THREE.BoxBufferGeometry(RACK19_WIDTH, UNIT_SIZE, rack.facility.depth *SCALE - PDU_WIDTH),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(0xc0c0c0)
                })
            );
try {
        device.position.set(0, UNIT_SIZE * (rack.facility.unit /-2 + args.model.unit /2 + args.position -1), PDU_WIDTH /2);
} catch (e) {
    console.error(e);
    console.log(args);
}
        if (args.status && false) {
            const status = new THREE.Mesh(new THREE.BoxBufferGeometry(WIDTH + THICK *2 + BORDER *2, args.model.unit -0.2, DEPTH + BORDER *2), new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.5
            }))
            
            switch(args.status) {
            case "shutdown":
                status.material.color = new THREE.Color("#ff0000");

                break;
            case "critical":
                status.material.color = new THREE.Color("#ff5a00");

                break;
            }

            status.name = "status";

            device.add(status);
        }

        intersectArray.push(mesh);
        
        deviceMap[id] = device;

        device.onclick = args.onclick;
        
        device.add(mesh);

        rack.container.add(device);

        return device;
    }

    function createRack(facility, pos) {
        const
            width = facility.width *SCALE,
            height = facility.height *SCALE,
            depth = facility.depth *SCALE,
            x = pos.x *SCALE,
            y = pos.y *SCALE,
            vMargin = (height - facility.unit * UNIT_SIZE) /2,
            hMargin = (width - RACK19_WIDTH) /2 - GUIDE_WIDTH,
            pivot = new THREE.Group(),
            container = new THREE.Group(),
            planeMat = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0x333333)
            });
        
        new THREE.TextureLoader().load("/dc/img/rack-side.png", function (texture) {
            texture.minFilter = THREE.LinearFilter;

            const mat = new THREE.MeshPhongMaterial({
                    map: texture
                });
            let mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(hMargin, height, depth), [mat, mat, planeMat, planeMat, planeMat, planeMat]);

            mesh.position.set((width - hMargin) /2 , 0, 0);

            container.add(mesh);

            mesh = mesh.clone();
            
            mesh.position.set((width - hMargin) /-2, 0, 0);        

            container.add(mesh);
        });

        new THREE.TextureLoader().load("/dc/img/guide.png", function (texture) {
            texture.minFilter = THREE.LinearFilter;

            const mat = new THREE.MeshPhongMaterial({
                    map: texture
                });
            let mesh;

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, facility.unit);
            
            mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(GUIDE_WIDTH, height -2 * vMargin, GUIDE_WIDTH), [planeMat, planeMat, planeMat, planeMat, mat, mat]);

            mesh.position.set((width -GUIDE_WIDTH) /2 - hMargin, 0, depth /2 -GUIDE_WIDTH);
            
            container.add(mesh);

            mesh = mesh.clone();

            mesh.position.set((width -GUIDE_WIDTH) /-2 + hMargin, 0, depth /2 -GUIDE_WIDTH);

            container.add(mesh);
        });

        new THREE.TextureLoader().load("/dc/img/pdu-unit.png", function (texture) {
            texture.minFilter = THREE.LinearFilter;

            const
                mat = new THREE.MeshPhongMaterial({
                    map: texture
                }),
                geo = new THREE.BoxBufferGeometry(PDU_WIDTH, height -2 * vMargin, GUIDE_WIDTH);

            let pdu;

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, facility.unit);

            pdu = new THREE.Mesh(geo, [planeMat, planeMat, planeMat, planeMat, planeMat, mat]);

            pdu.position.set((width -PDU_WIDTH) /2 - hMargin, 0, depth /-2 +PDU_WIDTH);

            container.add(pdu);
        });

        {
            let mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(width - hMargin *2, Math.max(vMargin, 0), depth), planeMat);

            mesh.position.set(0, (height - vMargin) /2, 0);

            container.add(mesh);

            mesh = mesh.clone();

            mesh.position.set(0, (height - vMargin) /-2, 0);

            container.add(mesh);
        }

        container.position.set(width /2, height /2, depth /2);

        pivot.position.set(x, 0, y);

        if (facility.rotate) {
            pivot.rotation.y = (360 - facility.rotate) * Math.PI / 180;
        }

        pivot.add(container);

        scene.add(pivot);

        rackMap[String(facility.id)] = {
            facility: facility,
            container: container
        };

        facility.name && new Label(pivot.position, container, facility.id, facility.name);
    }

    function createFacility (facility, pos) {
        if (facility.type === "rack") {
            return createRack(facility, pos);
        }

        const
            width = facility.width *SCALE,
            height = facility.height *SCALE,
            depth = facility.depth *SCALE,
            x = pos.x *SCALE,
            y = pos.y *SCALE,
            pivot = new THREE.Group(),
            container = new THREE.Group(),
            mat = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0x333333)
            });

        if (facility.image) {
            new THREE.TextureLoader().load(facility.image, function (texture) {
                texture.minFilter = THREE.LinearFilter;

                const
                    mat2 = new THREE.MeshPhongMaterial({
                        map: texture
                    }),
                    mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(width, height, depth), [mat, mat, mat, mat, mat2, mat]);

                container.add(mesh);
                container.position.set(width /2, height /2, depth /2);

                pivot.position.set(x, 0, y);

                if (facility.rotate) {
                    pivot.rotation.y = (360 - facility.rotate) * Math.PI / 180;
                }

                pivot.add(container);

                scene.add(pivot);
            });
        } else {
            const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(width, height, depth), mat);

            container.add(mesh);
            container.position.set(width /2, height /2, depth /2);

            pivot.position.set(x, 0, y);

            if (facility.rotate) {
                pivot.rotation.y = (360 - facility.rotate) * Math.PI / 180;
            }

            pivot.add(container);

            scene.add(pivot);
        }
        
    }

    function animateFocus(t) {
        
        camera.updateMatrixWorld();

        if (target.update()) {
            draw();

            requestAnimationFrame(animateFocus);
        }
    }

    /**
     * 
     * @param {string} id
     */
    function focusDevice (id) {
        const device = deviceMap[id];

        if (device) {
            const v = new THREE.Vector3().copy(device.position);

            controls.target.copy(device.position);
            
            v.z += DEPTH;

            new FocusAnimation(v);
        }
    }
}