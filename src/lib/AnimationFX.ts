export class AnimationFX {
    animationScripts: { start: number; end: number; func: () => void }[] =
        [] = [];

    constructor(animationScripts: { start: number; end: number; func: () => void }[] =
        [] = []) {
        this.animationScripts = animationScripts;
    }

    static lerp = (x: number, y: number, a: number): number => {
        return (1 - a) * x + a * y;
    };

    static scalePercent = (start: number, end: number, scrollPercent: number) => {
        return (scrollPercent - start) / (end - start);
    };
}
