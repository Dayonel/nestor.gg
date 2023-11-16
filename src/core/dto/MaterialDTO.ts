import type { Material } from "three";

// Applies a material to a mesh matches the name
export class MaterialDTO implements MaterialDTO {
    constructor(value: Material, key?: string, ) {
        this.value = value;
        this.key = key;
    }
}

export interface MaterialDTO {
    key?: string;
    value: Material;
}