// @ts-nocheck
import * as THREE from "three";

export class Sparkle extends THREE.Vector3 {
    pixelRatio: number;
    constructor(pixelRatio: number) {
        super();
        this.pixelRatio = pixelRatio;
    }
    setup(origin: any, color: any) {
        this.x = origin.x;
        this.y = origin.y;
        this.z = origin.z;
        this.v = new THREE.Vector3();
        /* X Speed */
        this.v.x = THREE.MathUtils.randFloat(0.001, 0.006);
        this.v.x *= Math.random() > 0.5 ? 1 : -1;
        /* Y Speed */
        this.v.y = THREE.MathUtils.randFloat(0.001, 0.006);
        this.v.y *= Math.random() > 0.5 ? 1 : -1;
        /* Z Speed */
        this.v.z = THREE.MathUtils.randFloat(0.001, 0.006);
        this.v.z *= Math.random() > 0.5 ? 1 : -1;

        this.size = Math.random() * 4 + 0.5 * this.pixelRatio;
        this.slowDown = 0.4 + Math.random() * 0.58;
        this.color = color;
    }
    update() {
        if (this.v.x > 0.001 || this.v.y > 0.001 || this.v.z > 0.001) {
            this.add(this.v);
            this.v.multiplyScalar(this.slowDown);
        }
    }
}