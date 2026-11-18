import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { computeScrollytellingStageState } from '../utils/validation';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollytellingCanvasProps {
  hoveredServiceIndex: number | null;
  activeProcessStep: number;
  onSceneReady?: () => void;
}

function createBeveledSlabGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
  bevelSegments: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const w = Math.max(0.02, width - radius * 2);
  const h = Math.max(0.02, height - radius * 2);
  shape.moveTo(-w / 2, -h / 2 - radius);
  shape.lineTo(w / 2, -h / 2 - radius);
  shape.absarc(w / 2, -h / 2, radius, -Math.PI / 2, 0, false);
  shape.lineTo(w / 2 + radius, h / 2);
  shape.absarc(w / 2, h / 2, radius, 0, Math.PI / 2, false);
  shape.lineTo(-w / 2, h / 2 + radius);
  shape.absarc(-w / 2, h / 2, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(-w / 2 - radius, -h / 2);
  shape.absarc(-w / 2, -h / 2, radius, Math.PI, (Math.PI * 3) / 2, false);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - radius * 2),
    bevelEnabled: true,
    bevelSegments,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius,
  });
  geo.center();
  return geo;
}

export const ScrollytellingCanvas: React.FC<ScrollytellingCanvasProps> = ({
  hoveredServiceIndex,
  activeProcessStep,
  onSceneReady,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoveredServiceRef = useRef<number | null>(hoveredServiceIndex);
  const activeProcessRef = useRef<number>(activeProcessStep);

  useEffect(() => {
    hoveredServiceRef.current = hoveredServiceIndex;
  }, [hoveredServiceIndex]);

  useEffect(() => {
    activeProcessRef.current = activeProcessStep;
  }, [activeProcessStep]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobileViewport,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onSceneReady?.();
      return;
    }

    // Detect software WebGL (SwiftShader / llvmpipe / Mesa) to cap resolution & frame rate safely
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererString = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '')
      : '';
    const isSoftwareGl = /SwiftShader|Software|llvmpipe|Mesa OffScreen/i.test(rendererString);

    const dpr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';
    container.innerHTML = '';
    container.appendChild(canvas);

    const scene = new THREE.Scene();

    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];
    const texturesToDispose: THREE.Texture[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometriesToDispose.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materialsToDispose.push(m);
      return m;
    };

    // Always generate studio PMREM environment on every device so metallic bronze-gold
    // and sculpted architectural materials gleam with rich specular contrast
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    texturesToDispose.push(envTexture);
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      36,
      window.innerWidth / Math.max(window.innerHeight, 1),
      0.1,
      60
    );
    camera.position.set(0, 0.25, 6.2);

    // High-contrast 3-Point Studio Lighting Rig + Dynamic Focal Light
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfffaf0, 0xc8b294, 1.1);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e5, 2.85);
    keyLight.position.set(5.2, 7.5, 6.0);
    scene.add(keyLight);

    const bronzeRimLight = new THREE.DirectionalLight(0xd4a359, 2.1);
    bronzeRimLight.position.set(-5.5, 3.5, -4.0);
    scene.add(bronzeRimLight);

    const forestCounterLight = new THREE.DirectionalLight(0x2d5e4a, 1.35);
    forestCounterLight.position.set(0.0, -5.0, 3.5);
    scene.add(forestCounterLight);

    const focalPointLight = new THREE.PointLight(0xffdfad, 2.2, 12, 1.5);
    focalPointLight.position.set(1.8, 1.2, 2.6);
    scene.add(focalPointLight);

    // =========================================================================
    // HIGH-CONTRAST BRAND PALETTE MATERIALS
    // Designed to stand out boldly against the light #F7F3EC parchment canvas
    // =========================================================================
    const brushedBronzeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb08648,
        emissive: 0x3d2b12,
        emissiveIntensity: 0.14,
        roughness: 0.22,
        metalness: 0.84,
      })
    );

    const deepBronzeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x7c5a2b,
        emissive: 0x261a09,
        emissiveIntensity: 0.12,
        roughness: 0.28,
        metalness: 0.76,
      })
    );

    const highlightBronzeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd9ad66,
        emissive: 0xa68352,
        emissiveIntensity: 0.42,
        roughness: 0.16,
        metalness: 0.9,
      })
    );

    // Warm Amber-Champagne Glass with strong bevel definition
    const amberArchitecturalGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xdecbb1,
        emissive: 0x4a3820,
        emissiveIntensity: 0.08,
        roughness: 0.18,
        metalness: 0.12,
        transmission: isSoftwareGl ? 0 : 0.42,
        thickness: 0.5,
        ior: 1.52,
        transparent: true,
        opacity: 0.94,
        clearcoat: 0.85,
        clearcoatRoughness: 0.15,
      })
    );

    // Rich Warm Taupe-Stone Slab Material (distinctly darker than #F7F3EC background)
    const warmStoneSlabMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xcab698,
        roughness: 0.38,
        metalness: 0.18,
      })
    );

    // Deep Espresso-Walnut Architectural Material for high-contrast silhouette
    const charcoalEspressoMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2b221b,
        emissive: 0x120d0a,
        emissiveIntensity: 0.15,
        roughness: 0.34,
        metalness: 0.35,
      })
    );

    // Deep Forest Emerald Accent Material (#1E3F32)
    const forestAccentMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e3f32,
        emissive: 0x0b1f17,
        emissiveIntensity: 0.18,
        roughness: 0.32,
        metalness: 0.38,
      })
    );

    // Crisp, high-visibility architectural blueprint wireframes
    const blueprintWireMat = trackMat(
      new THREE.LineBasicMaterial({
        color: 0x6b4f28,
        transparent: true,
        opacity: 0.82,
      })
    );

    const blueprintDarkWireMat = trackMat(
      new THREE.LineBasicMaterial({
        color: 0x241f1c,
        transparent: true,
        opacity: 0.55,
      })
    );

    const blueprintForestWireMat = trackMat(
      new THREE.LineBasicMaterial({
        color: 0x1e3f32,
        transparent: true,
        opacity: 0.62,
      })
    );

    const radialSegs = isMobileViewport || isSoftwareGl ? 20 : 32;
    const bevelSegs = isMobileViewport || isSoftwareGl ? 1 : 2;

    // Master World Root
    const worldRoot = new THREE.Group();
    scene.add(worldRoot);

    // =========================================================================
    // CHAPTER 1 & 2: ARCHITECTURAL BALANCE & 9 DECONSTRUCTING LEDGER PLATES
    // =========================================================================
    const monolithAnchor = new THREE.Group();
    monolithAnchor.position.set(isMobileViewport ? 0.0 : 1.85, isMobileViewport ? -0.9 : 0.1, 0);
    worldRoot.add(monolithAnchor);

    // Balance Scale Assembly (Hero centerpiece that crowns the Monolith)
    const balanceAssembly = new THREE.Group();
    monolithAnchor.add(balanceAssembly);

    // Grounded Contact Shadow Disc under Plinth
    const shadowDisc = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.28, 1.35, 0.015, radialSegs)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x3b2f24,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        })
      )
    );
    shadowDisc.position.y = -1.33;
    balanceAssembly.add(shadowDisc);

    // Stepped Espresso & Brushed Bronze Plinth
    const basePlinth = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.04, 1.18, 0.16, radialSegs)),
      charcoalEspressoMat
    );
    basePlinth.position.y = -1.24;
    balanceAssembly.add(basePlinth);

    const basePlinthWire = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(basePlinth.geometry)),
      blueprintWireMat
    );
    basePlinth.add(basePlinthWire);

    const baseBronzeRing = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.9, 0.98, 0.09, radialSegs)),
      brushedBronzeMat
    );
    baseBronzeRing.position.y = -1.12;
    balanceAssembly.add(baseBronzeRing);

    const baseForestCollar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.72, 0.78, 0.06, radialSegs)),
      forestAccentMat
    );
    baseForestCollar.position.y = -1.05;
    balanceAssembly.add(baseForestCollar);

    // Central Fluted Pillar with Bronze Collar Rings
    const centralPillar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.085, 0.11, 2.48, radialSegs)),
      brushedBronzeMat
    );
    centralPillar.position.y = 0.06;
    balanceAssembly.add(centralPillar);

    const pillarCoreSleeve = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.115, 0.115, 0.9, 8)),
      charcoalEspressoMat
    );
    pillarCoreSleeve.position.y = 0.05;
    balanceAssembly.add(pillarCoreSleeve);

    const fulcrumApex = new THREE.Mesh(
      trackGeo(new THREE.OctahedronGeometry(0.22, 0)),
      highlightBronzeMat
    );
    fulcrumApex.position.y = 1.32;
    balanceAssembly.add(fulcrumApex);

    const fulcrumWire = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(fulcrumApex.geometry)),
      blueprintDarkWireMat
    );
    fulcrumApex.add(fulcrumWire);

    // Balance Beam & Suspended Assurance Pans
    const beamGroup = new THREE.Group();
    beamGroup.position.y = 1.16;
    balanceAssembly.add(beamGroup);

    const crossBeam = new THREE.Mesh(
      trackGeo(createBeveledSlabGeometry(2.55, 0.095, 0.11, 0.02, bevelSegs)),
      brushedBronzeMat
    );
    beamGroup.add(crossBeam);

    const crossBeamAccent = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(2.2, 0.03, 0.125)),
      charcoalEspressoMat
    );
    beamGroup.add(crossBeamAccent);

    const buildAssurancePan = (side: -1 | 1) => {
      const panGroup = new THREE.Group();
      panGroup.position.set(side * 1.15, 0, 0);

      const capKnob = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12)),
        charcoalEspressoMat
      );
      panGroup.add(capKnob);

      const rodGeo = trackGeo(new THREE.CylinderGeometry(0.013, 0.013, 0.82, 8));
      [-1, 1].forEach((zDir) => {
        const rod = new THREE.Mesh(rodGeo, deepBronzeMat);
        rod.position.set(0, -0.4, zDir * 0.16);
        rod.rotation.x = zDir * 0.19;
        panGroup.add(rod);
      });

      const trayOuter = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.42, 0.32, 0.075, radialSegs)),
        brushedBronzeMat
      );
      trayOuter.position.y = -0.8;
      panGroup.add(trayOuter);

      const trayRim = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.41, 0.018, 10, radialSegs)),
        charcoalEspressoMat
      );
      trayRim.rotation.x = Math.PI / 2;
      trayRim.position.y = -0.77;
      panGroup.add(trayRim);

      // Stacked Precision Weights inside each Balance Pan
      const weightBase = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.26, 0.28, 0.065, radialSegs)),
        side === -1 ? forestAccentMat : charcoalEspressoMat
      );
      weightBase.position.y = -0.73;
      panGroup.add(weightBase);

      const weightTop = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.17, 0.19, 0.055, radialSegs)),
        highlightBronzeMat
      );
      weightTop.position.y = -0.67;
      panGroup.add(weightTop);

      return panGroup;
    };

    const leftPan = buildAssurancePan(-1);
    const rightPan = buildAssurancePan(1);
    beamGroup.add(leftPan, rightPan);

    // Bold Architectural Astrolabe / Calibration Rings around Hero Monolith
    const outerBlueprintRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.36, 0.022, 12, radialSegs * 2)),
      brushedBronzeMat
    );
    outerBlueprintRing.rotation.set(Math.PI / 2.25, 0.26, 0);
    balanceAssembly.add(outerBlueprintRing);

    const innerBlueprintRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.14, 0.018, 10, radialSegs * 2)),
      forestAccentMat
    );
    innerBlueprintRing.rotation.set(Math.PI / 1.8, -0.35, 0.18);
    balanceAssembly.add(innerBlueprintRing);

    const verticalMeridianRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.26, 0.012, 10, radialSegs * 2)),
      charcoalEspressoMat
    );
    verticalMeridianRing.rotation.set(0.15, Math.PI / 4, 0);
    balanceAssembly.add(verticalMeridianRing);

    // 9 High-Contrast Architectural Ledger Plates
    // Alternating Deep Espresso, Warm Stone, Forest Emerald & Amber Glass with Brushed Bronze Spines
    interface LedgerPlateItem {
      group: THREE.Group;
      slabMesh: THREE.Mesh;
      spineMesh: THREE.Mesh;
      wireframe: THREE.LineSegments;
      heroPos: THREE.Vector3;
      heroRot: THREE.Euler;
      servicesPos: THREE.Vector3;
      servicesRot: THREE.Euler;
    }

    const ledgerPlates: LedgerPlateItem[] = [];
    const plateSlabGeo = trackGeo(createBeveledSlabGeometry(1.06, 0.135, 0.74, 0.022, bevelSegs));
    const plateSpineGeo = trackGeo(new THREE.BoxGeometry(0.075, 0.145, 0.76));
    const plateInlayGeo = trackGeo(new THREE.BoxGeometry(0.76, 0.142, 0.035));
    const plateEdgesGeo = trackGeo(new THREE.EdgesGeometry(plateSlabGeo));

    const slabMaterials = [
      charcoalEspressoMat,
      amberArchitecturalGlassMat,
      warmStoneSlabMat,
      forestAccentMat,
    ];

    for (let i = 0; i < 9; i++) {
      const plateGroup = new THREE.Group();

      const slabMesh = new THREE.Mesh(plateSlabGeo, slabMaterials[i % slabMaterials.length]);
      plateGroup.add(slabMesh);

      const spineMesh = new THREE.Mesh(plateSpineGeo, brushedBronzeMat);
      spineMesh.position.set(-0.5, 0, 0);
      plateGroup.add(spineMesh);

      // Metallic bronze-gold ledger ruling bar across each plate
      const inlayMesh = new THREE.Mesh(plateInlayGeo, highlightBronzeMat);
      inlayMesh.position.set(0.05, 0, 0.22);
      plateGroup.add(inlayMesh);

      const wireframe = new THREE.LineSegments(plateEdgesGeo, blueprintWireMat);
      plateGroup.add(wireframe);

      // Stacked monolith coordinates in Hero
      const heroY = -0.86 + i * 0.2;
      const heroRotY = (i % 2 === 0 ? 1 : -1) * 0.08 + i * 0.035;
      const heroPos = new THREE.Vector3(0, heroY, 0);
      const heroRot = new THREE.Euler(0.05, heroRotY, 0);

      // Deconstructed 3x3 floating matrix in Services — spread wider so plates frame the cards visibly
      const col = (i % 3) - 1; // -1, 0, 1
      const row = 1 - Math.floor(i / 3); // 1, 0, -1
      const servicesPos = new THREE.Vector3(
        col * (isMobileViewport ? 1.15 : 2.15) - (isMobileViewport ? 0 : 0.35),
        row * 1.18,
        (i % 2 === 0 ? -0.15 : 0.35) - Math.abs(col) * 0.15
      );
      const servicesRot = new THREE.Euler(0.32 + row * 0.1, -0.36 + col * 0.22, 0.06);

      plateGroup.position.copy(heroPos);
      plateGroup.rotation.copy(heroRot);

      monolithAnchor.add(plateGroup);
      ledgerPlates.push({
        group: plateGroup,
        slabMesh,
        spineMesh,
        wireframe,
        heroPos,
        heroRot,
        servicesPos,
        servicesRot,
      });
    }

    // =========================================================================
    // CHAPTER 3: FOUR INTERLOCKING VERTICAL PILLARS (IESBA ETHICAL PRINCIPLES)
    // 01. Integrity · 02. Independence · 03. Technical Excellence · 04. Confidentiality
    // =========================================================================
    const pillarsAnchor = new THREE.Group();
    pillarsAnchor.position.set(0.0, -3.5, -0.5);
    worldRoot.add(pillarsAnchor);

    const pillarShaftGeo = trackGeo(createBeveledSlabGeometry(0.44, 2.55, 0.44, 0.035, bevelSegs));
    const pillarCapGeo = trackGeo(createBeveledSlabGeometry(0.56, 0.15, 0.56, 0.025, bevelSegs));
    const pillarRingGeo = trackGeo(new THREE.TorusGeometry(0.34, 0.018, 10, 24));
    const pillarWireGeo = trackGeo(new THREE.EdgesGeometry(pillarShaftGeo));

    const pillarMaterials = [
      charcoalEspressoMat,
      warmStoneSlabMat,
      forestAccentMat,
      amberArchitecturalGlassMat,
    ];

    const pillarElements: THREE.Group[] = [];
    for (let pIdx = 0; pIdx < 4; pIdx++) {
      const pGroup = new THREE.Group();
      const spreadX = (pIdx - 1.5) * 0.96;
      const depthZ = pIdx % 2 === 0 ? -0.22 : 0.22;
      pGroup.position.set(spreadX, 0, depthZ);

      const shaft = new THREE.Mesh(pillarShaftGeo, pillarMaterials[pIdx]);
      pGroup.add(shaft);

      const topCap = new THREE.Mesh(pillarCapGeo, brushedBronzeMat);
      topCap.position.y = 1.32;
      pGroup.add(topCap);

      const bottomBase = new THREE.Mesh(pillarCapGeo, charcoalEspressoMat);
      bottomBase.position.y = -1.32;
      pGroup.add(bottomBase);

      const midCollar = new THREE.Mesh(pillarRingGeo, highlightBronzeMat);
      midCollar.rotation.x = Math.PI / 2;
      midCollar.position.y = 0;
      pGroup.add(midCollar);

      const wire = new THREE.LineSegments(pillarWireGeo, blueprintWireMat);
      pGroup.add(wire);

      // Interlocking horizontal bronze & espresso bridge bars
      if (pIdx < 3) {
        const bridge = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(0.98, 0.075, 0.075)),
          brushedBronzeMat
        );
        bridge.position.set(0.48, (pIdx - 1) * 0.48, 0);
        pGroup.add(bridge);
      }

      pillarsAnchor.add(pGroup);
      pillarElements.push(pGroup);
    }

    // Large Orbital Halo Ring uniting the Four Pillars
    const pillarsUnityRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(2.15, 0.02, 12, radialSegs * 2)),
      brushedBronzeMat
    );
    pillarsUnityRing.rotation.x = Math.PI / 2.15;
    pillarsUnityRing.position.y = -0.15;
    pillarsAnchor.add(pillarsUnityRing);

    // =========================================================================
    // CHAPTER 4: 3D ARCHITECTURAL TIMELINE RAIL WITH 4 GLOWING BRONZE-GOLD NODES
    // 01 Engage · 02 Plan · 03 Execute · 04 Report & Advise
    // =========================================================================
    const timelineAnchor = new THREE.Group();
    timelineAnchor.position.set(0, -3.5, -0.7);
    worldRoot.add(timelineAnchor);

    const railBeamUpper = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.032, 0.032, 6.8, 16)),
      brushedBronzeMat
    );
    railBeamUpper.rotation.z = Math.PI / 2;
    railBeamUpper.position.y = 0.06;
    timelineAnchor.add(railBeamUpper);

    const railBeamLower = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.022, 0.022, 6.8, 16)),
      charcoalEspressoMat
    );
    railBeamLower.rotation.z = Math.PI / 2;
    railBeamLower.position.y = -0.06;
    timelineAnchor.add(railBeamLower);

    interface TimelineNodeObj {
      group: THREE.Group;
      coreMesh: THREE.Mesh;
      haloMesh: THREE.Mesh;
      outerRingMesh: THREE.Mesh;
    }

    const timelineNodes: TimelineNodeObj[] = [];
    const nodeCoreGeo = trackGeo(new THREE.OctahedronGeometry(0.28, 0));
    const nodeCoreWireGeo = trackGeo(new THREE.EdgesGeometry(nodeCoreGeo));
    const nodeHaloGeo = trackGeo(new THREE.TorusGeometry(0.44, 0.024, 12, radialSegs));
    const nodeOuterRingGeo = trackGeo(new THREE.TorusGeometry(0.56, 0.014, 10, radialSegs));

    for (let nIdx = 0; nIdx < 4; nIdx++) {
      const nGroup = new THREE.Group();
      const nodeX = (nIdx - 1.5) * 1.95;
      nGroup.position.set(nodeX, 0, 0);

      const coreMesh = new THREE.Mesh(nodeCoreGeo, brushedBronzeMat);
      const coreWire = new THREE.LineSegments(nodeCoreWireGeo, blueprintDarkWireMat);
      coreMesh.add(coreWire);
      nGroup.add(coreMesh);

      const haloMesh = new THREE.Mesh(nodeHaloGeo, deepBronzeMat);
      nGroup.add(haloMesh);

      const outerRingMesh = new THREE.Mesh(nodeOuterRingGeo, forestAccentMat);
      outerRingMesh.rotation.y = Math.PI / 3;
      nGroup.add(outerRingMesh);

      const pedestal = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.32, 0.38, 0.12, radialSegs)),
        charcoalEspressoMat
      );
      pedestal.position.y = -0.56;
      nGroup.add(pedestal);

      timelineAnchor.add(nGroup);
      timelineNodes.push({ group: nGroup, coreMesh, haloMesh, outerRingMesh });
    }

    // =========================================================================
    // CHAPTER 5 & 6: ARCHITECTURAL BLUEPRINT GRID, COMPASS ROSE & AMBIENT 3D ARTIFACTS
    // =========================================================================
    const blueprintGridAnchor = new THREE.Group();
    blueprintGridAnchor.position.set(0, -1.5, -2.0);
    worldRoot.add(blueprintGridAnchor);

    // Stronger, clearly visible architectural grid lines
    const gridHelper = new THREE.GridHelper(22, 28, 0x8a6a3b, 0xb8a386);
    const gridMaterials = Array.isArray(gridHelper.material)
      ? gridHelper.material
      : [gridHelper.material];
    gridMaterials.forEach((m, idx) => {
      m.transparent = true;
      m.opacity = idx === 0 ? 0.52 : 0.36;
      trackMat(m);
    });
    trackGeo(gridHelper.geometry);
    blueprintGridAnchor.add(gridHelper);

    // Concentric Architectural Horizon Rings
    const horizonCompassRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(3.6, 0.022, 12, radialSegs * 2)),
      brushedBronzeMat
    );
    horizonCompassRing.rotation.x = Math.PI / 2;
    horizonCompassRing.position.y = 0.02;
    blueprintGridAnchor.add(horizonCompassRing);

    const horizonInnerRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(2.2, 0.016, 10, radialSegs * 2)),
      forestAccentMat
    );
    horizonInnerRing.rotation.x = Math.PI / 2;
    horizonInnerRing.position.y = 0.03;
    blueprintGridAnchor.add(horizonInnerRing);

    const horizonWireOctagon = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(new THREE.CylinderGeometry(2.8, 2.8, 0.06, 8))),
      blueprintForestWireMat
    );
    horizonWireOctagon.position.y = 0.04;
    blueprintGridAnchor.add(horizonWireOctagon);

    // =========================================================================
    // PERIPHERAL 3D FINANCIAL ARTIFACT CONSTELLATION (Flanking Left & Right Margins)
    // Ensures unmistakable 3D depth along the viewport edges across all scroll sections
    // =========================================================================
    const artifactFieldGroup = new THREE.Group();
    worldRoot.add(artifactFieldGroup);

    interface FloatingArtifact {
      mesh: THREE.Object3D;
      basePos: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      floatPhase: number;
    }

    const floatingArtifacts: FloatingArtifact[] = [];
    const coinGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.06, radialSegs));
    const coinWireGeo = trackGeo(new THREE.EdgesGeometry(coinGeo));
    const octGeo = trackGeo(new THREE.OctahedronGeometry(0.24, 0));
    const octWireGeo = trackGeo(new THREE.EdgesGeometry(octGeo));
    const ringArtifactGeo = trackGeo(new THREE.TorusGeometry(0.28, 0.022, 10, radialSegs));
    const ledgerBlockGeo = trackGeo(createBeveledSlabGeometry(0.42, 0.1, 0.32, 0.018, bevelSegs));
    const ledgerBlockWireGeo = trackGeo(new THREE.EdgesGeometry(ledgerBlockGeo));

    // Placed along the outer left (x: -3.75 to -4.25) and outer right (x: +3.75 to +4.25) viewport margins
    // so they frame the page with 3D depth without overlapping Hero headings or body copy
    const artifactConfigs = [
      { x: -3.85, y: 1.55, z: -1.8, type: 0 },
      { x: -4.15, y: -0.35, z: -2.1, type: 1 },
      { x: 3.95, y: -1.25, z: -1.8, type: 2 },
      { x: -3.75, y: -1.75, z: -1.6, type: 3 },
      { x: 4.05, y: 1.45, z: -2.0, type: 0 },
      { x: -4.2, y: 0.65, z: -2.2, type: 2 },
      { x: 3.85, y: 0.25, z: -1.9, type: 1 },
      { x: 4.15, y: -0.55, z: -2.1, type: 3 },
    ];

    artifactConfigs.forEach((cfg, idx) => {
      const holder = new THREE.Group();
      holder.position.set(cfg.x, cfg.y, cfg.z);

      if (cfg.type === 0) {
        // Beveled Bronze & Espresso Stacked Audit Coins
        const c1 = new THREE.Mesh(coinGeo, brushedBronzeMat);
        const c2 = new THREE.Mesh(coinGeo, charcoalEspressoMat);
        c2.position.set(0.04, 0.07, -0.02);
        const c3 = new THREE.Mesh(coinGeo, highlightBronzeMat);
        c3.position.set(-0.02, 0.14, 0.03);
        const cw = new THREE.LineSegments(coinWireGeo, blueprintWireMat);
        c1.add(cw);
        holder.add(c1, c2, c3);
      } else if (cfg.type === 1) {
        // Architectural Octahedron + Orbital Ring
        const oct = new THREE.Mesh(octGeo, idx % 2 === 0 ? forestAccentMat : brushedBronzeMat);
        const ow = new THREE.LineSegments(octWireGeo, blueprintWireMat);
        oct.add(ow);
        const ring = new THREE.Mesh(ringArtifactGeo, highlightBronzeMat);
        ring.rotation.x = Math.PI / 3;
        holder.add(oct, ring);
      } else if (cfg.type === 2) {
        // Double Gyroscope Calibration Rings
        const r1 = new THREE.Mesh(ringArtifactGeo, brushedBronzeMat);
        const r2 = new THREE.Mesh(ringArtifactGeo, charcoalEspressoMat);
        r2.scale.setScalar(0.76);
        r2.rotation.y = Math.PI / 2;
        holder.add(r1, r2);
      } else {
        // Miniature Sculpted Ledger Block
        const blk = new THREE.Mesh(
          ledgerBlockGeo,
          idx % 2 === 0 ? charcoalEspressoMat : warmStoneSlabMat
        );
        const bw = new THREE.LineSegments(ledgerBlockWireGeo, blueprintWireMat);
        blk.add(bw);
        holder.add(blk);
      }

      if (isMobileViewport) {
        holder.scale.setScalar(0.68);
      }

      artifactFieldGroup.add(holder);
      floatingArtifacts.push({
        mesh: holder,
        basePos: new THREE.Vector3(cfg.x, cfg.y, cfg.z),
        rotSpeed: new THREE.Vector3(
          0.18 + (idx % 3) * 0.06,
          0.24 + (idx % 2) * 0.08,
          0.12
        ),
        floatPhase: idx * 1.15,
      });
    });

    // =========================================================================
    // SCROLLTRIGGER + LENIS + UNIFIED GSAP.TICKER RENDER LOOP
    // =========================================================================
    const scrollState = { progress: 0 };

    let lenis: Lenis | null = null;
    if (!prefersReducedMotion && !isMobileViewport) {
      lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
    }

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: isSoftwareGl ? true : 1.2,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    // Pointer Parallax State
    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      pointerTarget.x = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      pointerTarget.y = -((e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = Math.max(window.innerHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Signal Preloader once fonts & initial 3D frame are compiled
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    renderer.render(scene, camera);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        onSceneReady?.();
      });
    } else {
      onSceneReady?.();
    }

    // Single Unified Render Loop driven exclusively by gsap.ticker
    let lastRenderTimeMs = 0;
    const lookAtVec = new THREE.Vector3(0, 0.08, 0);
    const currentCamPos = new THREE.Vector3(0, 0.2, 6.2);
    const currentLookTarget = new THREE.Vector3(0, 0.08, 0);

    const onTick = (timeSec: number) => {
      const timeMs = timeSec * 1000;
      if (lenis) {
        lenis.raf(timeMs);
      }

      // Throttle software WebGL in headless test environments so command queues never back up
      if (isSoftwareGl && timeMs - lastRenderTimeMs < 85) {
        return;
      }
      lastRenderTimeMs = timeMs;

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const rawScrollProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      const effectiveProgress = isSoftwareGl ? rawScrollProgress : scrollState.progress;

      const stageState = computeScrollytellingStageState(
        prefersReducedMotion ? 0 : effectiveProgress
      );

      const damp = isSoftwareGl ? 0.68 : 0.15;

      // Smooth pointer parallax
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * damp;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * damp;

      // Update Camera Position & LookAt Target
      const targetCamX = stageState.cameraPos[0] + pointerCurrent.x * 0.18;
      const targetCamY = stageState.cameraPos[1] + pointerCurrent.y * 0.12;
      const targetCamZ = stageState.cameraPos[2];

      currentCamPos.x += (targetCamX - currentCamPos.x) * damp;
      currentCamPos.y += (targetCamY - currentCamPos.y) * damp;
      currentCamPos.z += (targetCamZ - currentCamPos.z) * damp;
      camera.position.copy(currentCamPos);

      currentLookTarget.x += (stageState.lookAtTarget[0] - currentLookTarget.x) * damp;
      currentLookTarget.y += (stageState.lookAtTarget[1] - currentLookTarget.y) * damp;
      currentLookTarget.z += (stageState.lookAtTarget[2] - currentLookTarget.z) * damp;
      lookAtVec.copy(currentLookTarget);
      camera.lookAt(lookAtVec);

      const d = stageState.monolithDeconstruct;
      const mExit = stageState.monolithExit;

      // Dynamically anchor Hero Monolith to #hero-3d-frame bounds so it sits prominently in the Hero showcase box
      let heroAnchorX = 1.65;
      let heroAnchorY = 0.16;
      let heroFrameScale = 0.66;

      const heroFrameEl = document.getElementById('hero-3d-frame');
      if (heroFrameEl) {
        const rect = heroFrameEl.getBoundingClientRect();
        const w = Math.max(window.innerWidth, 1);
        const h = Math.max(window.innerHeight, 1);
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.55;
        const ndcX = (cx / w) * 2 - 1;
        const ndcY = -((cy / h) * 2 - 1);
        const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * currentCamPos.z;
        const visW = visH * (w / h);
        heroAnchorX = currentCamPos.x + ndcX * (visW * 0.5);
        heroAnchorY = currentCamPos.y + ndcY * (visH * 0.5);
        heroFrameScale = Math.max(0.5, Math.min(0.68, (rect.height / h) * 1.48));
      }

      // Keep the 9 deconstructed ledger plates visible throughout the entire Services section
      const servicesHoldExit =
        effectiveProgress < 0.34
          ? 0
          : Math.min(1, (effectiveProgress - 0.34) / 0.07);

      const targetMonolithX = THREE.MathUtils.lerp(heroAnchorX, 0.0, d);
      const targetMonolithY =
        THREE.MathUtils.lerp(heroAnchorY, 0.12, d) + servicesHoldExit * 3.8;
      const targetMonolithScale =
        THREE.MathUtils.lerp(heroFrameScale, 1.12, d) *
        Math.max(0.001, 1 - servicesHoldExit);

      monolithAnchor.position.x += (targetMonolithX - monolithAnchor.position.x) * damp;
      monolithAnchor.position.y += (targetMonolithY - monolithAnchor.position.y) * damp;
      monolithAnchor.scale.setScalar(targetMonolithScale);
      monolithAnchor.visible = servicesHoldExit < 0.98;

      // 1. Hero Balance Assembly: Gently oscillates in Hero, rises/fades back as Services deconstructs
      balanceAssembly.position.y = d * 2.4 + Math.sin(timeSec * 0.9) * 0.04 * (1 - d);
      balanceAssembly.rotation.y =
        timeSec * 0.18 * (1 - d * 0.7) + pointerCurrent.x * 0.3 * (1 - d);
      const scaleFactor = Math.max(0.001, 1 - d * 0.95);
      balanceAssembly.scale.setScalar(scaleFactor);
      balanceAssembly.visible = d < 0.96;

      const beamSwing = prefersReducedMotion ? 0.04 : Math.sin(timeSec * 0.95) * 0.075;
      beamGroup.rotation.z = beamSwing;
      leftPan.rotation.z = -beamSwing;
      rightPan.rotation.z = -beamSwing;
      outerBlueprintRing.rotation.z = timeSec * 0.12;
      innerBlueprintRing.rotation.z = -timeSec * 0.16;
      verticalMeridianRing.rotation.y = timeSec * 0.09;

      // 2. 9 Ledger Plates: Morph between Hero Monolith stack and Services 3x3 Floating Matrix
      const hoveredIdx = hoveredServiceRef.current;
      for (let i = 0; i < ledgerPlates.length; i++) {
        const item = ledgerPlates[i];
        const isHovered = hoveredIdx === i;
        const hoverBoostZ = isHovered ? 0.65 : 0;
        const hoverBoostY = isHovered ? 0.15 : 0;

        const tx = THREE.MathUtils.lerp(item.heroPos.x, item.servicesPos.x, d);
        const ty =
          THREE.MathUtils.lerp(item.heroPos.y, item.servicesPos.y, d) +
          hoverBoostY +
          Math.sin(timeSec * 1.15 + i * 0.6) * 0.045;
        const tz =
          THREE.MathUtils.lerp(item.heroPos.z, item.servicesPos.z, d) +
          hoverBoostZ;

        item.group.position.x += (tx - item.group.position.x) * damp;
        item.group.position.y += (ty - item.group.position.y) * damp;
        item.group.position.z += (tz - item.group.position.z) * damp;

        const rx =
          THREE.MathUtils.lerp(item.heroRot.x, item.servicesRot.x, d) +
          (isHovered ? 0.22 : 0) +
          pointerCurrent.y * -0.1;
        const ry =
          THREE.MathUtils.lerp(item.heroRot.y, item.servicesRot.y, d) +
          (isHovered ? -0.18 : 0) +
          pointerCurrent.x * 0.18 +
          Math.sin(timeSec * 0.4 + i) * 0.06 * d;
        const rz = THREE.MathUtils.lerp(item.heroRot.z, item.servicesRot.z, d);

        item.group.rotation.x += (rx - item.group.rotation.x) * damp;
        item.group.rotation.y += (ry - item.group.rotation.y) * damp;
        item.group.rotation.z += (rz - item.group.rotation.z) * damp;

        item.spineMesh.material = isHovered ? highlightBronzeMat : brushedBronzeMat;
      }

      // 3. Four Interlocking IESBA Pillars (About Section — visible across 0.30..0.48)
      const aboutPillarWeight =
        effectiveProgress < 0.28
          ? 0
          : effectiveProgress < 0.35
            ? (effectiveProgress - 0.28) / 0.07
            : effectiveProgress < 0.45
              ? 1
              : Math.max(0, 1 - (effectiveProgress - 0.45) / 0.06);
      const pRise = Math.max(stageState.pillarsRise, aboutPillarWeight);
      const targetPillarsY = THREE.MathUtils.lerp(-4.2, 0.28, pRise);
      pillarsAnchor.position.y += (targetPillarsY - pillarsAnchor.position.y) * damp;
      pillarsAnchor.rotation.y = -0.28 + effectiveProgress * 0.75 + pointerCurrent.x * 0.16;
      pillarsAnchor.visible = pRise > 0.02;
      pillarsUnityRing.rotation.z = timeSec * 0.12;

      for (let pIdx = 0; pIdx < pillarElements.length; pIdx++) {
        const pGroup = pillarElements[pIdx];
        const staggerOffset = Math.max(0, Math.min(1, pRise * 1.3 - pIdx * 0.1));
        pGroup.position.y = (1 - staggerOffset) * -1.2 + Math.sin(timeSec * 0.95 + pIdx) * 0.04;
      }

      // 4. Four-Stage Process Timeline Rail & Glowing Nodes
      const rProg = stageState.railProgress;
      const railVisibleWeight =
        effectiveProgress >= 0.38 && effectiveProgress <= 0.6 ? 1 : 0;
      const targetRailY = railVisibleWeight > 0 ? 0.22 : -4.2;
      timelineAnchor.position.y += (targetRailY - timelineAnchor.position.y) * damp;
      timelineAnchor.position.x = THREE.MathUtils.lerp(0.95, -0.95, rProg);
      timelineAnchor.visible = timelineAnchor.position.y > -3.6;

      const activeStep = activeProcessRef.current;
      for (let nIdx = 0; nIdx < timelineNodes.length; nIdx++) {
        const node = timelineNodes[nIdx];
        const isCurrentStage = activeStep === nIdx;
        node.coreMesh.rotation.y = timeSec * (isCurrentStage ? 1.05 : 0.4) + nIdx;
        node.coreMesh.rotation.x = timeSec * 0.3;
        node.coreMesh.material = isCurrentStage ? highlightBronzeMat : brushedBronzeMat;
        node.haloMesh.material = isCurrentStage ? highlightBronzeMat : deepBronzeMat;
        const targetNodeScale = isCurrentStage ? 1.35 : 0.96;
        node.group.scale.x += (targetNodeScale - node.group.scale.x) * damp;
        node.group.scale.y = node.group.scale.x;
        node.group.scale.z = node.group.scale.x;
        node.haloMesh.rotation.z = -timeSec * 0.45;
        node.outerRingMesh.rotation.x = timeSec * 0.32 + nIdx;
      }

      // 5. Peripheral 3D Financial Artifact Constellation (Always visible along left/right flanks)
      for (let aIdx = 0; aIdx < floatingArtifacts.length; aIdx++) {
        const art = floatingArtifacts[aIdx];
        if (!prefersReducedMotion) {
          art.mesh.rotation.x = timeSec * art.rotSpeed.x + art.floatPhase;
          art.mesh.rotation.y = timeSec * art.rotSpeed.y + art.floatPhase;
          art.mesh.rotation.z = timeSec * art.rotSpeed.z;
          art.mesh.position.y =
            art.basePos.y +
            Math.sin(timeSec * 0.75 + art.floatPhase) * 0.14 +
            (effectiveProgress - 0.5) * (aIdx % 2 === 0 ? 0.65 : -0.65);
          art.mesh.position.x =
            art.basePos.x + pointerCurrent.x * (aIdx % 2 === 0 ? -0.12 : 0.12);
        }
      }

      // 6. Architectural Blueprint Grid & Calm Horizon
      blueprintGridAnchor.rotation.y = timeSec * 0.03 + pointerCurrent.x * 0.06;
      blueprintGridAnchor.position.y = THREE.MathUtils.lerp(
        -1.6,
        -0.82,
        stageState.horizonCalm
      );

      renderer.render(scene, camera);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      st.kill();
      if (lenis) {
        lenis.destroy();
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [onSceneReady]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      role="presentation"
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
    />
  );
};

export default ScrollytellingCanvas;
