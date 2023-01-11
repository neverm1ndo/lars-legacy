export default `uniform float outline;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * outline, 1.0);
}` as string;