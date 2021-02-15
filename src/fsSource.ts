const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec2 uResolution;

  #define N 64.
  #define B 4.

  vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
  }

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
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.0, 0.1, 0.2);
    vec3 color = palette(n + 0.5, a, b, c, d);
	  gl_FragColor = vec4(color, 1.0);
  }
`
export default fragmentShader;
