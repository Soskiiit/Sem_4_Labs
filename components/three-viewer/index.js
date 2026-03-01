import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ThreeViewerComponent {
    constructor(parent) {
        this.parent = parent;
        this.animationId = null;
    }

    render(modelPath) {
        const container = document.createElement('div');
        container.id = 'three-container';
        container.style.cssText = 'width: 100%; height: 400px; margin: 0 auto; position: relative;';
        this.parent.appendChild(container);

        const width = container.clientWidth || 760;
        const height = 400;

        // Сцена
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f8f8);

        // Камера
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 1.5, 4);

        // Рендерер
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Контролы (вращение мышью)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0.8, 0);
        controls.update();

        // Освещение
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);

        // Подставка
        const planeGeometry = new THREE.CircleGeometry(2, 64);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        scene.add(plane);

        // Загрузка модели
        const loader = new GLTFLoader();
        let mixer = null;

        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Центрируем модель
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                model.scale.setScalar(scale);
                model.position.x = -center.x * scale;
                model.position.z = -center.z * scale;
                model.position.y = -box.min.y * scale;

                scene.add(model);

                // Анимации если есть
                if (gltf.animations && gltf.animations.length > 0) {
                    mixer = new THREE.AnimationMixer(model);
                    gltf.animations.forEach((clip) => {
                        mixer.clipAction(clip).play();
                    });
                }

                controls.target.set(0, size.y * scale / 2, 0);
                controls.update();
            },
            undefined,
            (error) => {
                console.error('Ошибка загрузки 3D модели:', error);
            }
        );

        // Цикл анимации
        const clock = new THREE.Clock();
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Адаптивность
        const onResize = () => {
            const newWidth = container.clientWidth;
            camera.aspect = newWidth / height;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, height);
        };
        window.addEventListener('resize', onResize);

        // Сохраняем для очистки
        this._cleanup = () => {
            window.removeEventListener('resize', onResize);
            if (this.animationId) cancelAnimationFrame(this.animationId);
            renderer.dispose();
        };
    }

    destroy() {
        if (this._cleanup) this._cleanup();
    }
}
