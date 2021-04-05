export function Resizer () {
	this.initialize(arguments);
}

Resizer.prototype = {
	initialize: function (args) {
		this.target = args[0];
		this.config = args[1] || {};
		this.handle = document.createElement("div");

		this.handle.style = "cursor: e-resize; user-select: none; width: 5px; background-color: rgba(200, 200, 200, 0.5);";

		if ("width" in this.config) {
			this.handle.style.width = `${this.config.width}px`;
		}
		
		if ("color" in this.config) {
			this.handle.style.backgroundColor = this.config.color;
		}

		this.target.parentNode.insertBefore(this.handle, this.target.nextSibling);

		this.handle.onmouseenter = e => {
			if (!this.rect) 
				this.handle.style.backgroundColor = this.config.hover || "rgba(0, 132, 255, 0.5)";
		};

		this.handle.onmouseleave = e => {
			if (!this.rect) {
				this.handle.style.backgroundColor = this.config.color || "rgba(200, 200, 200, 0.5)";
			}
		};

		document.body.addEventListener("mousedown", e => {
			if (e.target === this.handle) {
				this.rect = this.target.getBoundingClientRect();

				this.target.style.pointerEvents = "none";
				
				this.handle.style.backgroundColor = this.config.hover || "rgba(0, 132, 255, 0.5)";
				
				document.body.style.cursor = "e-resize";
			}
		});

		document.body.addEventListener("mouseup", e => {
			delete this.rect;
			delete this.origin;

			this.target.style.pointerEvents = "initial";

			this.handle.style.backgroundColor = this.config.color || "rgba(200, 200, 200, 0.5)";

			document.body.style.cursor = "initial";
		});

		document.body.addEventListener("mousemove", e => {
			if (this.rect) {
				if (!this.origin) {
					// drag start
					this.origin = e.clientX;
				}

				//drag move
				this.target.style.width = `${this.rect.width + (e.clientX - this.origin)}px`;
			}
		});
	}
};