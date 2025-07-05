import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0, // behind the hero content
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false }, // disable fullscreen
          particles: {
            number: { value: 15, density: { enable: true, value_area: 800 } },
            color: { value: '#8062d6' },
            shape: { type: 'star', polygon: { nb_sides: 5 } },
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#ffffff',
              opacity: 0.4,
              width: 1,
            },
            move: { enable: true, speed: 6, out_mode: 'out' },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: {
              repulse: { distance: 200, duration: 0.4 },
              push: { particles_nb: 4 },
            },
          },
          retina_detect: true,
        }}
      />
    </div>
  );
};

export default ParticlesBackground;
