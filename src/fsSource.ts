const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif


  uniform vec2 uResolution;

  #define N 64.
  #define B 4.

  void main() {
    vec2 uv = (2. * gl_FragCoord.xy - uResolution) / uResolution.y;

    vec2 z = vec2(0);
    vec2 c = uv;

    float i;
    for (float j = 0.; j < N; j++) {
      i = j;
      z = mat2(z, -z.y, z.x) * z + c;
      if (dot(z, z) > B * B) break;
    }
    if (i == N - 1.) {
      i = 0.;
    }

	  gl_FragColor = vec4(vec3(i / N), 1.0);
  }
`
export default fragmentShader;
