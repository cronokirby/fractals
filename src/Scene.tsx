import React from 'react';
import vsSource from './vsSource';
import fsSource from './fsSource';

export interface SceneInfo {
  width: number;
  height: number;
  zoom: number;
  center: { x: number, y: number };
  colorD: { r: number, g: number, b: number };
  colorC: number;
  juliaC: { x: number, y: number };
}

interface Buffers {
  position: WebGLBuffer;
}

function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("shader is null");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function initShaderProgram(gl: WebGLRenderingContext): WebGLProgram {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  if (!shaderProgram) {
    throw new Error("shader program is null");
  }
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(`An error occurred compiling the shaders: ${gl.getProgramInfoLog(shaderProgram)}`)
  }

  return shaderProgram;
}

function initBuffers(gl: WebGLRenderingContext) {
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) {
    throw new Error("Failed to intialize position buffer");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    position: positionBuffer
  }
}

interface AttribLocations {
  vertexPosition: number;
}

interface UniformLocations {
  uResolution: WebGLUniformLocation;
  uColorD: WebGLUniformLocation;
  uColorC: WebGLUniformLocation;
  uCenter: WebGLUniformLocation;
  uJuliaC: WebGLUniformLocation;
  uZoom: WebGLUniformLocation;
}

interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: AttribLocations;
  uniformLocations: UniformLocations;
}


class GLContext {
  private constructor(private gl: WebGLRenderingContext, private programInfo: ProgramInfo, private buffers: Buffers) {
  }

  static init(gl: WebGLRenderingContext): GLContext {
    const shaderProgram = initShaderProgram(gl);
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        uResolution: gl.getUniformLocation(shaderProgram, 'uResolution'),
        uColorD: gl.getUniformLocation(shaderProgram, 'uColorD'),
        uColorC: gl.getUniformLocation(shaderProgram, 'uColorC'),
        uCenter: gl.getUniformLocation(shaderProgram, 'uCenter'),
        uJuliaC: gl.getUniformLocation(shaderProgram, 'uJuliaC'),
        uZoom: gl.getUniformLocation(shaderProgram, 'uZoom')
      }
    } as ProgramInfo;
    const buffers = initBuffers(gl);
    return new GLContext(gl, programInfo, buffers);
  }

  draw(scene: SceneInfo) {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);

    // Clear the canvas before we start drawing on it.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 2;  // pull out 2 values per iteration
      const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
      const normalize = false;  // don't normalize
      const stride = 0;         // how many bytes to get from one set of values to the next
      // 0 = use type and numComponents above
      const offset = 0;         // how many bytes inside the buffer to start from
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
      this.gl.vertexAttribPointer(
        this.programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      this.gl.enableVertexAttribArray(
        this.programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing
    this.gl.useProgram(this.programInfo.program);

    // Set the shader uniforms
    this.gl.uniform2fv(this.programInfo.uniformLocations.uResolution, [scene.width, scene.height])
    this.gl.uniform3fv(this.programInfo.uniformLocations.uColorD, [scene.colorD.r, scene.colorD.g, scene.colorD.b]);
    this.gl.uniform1f(this.programInfo.uniformLocations.uColorC, scene.colorC);
    this.gl.uniform2fv(this.programInfo.uniformLocations.uCenter, [scene.center.x, scene.center.y]);
    this.gl.uniform2fv(this.programInfo.uniformLocations.uJuliaC, [scene.juliaC.x, scene.juliaC.y]);
    this.gl.uniform1f(this.programInfo.uniformLocations.uZoom, scene.zoom);

    // Draw everything
    {
      const offset = 0;
      const vertexCount = 4;
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }
}


function initCtx(canvas: HTMLCanvasElement): GLContext | null {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return null;
  }

  return GLContext.init(gl);
}

interface Props {
  scene: SceneInfo;
  onDrag(dx: number, dy: number): void;
  onScroll(forward: boolean): void;
}

export default function Scene({ scene, onDrag, onScroll }: Props) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = React.useState<GLContext | null>(null);
  const [dragStart, setDragStart] = React.useState(null as null | { x: number, y: number });
  React.useEffect(() => {
    if (ref.current !== null) {
      const ctx = initCtx(ref.current);
      setCtx(() => ctx);
    }
  }, [ref]);
  React.useEffect(() => {
    if (ctx) {
      ctx.draw(scene);
    }
  }, [ctx, scene])
  const onMouseDown = (event: React.MouseEvent) => {
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  const onMouseMove = (event: React.MouseEvent) => {
    if (!dragStart) {
      return;
    }
    onDrag(event.clientX - dragStart.x, event.clientY - dragStart.y);
    setDragStart({ x: event.clientX, y: event.clientY });
  };
  const onMouseUp = (event: React.MouseEvent) => {
    setDragStart(null);
  };
  const onWheel = (event: React.WheelEvent) => {
    onScroll(event.deltaY < 0);
  };
  return <canvas
    width={scene.width}
    height={scene.height} ref={ref}
    onMouseMove={e => onMouseMove(e)}
    onMouseDown={e => onMouseDown(e)}
    onMouseUp={e => onMouseUp(e)}
    onWheel={e => onWheel(e)} />
}