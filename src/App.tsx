import React from 'react';
import Scene from './Scene';

const BASE = 1.5;

function App() {
  const [scene, setScene] = React.useState({
    width: 800,
    height: 800,
    zoom: 1.0,
    center: { x: 0.0, y: 0.0 },
    colorD: {
      r: 0.1,
      g: 0.2,
      b: 0.3
    }
  })
  const onChangeR = (event: any) => {
    setScene({ ...scene, colorD: { ...scene.colorD, r: Number(event.target.value) } })
  };
  const onChangeG = (event: any) => {
    setScene({ ...scene, colorD: { ...scene.colorD, g: Number(event.target.value) } })
  };
  const onChangeB = (event: any) => {
    setScene({ ...scene, colorD: { ...scene.colorD, b: Number(event.target.value) } })
  };
  const onChangeZoom = (event: any) => {
    setScene({ ...scene, zoom: BASE ** Number(event.target.value) })
  };

  const onDrag = (dx: number, dy: number) => {
    const center = scene.center;
    const adjustX = dx / scene.width / scene.zoom;
    const adjustY = - dy / scene.height / scene.zoom;
    center.x -= adjustX;
    center.y -= adjustY;
    setScene({ ...scene, center });
  }

  return (
    <div>
      <div>
        <input type="range" min="0" max="1" step="0.01" value={scene.colorD.r} onChange={onChangeR} />
      </div>
      <div>
        <input type="range" min="0" max="1" step="0.01" value={scene.colorD.g} onChange={onChangeG} />
      </div>
      <div>
        <input type="range" min="0" max="1" step="0.01" value={scene.colorD.b} onChange={onChangeB} />
      </div>
      <div>
        <input type="range" min="-4.0" max="20.0" step="1" value={Math.log(scene.zoom) / Math.log(BASE)} onChange={onChangeZoom} />
      </div>
      <Scene scene={scene} onDrag={(dx, dy) => onDrag(dx, dy)} />
    </div>
  );
}

export default App;
