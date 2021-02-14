import React from 'react';

interface CanvasProps {
  width: number;
  height: number;
}

function initCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = "red";
  ctx.fill();
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