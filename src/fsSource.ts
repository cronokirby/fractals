const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform vec3 uColorD;
  uniform float uZoom;

  #define N 64.
  #define B 4.
  #define SS 16.

  float random(in vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.989, 78.233))) * 43758.543);
  }

  float rseed = 0.;
  vec2 random2() {
    vec2 seed = vec2(rseed++, rseed++);
    return vec2(random(seed + 0.342), random(seed + 0.756));
  }

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
    return i + 1.0 - log(log(dot(z, z)) / log(B)) / log(2.0);
  }

  void main() {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.6);
    vec3 c = vec3(3.0);

    vec3 color = vec3(0);
    float ratio = uResolution.x / uResolution.y;

    float adjustedN = N * uZoom;
    for (float i = 0.0; i < SS; i++) {
      vec2 uv = uCenter + (((gl_FragCoord.xy + random2()) / uResolution) - vec2(0.5));
      float n = iterate(uv) / N;

      color += palette(n + 0.5, a, b, c, uColorD);
      //color += vec3(uv.x, uv.y, 0.0);
    }

	  gl_FragColor = vec4(color / SS, 1.0);
  }
`
export default fragmentShader;
