import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import sunTexture from './2k_sun.jpg';
import spaceTexture from './2k_stars_milky_way.jpg';
import earthTexture from './2k_earth_daymap.jpg';
import venusTexture from './2k_venus_atmosphere.jpg';
import moonTexture from './2k_moon.jpg';

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
		this.createPlanet('venus', venusTexture, 108.2 * 1000, 6792 / 2);
		this.createMoon('moon', moonTexture, 384.4 * 50, 1737.4 * 2 )
		this.createSun();
	}

	createPlanet(name, texture_name, distance, radius) {
		var geometry = new THREE.SphereGeometry(radius, 32, 32);
		var material = new THREE.MeshStandardMaterial({
			map: new THREE.TextureLoader().load(texture_name),
			metalness: 0
		});

		let planet = new THREE.Mesh(geometry, material);
		if (name.includes('earth')){
			
			let earthSystem = new THREE.Object3D();
			this.earthSystem = earthSystem;
			this.earthSystem.add(planet);
			this.scene.add(this.earthSystem);
		} else {
			let system = new THREE.Object3D();
			system.add(planet);
			this.scene.add(system);
		}
		

		this[name] = planet;
		planet.distance = distance;
		planet.radius = radius;

		planet.castShadow = true;
		planet.receiveShadow = true;

	}

	createMoon(name, texture_name, distance, radius) {
		var geometry = new THREE.SphereGeometry(radius, 32, 32);
		var material = new THREE.MeshStandardMaterial({
			map: new THREE.TextureLoader().load(texture_name),
			metalness: 0
		});

		let moon = new THREE.Mesh(geometry, material);

		this.earthSystem.add(moon);
		this.scene.add(this.earthSystem);
		
		this[name] = moon;
		moon.distance = distance;
		moon.radius = radius;

		moon.castShadow = true;
		moon.receiveShadow = true;
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
		let tick = this.clock.getElapsedTime() / 10;
			this.earth.parent.position.z = Math.sin(tick) * this.earth.distance;
			this.earth.parent.position.x = Math.cos(tick) * this.earth.distance;
			this.earth.rotation.y = -tick * 30;
			
			this.venus.parent.position.z = Math.sin(tick*2) * this.venus.distance;
			this.venus.parent.position.x = Math.cos(tick*2) * this.venus.distance;
			this.venus.rotation.y = -tick * 0.5;
		

			this.moon.position.z = Math.sin(tick * 5) * (this.moon.distance);
			this.moon.position.x = Math.cos(tick * 5) * (this.moon.distance);
			this.moon.rotation.y = -tick * 2;
	
		
		this.controls.update();
		requestAnimationFrame(() => this.animate());
		this.renderer.render(this.scene, this.camera);
	}
}

const module = new main();
module.init();
