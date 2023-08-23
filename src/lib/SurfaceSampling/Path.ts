// @ts-nocheck
import * as THREE from "three";

export class Path {
  sampler: any;
  tempPosition: THREE.Vector3;
  constructor(sampler: any, materials: any[], index: number) {
    this.tempPosition = new THREE.Vector3();

    this.sampler = sampler;
    this.geometry = new THREE.BufferGeometry();
    this.material = materials[index % 4];
    this.line = new THREE.Line(this.geometry, this.material);
    this.vertices = [];

    sampler.sample(this.tempPosition);
    this.previousPoint = this.tempPosition.clone();
  }
  update() {
    let pointFound = false;
    while (!pointFound) {
      this.sampler.sample(this.tempPosition);
      if (this.tempPosition.distanceTo(this.previousPoint) < 0.1) {
        this.vertices.push(this.tempPosition.x, this.tempPosition.y, this.tempPosition.z);
        this.previousPoint = this.tempPosition.clone();
        pointFound = true;
      }
    }
    this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.vertices, 3));
  }
}