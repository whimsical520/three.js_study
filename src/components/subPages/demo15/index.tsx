import React, { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as TWEEN from 'tween.js'
// import THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import img01 from './00125.jpg'
import bgm from './bgm.m4a'
import testJPEG from './test.jpeg'

const TREX_JUMP_SPEED = 20

const CACTUS_SPAWN_X = 20
const CACTUS_DESTROY_X = -20
const CACTUS_MAX_SCALE = 1
const CACTUS_MIN_SCALE = 0.5
const CACTUS_SPAWN_MAX_INTERVAL = 4
const CACTUS_SPAWN_MIN_INTERVAL = 2

const PTERODACTYL_MIN_Y = 4
const PTERODACTYL_MAX_Y = 5
const PTERODACTYL_SPAWN_X = -5
const PTERODACTYL_SPAWN_INTERVAL = 10
const PTERODACTYL_SPEED = 2

const GRAVITY = -50
const FLOOR_SPEED = -10
const SKYSPHERE_ROTATE_SPEED = 0.02
const SCORE_INCREASE_SPEED = 10

const Demo: React.FC = () => {
  let infoElement
  let camera: any
  let renderer: any
  let directionalLight: any
  const clock = new THREE.Clock()
  const scene = new THREE.Scene()

  const createInfoElement = () => {
    infoElement = document.createElement('div')
    infoElement.id = 'info'
    infoElement.innerHTML = 'Press any key to start!'
    document.body.appendChild(infoElement)
  }

  const createCamera = () => {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 1, 10)
    camera.lookAt(3, 3, 0)
  }

  const createRender = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x7f7f7f)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    document.body.appendChild(renderer.domElement)
  }

  const animate = () => {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()
    update(delta)

    renderer.render(scene, camera)
  }

  const createLighting = () => {
    directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.intensity = 2
    directionalLight.position.set(0, 10, 0)

    const targetObject = new THREE.Object3D()
    targetObject.position.set(0, 0, 0)
    scene.add(directionalLight)

    const light = new THREE.AmbientLight(0x7f7f7f)
    light.intensity = 1
    scene.add(light)
  }

  const init = useCallback(() => {
    createInfoElement()
    createCamera()
    createRender()
    animate()
    createLighting()
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return <div>恐龙跳跃小游戏</div>
}

export default Demo
