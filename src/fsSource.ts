const fragmentShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  void main() {
    vec2 st = gl_FragCoord.xy / 600.0;
	  gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
  }
`
export default fragmentShader;
