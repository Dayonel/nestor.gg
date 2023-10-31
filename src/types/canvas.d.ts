declare global {
    interface HTMLCanvasElement {
        resize(renderer: THREE.WebGLRenderer, camera: PerspectiveCamera): void;
    }
}

HTMLCanvasElement.prototype.resize = function (renderer: THREE.WebGLRenderer, camera: PerspectiveCamera): void {
    const fovLandscape = 70;
    const fovPortrait = 105;

    if (this.clientHeight > this.clientWidth) {
        camera.fov = fovPortrait;
    } else {
        camera.fov = fovLandscape;
    }

    camera.aspect = this.clientWidth / this.clientHeight;
    camera.updateProjectionMatrix();
    const pixelRatio = window.devicePixelRatio;
    const width = (this.clientWidth * pixelRatio) | 0;
    const height = (this.clientHeight * pixelRatio) | 0;
    renderer.setSize(width, height, false);
}

export { };
