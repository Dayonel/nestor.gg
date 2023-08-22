// @ts-nocheck
import * as THREE from "three";

export class Star {
    pixelRatio: number;
    constructor(pixelRatio: number) {
        this.pixelRatio = pixelRatio;
    }
    setup(color) {
        this.r = Math.random() * 3 + 1;
        this.phi = Math.random() * Math.PI * 2;
        this.theta = Math.random() * Math.PI;
        this.v = new THREE.Vector2()
            .random()
            .subScalar(0.5)
            .multiplyScalar(0.0007);

        this.x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
        this.y = this.r * Math.cos(this.phi);
        this.z = this.r * Math.sin(this.phi) * Math.cos(this.theta);

        this.size = Math.random() * 4 + 0.5 * this.pixelRatio;
        this.color = color;
    }
    update() {
        this.phi += this.v.x;
        this.theta += this.v.y;
        this.x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
        this.y = this.r * Math.cos(this.phi);
        this.z = this.r * Math.sin(this.phi) * Math.cos(this.theta);
    }
}
