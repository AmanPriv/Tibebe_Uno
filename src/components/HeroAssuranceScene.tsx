import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
   bevelSegments: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const w = width - radius * 2;
  const d = depth - radius * 2;
  const x0 = -w / 2;
  const y0 = -d / 2;

  shape.moveTo(x0, y0 + radius);
  shape.lineTo(x0, y0 + d - radius);
  shape.quadraticCurveTo(x0, y0 + d, x0 + radius, y0 + d);
  shape.lineTo(x0 + w - radius, y0 + d);
  shape.quadraticCurveTo(x0 + w, y0 + d, x0 + w, y0 + d - radius);
  shape.lineTo(x0 + w, y0 + radius);
  shape.quadraticCurveTo(x0 + w, y0, x0 + w - radius, y0);
  shape.lineTo(x0 + radius, y0);
  shape.quadraticCurveTo(x0, y0, x0, y0 + radius);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSegments,
    steps: 1,
    bevelSize: radius,
    bevelThickness: Math.min(radius, height * 0.35),
  });
  geo.rotateX(Math.PI / 2);
  geo.center();
  return geo;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(59, 47, 36, 0.32)');
    gradient.addColorStop(0.45, 'rgba(92, 78, 64, 0.14)');
    gradient.addColorStop(1, 'rgba(245, 239, 230, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const HeroAssuranceScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const isCompactViewport = window.innerWidth < 768;
    const radialSegments = isCompactViewport ? 20 : 36;
    const bevelSegments = isCompactViewport ? 2 : 3;

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

    const width = Math.max(container.clientWidth, 280);
    const height = Math.max(container.clientHeight, 260);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0.55, 6.6);
    camera.lookAt(0, 0, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    texturesToDispose.push(envTarget.texture);
    pmremGenerator.dispose();

    // Warm Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfbf8f3, 0xe8dcc8, 0.95);
    hemiLight.position.set(0, 8, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf8, 1.55);
    keyLight.position.set(4.5, 6.5, 5.0);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      const d = 3.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 18;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8dcc8, 0.75);
    fillLight.position.set(-4.5, 3.0, 3.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x8a6a3b, 0.55);
    rimLight.position.set(0, 4.0, -5.0);
    scene.add(rimLight);

    // Strictly Palette-Matched Matte & Satin Materials
    // Bronze: #8A6A3B, Sand: #E8DCC8, Espresso: #3B2F24, Ivory: #FBF8F3
    const satinBronzeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x8a6a3b,
        roughness: 0.34,
        metalness: 0.65,
        envMapIntensity: 0.9,
      })
    );
    const matteEspressoMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3b2f24,
        roughness: 0.64,
        metalness: 0.14,
        envMapIntensity: 0.65,
      })
    );
    const satinSandMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe8dcc8,
        roughness: 0.48,
        metalness: 0.16,
        envMapIntensity: 0.7,
      })
    );
    const matteIvoryMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfbf8f3,
        roughness: 0.56,
        metalness: 0.05,
        envMapIntensity: 0.6,
      })
    );
    const translucentAssuranceMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xfbf8f3,
        roughness: 0.22,
        metalness: 0.04,
        transparent: true,
        opacity: 0.58,
        clearcoat: 0.4,
        clearcoatRoughness: 0.25,
        depthWrite: false,
      })
    );
    const translucentSandMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe8dcc8,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.46,
        depthWrite: false,
      })
    );

    // Root Scene Group
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, -0.15, 0);
    scene.add(rootGroup);

    // Contact Shadow Plane Beneath Arrangement
    const shadowTexture = createContactShadowTexture();
    texturesToDispose.push(shadowTexture);
    const shadowPlaneMat = trackMat(
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      })
    );
    const shadowPlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(4.8, 3.6)),
      shadowPlaneMat
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.32, 0);
    scene.add(shadowPlane);

    // =========================================================================
    // 1. CENTERPIECE: BALANCED ASSURANCE SCALE (Multi-part composite group)
    // =========================================================================
    const scaleGroup = new THREE.Group();
    scaleGroup.position.set(0.05, -0.1, 0);
    rootGroup.add(scaleGroup);

    // Pedestal Base Tier 1 (Espresso)
    const baseLower = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.76, 0.84, 0.14, radialSegments)),
      matteEspressoMat
    );
    baseLower.position.y = -1.1;
    baseLower.castShadow = !isSoftwareGl;
    baseLower.receiveShadow = !isSoftwareGl;
    scaleGroup.add(baseLower);

    // Pedestal Base Tier 2 (Satin Bronze Bevel Ring)
    const baseMid = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.58, 0.68, 0.1, radialSegments)),
      satinBronzeMat
    );
    baseMid.position.y = -0.98;
    baseMid.castShadow = !isSoftwareGl;
    scaleGroup.add(baseMid);

    // Pedestal Plinth (Warm Ivory)
    const baseUpper = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.42, 0.52, 0.12, radialSegments)),
      matteIvoryMat
    );
    baseUpper.position.y = -0.87;
    scaleGroup.add(baseUpper);

    // Central Column Pillar (Espresso + Bronze Collar Rings)
    const columnMesh = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.11, 0.15, 1.82, radialSegments)),
      matteEspressoMat
    );
    columnMesh.position.y = 0.08;
    columnMesh.castShadow = !isSoftwareGl;
    scaleGroup.add(columnMesh);

    const collarRingGeo = trackGeo(new THREE.TorusGeometry(0.155, 0.032, 12, radialSegments));
    const lowerCollar = new THREE.Mesh(collarRingGeo, satinBronzeMat);
    lowerCollar.rotation.x = Math.PI / 2;
    lowerCollar.position.y = -0.45;
    scaleGroup.add(lowerCollar);

    const upperCollar = new THREE.Mesh(collarRingGeo, satinBronzeMat);
    upperCollar.rotation.x = Math.PI / 2;
    upperCollar.position.y = 0.65;
    scaleGroup.add(upperCollar);

    // Fulcrum Keystone Finial at Top of Pillar
    const finialMesh = new THREE.Mesh(
      trackGeo(new THREE.OctahedronGeometry(0.2, 0)),
      satinBronzeMat
    );
    finialMesh.position.y = 1.15;
    scaleGroup.add(finialMesh);

    // Articulated Balance Beam Group
    const beamGroup = new THREE.Group();
    beamGroup.position.set(0, 0.94, 0);
    scaleGroup.add(beamGroup);

    const beamBar = new THREE.Mesh(
      trackGeo(createRoundedBoxGeometry(2.75, 0.09, 0.11, 0.025, bevelSegments)),
      satinBronzeMat
    );
    beamBar.castShadow = !isSoftwareGl;
    beamGroup.add(beamBar);

    const fulcrumHub = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.15, 0.15, 0.14, radialSegments)),
      matteEspressoMat
    );
    fulcrumHub.rotation.x = Math.PI / 2;
    beamGroup.add(fulcrumHub);

    // Helper to build suspended scale pan + hanger rods
    const createScalePanAssembly = (isLeft: boolean): THREE.Group => {
      const panAssembly = new THREE.Group();
      panAssembly.position.set(isLeft ? -1.24 : 1.24, 0, 0);

      // End node cap on beam
      const endKnob = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16)),
        satinBronzeMat
      );
      panAssembly.add(endKnob);

      // 3 angled suspension rods
      const rodGeo = trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 0.92, 8));
      const radius = 0.34;
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const rx = Math.cos(angle) * (radius * 0.5);
        const rz = Math.sin(angle) * (radius * 0.5);
        const rod = new THREE.Mesh(rodGeo, satinBronzeMat);
        rod.position.set(rx, -0.44, rz);
        rod.rotation.z = -rx * 0.72;
        rod.rotation.x = rz * 0.72;
        panAssembly.add(rod);
      }

      // Weighing Dish (Satin Bronze Rim + Warm Ivory Dish)
      const dishTray = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.42, 0.28, 0.08, radialSegments)),
        satinBronzeMat
      );
      dishTray.position.y = -0.88;
      dishTray.castShadow = !isSoftwareGl;
      panAssembly.add(dishTray);

      const dishInner = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.36, 0.26, 0.04, radialSegments)),
        matteIvoryMat
      );
      dishInner.position.y = -0.84;
      panAssembly.add(dishInner);

      if (isLeft) {
        // Miniature Beveled Ledger Volume resting on Left Pan
        const miniLedger = new THREE.Mesh(
          trackGeo(createRoundedBoxGeometry(0.38, 0.09, 0.28, 0.02, bevelSegments)),
          matteEspressoMat
        );
        miniLedger.position.y = -0.78;
        miniLedger.rotation.y = 0.25;
        panAssembly.add(miniLedger);
      } else {
        // Miniature Stack of 2 Bronze/Sand Coins resting on Right Pan
        const miniCoinGeo = trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.055, 20));
        const c1 = new THREE.Mesh(miniCoinGeo, satinSandMat);
        c1.position.set(0, -0.79, 0);
        const c2 = new THREE.Mesh(miniCoinGeo, satinBronzeMat);
        c2.position.set(0.02, -0.73, 0.01);
        panAssembly.add(c1, c2);
      }

      return panAssembly;
    };

    const leftPanGroup = createScalePanAssembly(true);
    const rightPanGroup = createScalePanAssembly(false);
    beamGroup.add(leftPanGroup, rightPanGroup);

    // =========================================================================
    // 2. FOREGROUND LEFT: STACK OF BEVELED LEDGER BLOCKS (3 Volumes)
    // =========================================================================
    const ledgerStackGroup = new THREE.Group();
    ledgerStackGroup.position.set(-1.35, -0.62, 0.65);
    ledgerStackGroup.rotation.set(0.08, 0.42, -0.04);
    rootGroup.add(ledgerStackGroup);

    const buildLedgerBook = (
      w: number,
      h: number,
      d: number,
      coverMat: THREE.Material,
      yOffset: number,
      rotY: number
    ) => {
      const bookGroup = new THREE.Group();
      bookGroup.position.y = yOffset;
      bookGroup.rotation.y = rotY;

      const coverMesh = new THREE.Mesh(
        trackGeo(createRoundedBoxGeometry(w, h, d, 0.025, bevelSegments)),
        coverMat
      );
      coverMesh.castShadow = !isSoftwareGl;
      bookGroup.add(coverMesh);

      const pageBlockMesh = new THREE.Mesh(
        trackGeo(createRoundedBoxGeometry(w * 0.94, h * 0.76, d * 0.94, 0.015, bevelSegments)),
        matteIvoryMat
      );
      pageBlockMesh.position.set(0.02, 0, 0);
      bookGroup.add(pageBlockMesh);

      // Bronze spine band
      const spineBand = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.03, h * 1.02, d * 0.96)),
        satinBronzeMat
      );
      spineBand.position.set(-w * 0.42, 0, 0);
      bookGroup.add(spineBand);

      return bookGroup;
    };

    ledgerStackGroup.add(
      buildLedgerBook(0.92, 0.15, 0.68, matteEspressoMat, -0.18, 0),
      buildLedgerBook(0.86, 0.14, 0.64, satinSandMat, -0.02, -0.18),
      buildLedgerBook(0.8, 0.13, 0.6, satinBronzeMat, 0.13, 0.12)
    );

    // =========================================================================
    // 3. FOREGROUND RIGHT: STACK OF BEVELED ASSURANCE COINS / MEDALLIONS
    // =========================================================================
    const coinStackGroup = new THREE.Group();
    coinStackGroup.position.set(1.38, -0.64, 0.62);
    coinStackGroup.rotation.set(0.1, -0.35, 0.05);
    rootGroup.add(coinStackGroup);

    const coinBodyGeo = trackGeo(new THREE.CylinderGeometry(0.36, 0.36, 0.09, radialSegments));
    const coinRimGeo = trackGeo(new THREE.TorusGeometry(0.34, 0.022, 10, radialSegments));

    const coinConfigs = [
      { y: -0.2, x: 0, z: 0, mat: matteEspressoMat, rim: satinBronzeMat },
      { y: -0.09, x: -0.04, z: 0.02, mat: satinBronzeMat, rim: satinSandMat },
      { y: 0.02, x: 0.03, z: -0.02, mat: satinSandMat, rim: satinBronzeMat },
      { y: 0.13, x: -0.02, z: 0.03, mat: matteIvoryMat, rim: satinBronzeMat },
    ];

    coinConfigs.forEach((cfg) => {
      const coinUnit = new THREE.Group();
      coinUnit.position.set(cfg.x, cfg.y, cfg.z);

      const disc = new THREE.Mesh(coinBodyGeo, cfg.mat);
      disc.castShadow = !isSoftwareGl;
      coinUnit.add(disc);

      const topRim = new THREE.Mesh(coinRimGeo, cfg.rim);
      topRim.rotation.x = Math.PI / 2;
      topRim.position.y = 0.042;
      coinUnit.add(topRim);

      coinStackGroup.add(coinUnit);
    });

    // =========================================================================
    // 4. TRANSLUCENT GEOMETRIC ASSURANCE FORMS & ORBITAL RINGS
    // =========================================================================
    const crystalGroup = new THREE.Group();
    crystalGroup.position.set(-1.18, 0.72, -0.35);
    rootGroup.add(crystalGroup);

    const crystalGeo = trackGeo(new THREE.OctahedronGeometry(0.34, 0));
    const crystalMesh = new THREE.Mesh(crystalGeo, translucentAssuranceMat);
    crystalMesh.renderOrder = 2;
    crystalGroup.add(crystalMesh);

    const crystalEdges = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(crystalGeo)),
      trackMat(new THREE.LineBasicMaterial({ color: 0x8a6a3b, transparent: true, opacity: 0.65 }))
    );
    crystalGroup.add(crystalEdges);

    // Second Translucent Geometric Polyhedron (Upper Right)
    const polyGroup = new THREE.Group();
    polyGroup.position.set(1.22, 0.78, -0.4);
    rootGroup.add(polyGroup);

    const dodecaGeo = trackGeo(new THREE.DodecahedronGeometry(0.28, 0));
    const dodecaMesh = new THREE.Mesh(dodecaGeo, translucentSandMat);
    dodecaMesh.renderOrder = 2;
    polyGroup.add(dodecaMesh);

    const dodecaEdges = new THREE.LineSegments(
      trackGeo(new THREE.EdgesGeometry(dodecaGeo)),
      trackMat(new THREE.LineBasicMaterial({ color: 0x3b2f24, transparent: true, opacity: 0.45 }))
    );
    polyGroup.add(dodecaEdges);

    // Subtle Architectural Calibration Rings Surrounding the Scale
    const outerRingMesh = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.78, 0.012, 10, radialSegments * 2)),
      satinBronzeMat
    );
    outerRingMesh.rotation.set(Math.PI / 2.35, 0.22, 0);
    outerRingMesh.position.set(0, 0.15, -0.2);
    rootGroup.add(outerRingMesh);

    const innerRingMesh = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.42, 0.009, 8, radialSegments * 2)),
      satinSandMat
    );
    innerRingMesh.rotation.set(Math.PI / 1.85, -0.28, 0.15);
    innerRingMesh.position.set(0, 0.15, -0.2);
    rootGroup.add(innerRingMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer Tilt State (subtle parallax toward mouse)
    const targetPointer = { x: 0, y: 0 };
    const currentPointer = { x: 0, y: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion || isTouchDevice) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetPointer.x = Math.max(-1, Math.min(1, nx));
      targetPointer.y = Math.max(-1, Math.min(1, ny));
    };

    const handlePointerLeave = () => {
      targetPointer.x = 0;
      targetPointer.y = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = Math.max(container.clientWidth, 280);
      const newH = Math.max(container.clientHeight, 260);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Static render if prefers-reduced-motion is enabled
    if (prefersReducedMotion) {
      rootGroup.rotation.set(0.04, -0.18, 0);
      beamGroup.rotation.z = 0.03;
      leftPanGroup.rotation.z = -0.03;
      rightPanGroup.rotation.z = -0.03;
      renderer.render(scene, camera);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('resize', handleResize);
        geometriesToDispose.forEach((g) => g.dispose());
        materialsToDispose.forEach((m) => m.dispose());
        texturesToDispose.forEach((t) => t.dispose());
        renderer.dispose();
      };
    }

    // Continuous Animation Loop with Off-Screen Pause & Software-WebGL Pacing
    let frameId = 0;
    let isHeroVisible = true;
    let isDisposed = false;
    const startTimeSec = performance.now() * 0.001;
    let lastTimeSec = startTimeSec;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        if (isDisposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed || !isHeroVisible) return;

      const nowSec = performance.now() * 0.001;
      const delta = Math.min(Math.max(nowSec - lastTimeSec, 0.001), 0.1);
      lastTimeSec = nowSec;
      const elapsed = nowSec - startTimeSec;

      // Smooth pointer damping
      currentPointer.x = THREE.MathUtils.damp(currentPointer.x, targetPointer.x, 4.5, delta);
      currentPointer.y = THREE.MathUtils.damp(currentPointer.y, targetPointer.y, 4.5, delta);

      // Gentle auto-rotation on touch devices or subtle idle sway on desktop
      const baseRotY = isTouchDevice
        ? Math.sin(elapsed * 0.45) * 0.28
        : Math.sin(elapsed * 0.35) * 0.12 + currentPointer.x * 0.22;
      const baseRotX = isTouchDevice
        ? Math.cos(elapsed * 0.35) * 0.05
        : currentPointer.y * -0.14;

      rootGroup.rotation.y = baseRotY;
      rootGroup.rotation.x = baseRotX;
      rootGroup.position.y = -0.15 + Math.sin(elapsed * 0.9) * 0.04;

      // Balanced Scale Beam gentle equilibrium oscillation
      const beamTilt = Math.sin(elapsed * 0.85) * 0.065;
      beamGroup.rotation.z = beamTilt;
      leftPanGroup.rotation.z = -beamTilt;
      rightPanGroup.rotation.z = -beamTilt;

      // Floating Ledger Stack & Coin Stack
      ledgerStackGroup.position.y = -0.62 + Math.sin(elapsed * 1.1 + 1.0) * 0.055;
      ledgerStackGroup.rotation.y = 0.42 + Math.sin(elapsed * 0.5) * 0.08;

      coinStackGroup.position.y = -0.64 + Math.sin(elapsed * 1.05 + 2.4) * 0.055;
      coinStackGroup.rotation.y = -0.35 + Math.cos(elapsed * 0.55) * 0.08;

      // Translucent Geometric Crystals slow rotation
      crystalGroup.position.y = 0.72 + Math.sin(elapsed * 1.25) * 0.06;
      crystalGroup.rotation.y = elapsed * 0.32;
      crystalGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.2;

      polyGroup.position.y = 0.78 + Math.cos(elapsed * 1.15) * 0.06;
      polyGroup.rotation.y = -elapsed * 0.28;
      polyGroup.rotation.z = Math.cos(elapsed * 0.5) * 0.18;

      outerRingMesh.rotation.z = elapsed * 0.08;
      innerRingMesh.rotation.z = -elapsed * 0.11;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    const scheduleLoop = () => {
      lastTimeSec = performance.now() * 0.001;
      if (isSoftwareGl) {
        tick();
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    // Pause rendering when Hero is off-screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const nowVisible = entry.isIntersecting;
        if (nowVisible && !isHeroVisible) {
          isHeroVisible = true;
          scheduleLoop();
        } else if (!nowVisible && isHeroVisible) {
          isHeroVisible = false;
          window.cancelAnimationFrame(frameId);
          window.clearTimeout(frameId);
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    scheduleLoop();

    return () => {
      isDisposed = true;
      intersectionObserver.disconnect();
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      role="presentation"
      className="relative h-full w-full min-h-[280px] sm:min-h-[340px] select-none"
    />
  );
};

export default HeroAssuranceScene;
