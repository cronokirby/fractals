import React from 'react';
import Scene from './Scene';

const BASE = 1.5;

function App() {
  const [scene, setScene] = React.useState({
    width: 1920,
    height: 1080,
    zoom: 1.0,
    center: { x: 0.0, y: 0.0 },
    colorD: {
      r: 0.1,
      g: 0.2,
      b: 0.3
    },
    colorC: 4.0,
    juliaC: {
      x: 0.35,
      y: -0.02
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
  const onChangeC = (event: any) => {
    setScene({ ...scene, colorC: Number(event.target.value) })
  };
  const onChangeJuliaCx = (event: any) => {
    setScene({ ...scene, juliaC: {...scene.juliaC, x: Number(event.target.value) }})
  };
  const onChangeJuliaCy = (event: any) => {
    setScene({ ...scene, juliaC: {...scene.juliaC, y: Number(event.target.value) }})
  };
  const onChangeZoom = (event: any) => {
    setScene({ ...scene, zoom: BASE ** Number(event.target.value) })
  };

  const onDrag = (dx: number, dy: number) => {
    const center = scene.center;
    const adjustX = dx / scene.height / scene.zoom;
    const adjustY = - dy / scene.height / scene.zoom;
    center.x -= adjustX;
    center.y -= adjustY;
    setScene({ ...scene, center });
  }

  const onScroll = (forward: boolean) => {
    const adjust = forward ? BASE : 1 / BASE;
    setScene({ ...scene, zoom: scene.zoom * adjust })
  }

  const ref = React.useRef(null as HTMLDivElement | null);

  const resize = () => {
    if (!ref.current) {
      return;
    }
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    if (scene.width !== width || scene.height !== height) {
      setScene({ ...scene, width, height });
    }
  }

  React.useEffect(() => {
    resize();
  }, [ref]);

  React.useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);


  return (
    <div>
      <div className="absolute font-mono text-white font-bold text-lg m-2 space-y-2">
        <div className="bg-gray-900 bg-opacity-50 p-2 rounded">
          <h2>Colors</h2>
          <div className="flex items-center space-x-2">
            <span>D1</span>
            <input type="range" min="0" max="1" step="0.01" value={scene.colorD.r} onChange={onChangeR} />
          </div>
          <div className="flex items-center space-x-2">
            <span>D2</span>
            <input type="range" min="0" max="1" step="0.01" value={scene.colorD.g} onChange={onChangeG} />
          </div>
          <div className="flex items-center space-x-2">
            <span>D3</span>
            <input type="range" min="0" max="1" step="0.01" value={scene.colorD.b} onChange={onChangeB} />
          </div>
          <div className="flex items-center space-x-2">
            <span>C</span>
            <input type="range" min="0.0" max="8.0" step="0.01" value={scene.colorC} onChange={onChangeC} />
          </div>
        </div>
        <div className="bg-gray-900 bg-opacity-50 p-2 rounded">
          <div className="flex items-center space-x-2">
            <span>Zoom</span>
            <input type="range" min="-4.0" max="20.0" step="1" value={Math.log(scene.zoom) / Math.log(BASE)} onChange={onChangeZoom} />
          </div>
        </div>
        <div className="bg-gray-900 bg-opacity-50 p-2 rounded">
          <h2>Julia Parameters</h2>
          <div className="flex items-center space-x-2">
            <span>X</span>
            <input type="range" min="-1.0" max="1.0" step="0.01" value={scene.juliaC.x} onChange={onChangeJuliaCx} />
          </div>
          <div className="flex items-center space-x-2">
            <span>Y</span>
            <input type="range" min="-1.0" max="1" step="0.01" value={scene.juliaC.y} onChange={onChangeJuliaCy} />
          </div>
        </div>
      </div>
      <div className="h-screen w-full" ref={ref}>
        <Scene scene={scene} onDrag={(dx, dy) => onDrag(dx, dy)} onScroll={forward => onScroll(forward)} />
      </div>
    </div>
  );
}

export default App;
