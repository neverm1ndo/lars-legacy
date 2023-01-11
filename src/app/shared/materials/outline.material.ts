import { ShaderMaterial, Color, BackSide } from "three"
import outlineVert from '../shaders/outline.vert';
import outlineFrag from '../shaders/outline.frag';

export const outlineMaterial = new ShaderMaterial({
    uniforms: {
        color: {
            value: new Color('#f00'),
        },
        opacity: { value: 1.0 },
        outline: { value: 0.2 },
    },
    vertexShader: outlineVert,
    fragmentShader: outlineFrag,
    side: BackSide
});