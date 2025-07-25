"use client";

import Particles from "@tsparticles/react";
import { useCallback, useMemo } from 'react'; // Import useCallback, useMemo
import { loadFireflyPreset } from 'tsparticles-preset-firefly';
import { loadAll } from "@tsparticles/all"; // Import loadAll

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // console.log("Particles engine starting to load...");
    // Load the full engine (all shapes, updaters, interactors, etc.)
    await loadAll(engine);
    // Load the firefly preset
    await loadFireflyPreset(engine);
    // console.log("Particles engine and preset loaded.");
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log("Particles container loaded:", container);
  }, []);

  const particleOptions = useMemo(
    () => ({
    preset: "firefly", // We can still specify the preset here, init loads its components
    background: {
      color: {
        value: "transparent",
      },
    },
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffd700",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.8,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.5,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 100,
        color: "#1a1a1a",
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
      trail: {
        enable: true,
        length: 5,
        fill: {
            color: "#0a0a0a"
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
          mode: "repulse",
        },
        onclick: {
          enable: false,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 0.8,
          speed: 3,
        },
        repulse: {
          distance: 100,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  }),
  [],
);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={particleOptions}
      className="fixed top-0 left-0 w-full h-full z-[-1]"
    />
  );
};

export default ParticleBackground;
