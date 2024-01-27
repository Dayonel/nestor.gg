declare global {
    interface HTMLElement {
        inViewport(): boolean;
    }
}

HTMLElement.prototype.inViewport = function (): boolean {
    var rect = this.getBoundingClientRect();

    var verticalInView = rect.top <= 0 && rect.bottom >= 0;
    var horizontalInView = rect.left <= 0 && rect.right >= 0;

    return verticalInView && horizontalInView;
}

export { };