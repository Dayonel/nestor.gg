import { Object3D } from "three";

export class SphereDTO extends Object3D implements SphereDTO {
    constructor(time: boolean, rotationX: number, rotationY: number) {
        super();

        this.time = time;
        this.rotationX = rotationX;
        this.rotationY = rotationY;
    }
}

export interface SphereDTO {
    time: boolean;
    rotationX: number;
    rotationY: number;
}