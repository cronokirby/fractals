const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform vec2 uResolution;
  uniform vec2 uCenter;
  uniform vec3 uColorD;
  uniform float uColorC;
  uniform float uZoom;
  uniform vec2 uJuliaC;
  uniform int uFractalType;

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

  vec2 cart2polar(vec2 cart) {
    return vec2(atan(cart.y, cart.x), length(cart));
  }

  
  vec2 c_ln(vec2 z) {
      vec2 polar = cart2polar(z);
      return vec2(log(polar.y), polar.x);
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

  float iterate3(vec2 p) {
    vec2 z = p;
    float dist = 1e20;
    for (float j = 0.; j < N; j++) {
      z = c_mul(z, z) + uJuliaC;
      vec2 d = z - vec2(1.0, 1.0);
      dist = min(dist, abs(2.0 - dot(d, d)));
    }
    if (dist > 1.0) {
      return 1.0;
    }
    return dist;
  }

  float iterate4(vec2 p) {
    vec2 z = p;
    float dist = 1e20;
    for (float j = 0.; j < N; j++) {
      z = c_mul(z, z) + uJuliaC;
      vec2 d = z - vec2(1.0, 0.0);
      dist = min(dist, max(abs(d.x), abs(d.y)));
    }
    return log(dist + 1.0);
  }

  float iterate(vec2 p) {
    vec2 z;
    vec2 c;
    if (uFractalType == 0) {
      // Mandelbrot
      z = vec2(0.0);
      c = p;
    } else {
      // Julia
      z = p;
      c = uJuliaC;
    }
    float i;
    for (float j = 0.; j < N; j++) {
      i = j;
      z = c_mul(z, z) + c;
      float d = dot(z, z);
      if (dot(z, z) > B * B) {
        break;
      }
    }
    return (i - log(log(dot(z, z)) / log(B)) / log(2.0)) / N;
  }

  float iterate2(vec2 p) {
    vec2 z = p;
    vec2 c = uJuliaC;
    float i;
    for (float j = 0.; j < N; j++) {
      i = j;
      z = c_mul(z, z) + c;
      float d = dot(z, z);
      if (dot(z, z) > B * B) {
        break;
      }
    }
    return (i - log(log(dot(z, z)) / log(B)) / log(2.0)) / N;
  }

  void main() {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.6);
    vec3 c = vec3(uColorC);

    vec3 color = vec3(0);
    float ratio = uResolution.x / uResolution.y;

    for (float i = 0.0; i < SS; i++) {
      vec2 uv = uCenter + (((gl_FragCoord.xy + random2()) / uResolution.y) - vec2(0.5 * ratio, 0.5)) / uZoom;
      float r = iterate(uv);

      color += palette(r, a, b, c, uColorD);
    }

	  gl_FragColor = vec4(color / SS, 1.0);
  }
`
export default fragmentShader;
