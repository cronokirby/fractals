import React from 'react';

interface CanvasProps {
  width: number;
  height: number;
}

function initCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export default function Canvas({ width, height }: CanvasProps) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    if (ref.current !== null) {
      initCanvas(ref.current, width, height);
    }
  }, [ref]);
  return <canvas width={width} height={height} ref={ref}></canvas>
}