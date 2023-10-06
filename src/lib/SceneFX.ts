// @ts-ignore
import * as THREE from "three";

export class SceneFX {
    start: number;
    end: number;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderTarget: THREE.WebGLRenderTarget;
    cameraInitialPos: THREE.Vector3;
    fovLandscape = 70;
    fovPortrait = 105;

    constructor(start: number, end: number,
        canvas: HTMLCanvasElement, renderer: THREE.WebGLRenderTarget,
        width: number, height: number, far: number) {

        this.start = start;
        this.end = end;

        this.scene = new THREE.Scene();
        // camera
        this.camera = new THREE.PerspectiveCamera(
            this.fovLandscape,
            width / height,
            0.01,
            far
        );
        this.camera.position.set(0, 0, 0);
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

    render = (funcs: { func: () => void }[]) => {
        funcs.forEach(f => {
            f.func();
        });
    };
}