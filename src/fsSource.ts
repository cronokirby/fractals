const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec2 uResolution;

  #define N 64.
  #define B 4.

  float iterate(vec2 p) {
    vec2 z = vec2(0);
    vec2 c = p;
    float i;
    for (float j = 0.; j < N; j++) {
      i = j;
      z = mat2(z, -z.y, z.x) * z + c;
      if (dot(z, z) > B * B) {
        break;
      }
    }
    return i + 1.;
  }

  void main() {
    vec2 uv = 1.2 * (2. * gl_FragCoord.xy - uResolution) / uResolution.y - vec2(.4, 0.);

    float n = iterate(uv) / N;
    if (n == 1.) {
      n = 0.;
    }
	  gl_FragColor = vec4(vec3(n), 1.0);
  }
`
export default fragmentShader;
