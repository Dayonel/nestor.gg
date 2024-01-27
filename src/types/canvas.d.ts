declare global {
    interface HTMLCanvasElement {
        resize(renderer: THREE.WebGLRenderer, camera: PerspectiveCamera): void;
    }

    interface HTMLElement {
        inViewport(): boolean;
    }
}

HTMLCanvasElement.prototype.resize = function (renderer: THREE.WebGLRenderer, camera: PerspectiveCamera): void {
    camera.aspect = this.clientWidth / this.clientHeight;
    camera.updateProjectionMatrix();
    const width = this.clientWidth | 0;
    const height = this.clientHeight | 0;
    renderer.setSize(width, height, false);
}

export { };