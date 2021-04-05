function Test() {
    this.initialize(arguments);
}

{
    Test.prototype = {
        initialize: function (args) {
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 2000);
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

            this.renderer.setPixelRatio(window.devicePixelRatio);

            document.body.insertBefore(this.renderer.domElement, document.body.firstChild);

            this.camera.position.set(0, 0, 80);

            this.scene.add(this.camera);

            this.resize();

            this.update();

            /*Directional light*/
            {
                this.light1 = new THREE.DirectionalLight(0xffffff, 1);

                this.light1.position.set(100, 100, 100);
                
                this.scene.add(this.light1);
            }

            window.addEventListener("resize", e => this.resize());
        },
        resize: function () {
            this.screen = document.body.getBoundingClientRect();
            
            this.camera.aspect = this.screen.width / this.screen.height;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(this.screen.width, this.screen.height);
        },
        update: function () {
            this.controls.update();

            this.renderer.render(this.scene, this.camera);

            window.requestAnimationFrame(this.update.bind(this));
        },
        add: function (object) {
            this.scene.add(object);

            return object;
        }
};
}