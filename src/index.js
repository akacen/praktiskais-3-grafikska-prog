import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import sunTexture from './2k_sun.jpg';
import spaceTexture from './2k_stars_milky_way.jpg';
import earthTexture from './2k_earth_daymap.jpg';

export class main {
	
	init() {
		this.clock = new THREE.Clock();
		this.marsDistance = 227940;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1000, this.marsDistance * 20);
		this.camera.position.z = -100000;
	
		var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xEEEEEE);
		renderer.shadowMap.enabled = true;
		this.renderer = renderer;
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		document.body.appendChild(renderer.domElement);

		this.setupEvents();
		this.createWorld();
		this.createLights();
		this.animate();
	}

	setupEvents() {
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});		
	}

	createWorld() {
		// var geometry = new THREE.SphereGeometry(this.marsDistance * 9 + 10000, 32, 32);
		// var material = new THREE.MeshStandardMaterial({
		// 	map: new THREE.TextureLoader().load(spaceTexture),
		// 	side: THREE.DoubleSide
		// });
		// this.skysphere = new THREE.Mesh(geometry, material);
		// this.scene.add(this.skysphere);

		this.createPlanet('earth', earthTexture, 149.6 * 1000, 12756 / 2);
		this.createMoon('moon')
		this.createSun();
	}

	createPlanet(name, texture_name, distance, radius) {
		var geometry = new THREE.SphereGeometry(radius, 32, 32);
		var material = new THREE.MeshStandardMaterial({
			map: new THREE.TextureLoader().load(texture_name),
			metalness: 0
		});

		let planet = new THREE.Mesh(geometry, material);
		let system = new THREE.Object3D();
		system.add(planet);
		this.scene.add(system);

		this[name] = system;
		planet.distance = distance;

		planet.castShadow = true;
		planet.receiveShadow = true;

	}

	createMoon(name, texture_name, distance, radius, system) {

	}

	createSun() {
		var geometry = new THREE.SphereGeometry(69700 / 2, 32, 32);
		var material = new THREE.MeshStandardMaterial({
		   emissive: 0xEEEE99,
		   emissiveIntensity: 0.8,
		   map: new THREE.TextureLoader().load(sunTexture)
		});
		this.sun = new THREE.Mesh(geometry, material);
		this.scene.add(this.sun);
	}

	createLights() {
		var sunLight = new THREE.PointLight(0xffffff, 1, this.marsDistance * 20, 1);

		this.scene.add(new THREE.AmbientLight(0x404040));
		this.scene.add(sunLight);

		sunLight.castShadow = true;
		sunLight.shadow.mapSize.width = 1024;
		sunLight.shadow.mapSize.height = 1024;
		sunLight.shadow.camera.near = this.camera.near;
		sunLight.shadow.camera.far = this.camera.far;
  	}

	animate() {

		this.controls.update();
		requestAnimationFrame(() => this.animate());
		this.renderer.render(this.scene, this.camera);
	}
}

const module = new main();
module.init();
