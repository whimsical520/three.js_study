import React, { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import TRexSceneGltf from './models/t-rex/scene.gltf'
import PterodactylSceneGltf from './models/pterodactyl/scene.gltf'
import CactusSceneGltf from './models/cactus/scene.gltf'
import SandJPG from './images/sand.jpg'
import DesertJPG from './images/desert.jpg'

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

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const Demo: React.FC = () => {
  let infoElement: any
  let camera: any
  let renderer: any
  let directionalLight: any
  let trex: any
  let cactus: any
  let floor: any
  let pterodactyl: any
  let skySphere: any
  let vel = 0
  let nextCactusSpawnTime = 0
  let nextPterodactylResetTime = 0
  let score = 0
  let isGameOver = true
  let jump = false
  const clock = new THREE.Clock()
  const scene = new THREE.Scene()
  const cactusGroup = new THREE.Group()
  const mixers: any[] = []

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

  function gameOver() {
    isGameOver = true

    infoElement.innerHTML = 'GAME OVER'
  }

  const update = (delta: any) => {
    if (!cactus) return
    if (!trex) return
    if (!floor) return
    if (!pterodactyl) return
    if (isGameOver) return

    for (const mixer of mixers) {
      mixer.update(delta)
    }

    if (jump) {
      jump = false

      if (trex.position.y === 0) {
        vel = TREX_JUMP_SPEED
        trex.position.y = vel * delta
      }
    }

    if (trex.position.y > 0) {
      vel += GRAVITY * delta
      trex.position.y += vel * delta
    } else {
      trex.position.y = 0
    }

    if (clock.elapsedTime > nextCactusSpawnTime) {
      const interval = randomFloat(CACTUS_SPAWN_MIN_INTERVAL, CACTUS_SPAWN_MAX_INTERVAL)

      nextCactusSpawnTime = clock.elapsedTime + interval

      const numCactus = randomInt(3, 5)
      for (let i = 0; i < numCactus; i++) {
        const clone = cactus.clone()
        clone.position.x = CACTUS_SPAWN_X + i * 0.5
        clone.scale.multiplyScalar(randomFloat(CACTUS_MIN_SCALE, CACTUS_MAX_SCALE))

        cactusGroup.add(clone)
      }
    }

    for (const cactus of cactusGroup.children) {
      cactus.position.x += FLOOR_SPEED * delta
    }

    while (
      cactusGroup.children.length > 0 &&
      cactusGroup.children[0].position.x < CACTUS_DESTROY_X // out of the screen
    ) {
      cactusGroup.remove(cactusGroup.children[0])
    }

    const trexAABB = new THREE.Box3(
      new THREE.Vector3(-1, trex.position.y, 0),
      new THREE.Vector3(1, trex.position.y + 2, 0)
    )

    for (const cactus of cactusGroup.children) {
      const cactusAABB = new THREE.Box3()
      cactusAABB.setFromObject(cactus)

      if (cactusAABB.intersectsBox(trexAABB)) {
        gameOver()
        return
      }
    }

    // Update texture offset to simulate floor moving.
    floor.material.map.offset.add(new THREE.Vector2(delta, 0))

    trex.traverse((child: any) => {
      child.castShadow = true
      child.receiveShadow = false
    })

    if (skySphere) {
      skySphere.rotation.y += delta * SKYSPHERE_ROTATE_SPEED
    }

    if (clock.elapsedTime > nextPterodactylResetTime) {
      respawnPterodactyl()
    } else {
      pterodactyl.position.x += delta * PTERODACTYL_SPEED
    }

    score += delta * SCORE_INCREASE_SPEED
    infoElement.innerHTML = Math.floor(score).toString().padStart(5, '0')
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

  const load3DModels = () => {
    const loader = new GLTFLoader()

    loader.load(
      TRexSceneGltf,
      function (gltf) {
        trex = gltf.scene

        trex.scale.setScalar(0.5)
        trex.rotation.y = Math.PI / 2

        scene.add(trex)

        const mixer = new THREE.AnimationMixer(trex)
        const clip = THREE.AnimationClip.findByName(gltf.animations, 'run')

        if (clip) {
          const action = mixer.clipAction(clip)
          action.play()
        }

        mixers.push(mixer)
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      function (error) {
        console.log('An error happened')
      }
    )

    loader.load(PterodactylSceneGltf, function (gltf) {
      pterodactyl = gltf.scene
      pterodactyl.rotation.y = Math.PI / 2
      pterodactyl.scale.multiplyScalar(4)

      respawnPterodactyl()

      scene.add(pterodactyl)

      const mixer = new THREE.AnimationMixer(pterodactyl)
      const clip = THREE.AnimationClip.findByName(gltf.animations, 'flying')
      const action = mixer.clipAction(clip)
      action.play()
      mixers.push(mixer)
    })

    loader.load(
      CactusSceneGltf,
      function (gltf) {
        gltf.scene.scale.setScalar(0.05)
        gltf.scene.position.y = -Math.PI / 2

        cactus = gltf.scene
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      function (error) {
        console.log('An error happened')
      }
    )
  }

  const createFloor = () => {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(SandJPG)

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(100, 100)

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xc4733b
    })

    floor = new THREE.Mesh(geometry, material)
    floor.material.side = THREE.DoubleSide
    floor.rotation.x = -Math.PI / 2

    floor.castShadow = false
    floor.receiveShadow = true

    scene.add(floor)
  }

  const createSkySphere = () => {
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(DesertJPG)

    texture.colorSpace = THREE.SRGBColorSpace

    const material = new THREE.MeshBasicMaterial({
      map: texture
    })
    skySphere = new THREE.Mesh(geometry, material)

    scene.add(skySphere)
  }

  const enableShadow = (renderer: THREE.WebGLRenderer, light: THREE.DirectionalLight) => {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    light.castShadow = true

    if (light.shadow) {
      light.shadow.mapSize.width = 512
      light.shadow.mapSize.height = 512
      light.shadow.camera.near = 0.001
      light.shadow.camera.far = 500
    }
  }

  function restartGame() {
    isGameOver = false
    score = 0

    respawnPterodactyl()

    cactusGroup.children.length = 0
  }

  const respawnPterodactyl = () => {
    nextPterodactylResetTime = clock.elapsedTime + PTERODACTYL_SPAWN_INTERVAL
    pterodactyl.position.x = PTERODACTYL_SPAWN_X
    pterodactyl.position.y = randomFloat(PTERODACTYL_MIN_Y, PTERODACTYL_MAX_Y)
  }

  const handleInput = () => {
    const callback = () => {
      if (isGameOver) {
        restartGame()
        return
      }

      jump = true
    }

    document.addEventListener('keydown', callback, false)
    renderer.domElement.addEventListener('toustart', callback)
    renderer.domElement.addEventListener('click', callback)
  }

  const handleWindowResize = () => {
    window.addEventListener(
      'resize',
      () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
      },
      false
    )
  }

  const init = useCallback(() => {
    createInfoElement()
    createCamera()
    createRender()
    animate()
    createLighting()
    load3DModels()
    createFloor()
    createSkySphere()
    enableShadow(renderer, directionalLight)
    handleInput()
    handleWindowResize()
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return <div>恐龙跳跃小游戏</div>
}

export default Demo
