declare global {
    interface HTMLCanvasElement {
        resize(renderer: THREE.WebGLRenderer, camera: PerspectiveCamera): void;
    }
}

HTMLCanvasElement.prototype.resize = function (renderer: THREE.WebGLRenderer, camera: PerspectiveCamera): void {
    camera.aspect = this.clientWidth / this.clientHeight;
    camera.updateProjectionMatrix();
    const pixelRatio = window.devicePixelRatio;
    const width = (this.clientWidth * pixelRatio) | 0;
    const height = (this.clientHeight * pixelRatio) | 0;
    renderer.setSize(width, height, false);

    console.log('resize');
}

export { };
