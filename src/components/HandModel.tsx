import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const GLB_PATH = '/3d/hand.glb';

const INIT_POS = { x: -0.05, y: -0.35, z: 0.75 };
const INIT_ROT = { x: -0.99, y: 2.91, z: 0.11 };

/** Max rotation (radians) when cursor is at edge; rest state. */
const CURSOR_TILT_STRENGTH = 0.12;
/** Tilt strength while user is dragging the hand. */
const DRAG_TILT_STRENGTH = 0.4;
const CURSOR_LERP = 0.08;
/** Tighter follow while dragging. */
const DRAG_LERP = 0.18;
const TILT_STRENGTH_LERP = 0.12;

export function HandModel(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const positionRef = useRef(INIT_POS);
  const rotationRef = useRef(INIT_ROT);
  /** Normalized cursor from viewport center: -1..1, (0,0) = center. */
  const cursorRef = useRef({ x: 0, y: 0 });
  const cursorSmoothedRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const tiltStrengthRef = useRef(CURSOR_TILT_STRENGTH);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controls.target.set(0, 0, 0);

    const loader = new GLTFLoader();
    loader.load(
      GLB_PATH,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            if (mat?.name === 'Material__350') {
              mesh.visible = false;
              return;
            }
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        scene.add(model);
      },
      undefined,
      (err) => console.error('GLB load error:', err)
    );

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 0.6);
    key.position.set(2, 2, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-1, 0.5, 2);
    scene.add(fill);

    const centerX = (): number => window.innerWidth / 2;
    const centerY = (): number => window.innerHeight / 2;
    const onMouseMove = (e: MouseEvent): void => {
      const cx = centerX();
      const cy = centerY();
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / cx));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / cy));
      cursorRef.current = { x: nx, y: ny };
    };
    const onMouseDown = (): void => {
      isDraggingRef.current = true;
      controls.enabled = false;
    };
    const onMouseUp = (): void => {
      isDraggingRef.current = false;
      controls.enabled = true;
    };
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let frameId: number;
    const animate = (): void => {
      frameId = requestAnimationFrame(animate);

      const dragging = isDraggingRef.current;
      const targetStrength = dragging ? DRAG_TILT_STRENGTH : CURSOR_TILT_STRENGTH;
      tiltStrengthRef.current += (targetStrength - tiltStrengthRef.current) * TILT_STRENGTH_LERP;

      const cur = cursorRef.current;
      const sm = cursorSmoothedRef.current;
      const cursorLerp = dragging ? DRAG_LERP : CURSOR_LERP;
      sm.x += (cur.x - sm.x) * cursorLerp;
      sm.y += (cur.y - sm.y) * cursorLerp;
      cursorSmoothedRef.current = sm;

      const model = modelRef.current;
      if (model) {
        const p = positionRef.current;
        const r = rotationRef.current;
        const strength = tiltStrengthRef.current;
        const tiltX = sm.y * strength;
        const tiltY = sm.x * strength;
        model.position.set(p.x, p.y, p.z);
        model.rotation.set(r.x + tiltX, r.y + tiltY, r.z);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = (): void => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      modelRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full min-h-[200px]" aria-hidden="true">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
