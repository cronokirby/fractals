import React from 'react';
import Scene from './Scene';

function App() {
  const [scene, setScene] = React.useState({
    width: 900,
    height: 800,
    zoom: 1.0,
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
    setScene({ ...scene, zoom: Number(event.target.value) })
  };

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
        <input type="range" min="0.5" max="20.0" step="0.01" value={scene.zoom} onChange={onChangeZoom} />
      </div>
      <Scene {...scene} />
    </div>
  );
}

export default App;
