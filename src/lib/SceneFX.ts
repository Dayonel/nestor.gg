// @ts-ignore
import * as THREE from "three";
import { AnimationFX } from "./AnimationFX";

export class SceneFX extends AnimationFX {
    start: number;
    end: number;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderTarget: THREE.WebGLRenderTarget;
    cameraInitialPos: THREE.Vector3;
    fovLandscape = 50;
    fovPortrait = 70;

    constructor(start: number, end: number,
        canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderTarget,
        width: number, height: number,
        animationScripts: { start: number; end: number; func: () => void }[] =
            []) {
        super(animationScripts);

        this.start = start;
        this.end = end;

        this.scene = new THREE.Scene();
        // camera
        this.camera = new THREE.PerspectiveCamera(
            this.fovLandscape,
            width / height,
            0.01,
            200
        );
        this.camera.position.set(0, 4, 30);
        this.scene.add(this.camera);

        this.renderTarget = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType });

        this.cameraInitialPos = this.camera.position.clone();

        this.resize(canvas, renderer);
    }

    resize = (canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderTarget) => {
        if (canvas.clientHeight > canvas.clientWidth) this.camera.fov = this.fovPortrait;
        else this.camera.fov = this.fovLandscape;

        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        const pixelRatio = window.devicePixelRatio;
        const width = (canvas.clientWidth * pixelRatio) | 0;
        const height = (canvas.clientHeight * pixelRatio) | 0;
        renderer.setSize(width, height, false);
    };

    render = (renderer: THREE.WebGLRenderer, target: boolean, scrollPercent: number) => {
        if (target) {
            renderer.setRenderTarget(this.renderTarget);
            renderer.clear();
            renderer.render(this.scene, this.camera);
        } else {
            renderer.setRenderTarget(null);
            renderer.render(this.scene, this.camera);
        }

        this.animationScripts.forEach((a) => {
            a.func();
        });
    };
}