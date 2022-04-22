import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { Howl, Howler } from 'Howler'
/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
const rainCount = 5000;
// Canvas
const canvas = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 15)
    // scene.fog = fog;
    /**
     * Textures
     */
const textureLoader = new THREE.TextureLoader()

// Door Texture
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Rain
const particleTexture = textureLoader.load('/textures/particles/13.png')

// Brick 
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// Grass 
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

/**
 *Rain 
 */
const rainGeo = new THREE.BufferGeometry();
const rainGeos = new Float32Array(rainCount * 3);
for (let i = 0; i < rainCount; i = i + 3) {
    rainGeos[i] = (Math.random() - 0.5) * 17;
    rainGeos[i + 1] = (Math.random()) * 13;
    rainGeos[i + 2] = (Math.random() - 0.5) * 17;
}
console.info(rainGeos)
rainGeo.setAttribute('position', new THREE.BufferAttribute(rainGeos, 3))
rainGeo.velocity = 0;
const rainMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x00aaff,
    alphaMap: particleTexture,
    sizeAttenuation: true,
    transparent: true,
    alphaTest: 0.001,
    blending: THREE.AdditiveBlending,
});
const rain = new THREE.Points(rainGeo, rainMaterial);
scene.add(rain)

/**
 * House
 */
// Temporary sphere
// Group
const house = new THREE.Group();
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        noramlMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
)
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));
walls.position.y = 2.5 / 2;
house.add(walls);
// Roof
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
house.add(roof)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        noramlMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
        side: THREE.DoubleSide
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
house.add(floor)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
door.position.z = 2.0001;
door.position.y = 1;
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.3, 0.3, 0.3);
bush1.position.set(1.5, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.3, 0.3, 0.3);
bush3.position.set(-1.7, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);


house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 })

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z)
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}
scene.add(graves)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12)
    // gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12)
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
// gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
// gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
// gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)

scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight(0xff7d46, 1, 7)
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight)


// Flash
const flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
flash.position.set(5, 12, 0.5);
scene.add(flash);

/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
scene.add(ghost1);
const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
scene.add(ghost2);
const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
scene.add(ghost3);

/**
 * Clouds
 *
 */
const cloudParticles = [];

const cloudColor = textureLoader.load('/textures/cloudaplha.jpg')
const cloudHeight = textureLoader.load('/textures/height2.png')

const cloudGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);
const cloudMaterial = new THREE.MeshStandardMaterial({
    map: cloudColor,
    transparent: true,
    alphaMap: cloudColor,
    displacementMap: cloudHeight,
    displacementScale: 5,
    side: THREE.DoubleSide,
    depthTest: false
})


for (let i = 0; i < 20; i++) {
    let clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    clouds.position.set(Math.random() * 10 - 4,
        Math.random() * 2 + 10,
        Math.random() * -2 - 0.5
    )
    clouds.rotation.x = -Math.PI / 2;
    cloudParticles.push(clouds)
    house.add(clouds)
}
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);
// gui.add(camera.position, 'z').min(0).max(20).step(0.001);
// gui.add(camera.position, 'y').min(0).max(20).step(0.001);
// gui.add(camera.position, 'x').min(0).max(20).step(0.001);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0.2, 3.2, 0.15);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor('#262837');

/**
 * Shadows
 *
 * @var {[type]}
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

// Sounds
const entrySound = new Howl({
    src: ['/background.mp3'],
    loop: true,
})

const rainSound = new Howl({
    src: ['/rain.mp3'],
    loop: true,
    volume: 0.4
})

// Intro Animation
gsap.fromTo(camera.position, {
    y: 14,
    z: 14,
    x: 0
}, {
    y: 0.566,
    z: 9.64,
    x: 0,
    duration: 3,
    delay: 1,
    ease: "power2.easeIn",
    onStart: () => {
        entrySound.play();
        rainSound.play();
    }
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Rain Drops
    for (let i = 0; i < rainCount; i = i + 3) {
        if (rainGeos[i + 1] > 0) {
            rainGeos[i + 1] -= 0.1;

        } else {
            rainGeos[i + 1] = 13;
        }
    }
    rainGeo.attributes.position.needsUpdate = true;

    // Ghost 1
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    // Ghost 2
    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Ghost 3
    const ghost3Angle = -elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    cloudParticles.forEach(p => {
        p.rotation.z -= 0.002
    });

    // Thunderstrom Flash
    if (Math.random() > 0.93 || flash.power > 100) {
        if (flash.power < 100) {
            flash.position.set(
                Math.random() * 15,
                10 + Math.random() * 1,
                Math.random() * 1 - 0.5
            )
        }
        flash.power = 4 + Math.random() * 50;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()