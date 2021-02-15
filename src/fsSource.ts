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

  vec2 c_mul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }

  vec2 c_exp(vec2 z) {
    return exp(z.x) * vec2(cos(z.y), sin(z.y));
  }

  float cosh(float x) {
    return (exp(x) + exp(-x)) / 2.0;
  }

  float sinh(float x) {
    return (exp(x) - exp(-x)) / 2.0;
  }

  vec2 c_sin(vec2 cart) {
    float re = sin(cart.x) * cosh(cart.y);
    float im = cos(cart.x) * sinh(cart.y);
    return vec2(re, im);
  }

  float iterate(vec2 p) {
    vec2 z = p;
    vec2 c = vec2(0.28, -0.02);
    float i;
    for (float j = 0.; j < N; j++) {
      i = j;
      z = c_mul(z, c_mul(z, z)) + c;
      float d = dot(z, z);
      if (d < 0.05) {
        return 1.0 - d / 0.05;
      }
    }
    return 0.0;
  }

  void main() {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.6);
    vec3 c = vec3(3.0);

    vec3 color = vec3(0);
    float ratio = uResolution.x / uResolution.y;

    for (float i = 0.0; i < SS; i++) {
      vec2 uv = uCenter + (((gl_FragCoord.xy + random2()) / uResolution.y) - vec2(0.5 * ratio, 0.5)) / uZoom;
      float n = iterate(uv);

      color += vec3(n, n, n);
    }

	  gl_FragColor = vec4(color / SS, 1.0);
  }
`
export default fragmentShader;
