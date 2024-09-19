import React, { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import TRexSceneGltf from './models/t-rex/scene.gltf'

const Demo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let trex: THREE.Group
  let directionalLight: THREE.DirectionalLight
  const scene = new THREE.Scene()
  const clock = new THREE.Clock()
  const mixers: THREE.AnimationMixer[] = []

  const createCamera = useCallback(() => {
    camera = new THREE.PerspectiveCamera(45, window.innerHeight / window.innerHeight)
    camera.position.set(0, 1, 10)
    camera.lookAt(3, 3, 0)
  }, [])

  const createRender = useCallback(() => {
    if (canvasRef.current) {
      renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x7f7f7f)
      renderer.outputColorSpace = THREE.SRGBColorSpace
    }
  }, [canvasRef.current])

  const load3DModels = useCallback(() => {
    const loader = new GLTFLoader()

    loader.load(TRexSceneGltf, function (gltf) {
      console.log('gltf:', gltf)
      const mesh = gltf.scene.children[0] //获取Mesh
      console.log('mesh:', mesh)
      trex = gltf.scene
      trex.scale.setScalar(0.5)
      trex.rotation.y = Math.PI / 2

      scene.add(trex)

      // THREE.AnimationMixer 是 Three.js 中用于管理和播放动画的类。
      const mixer = new THREE.AnimationMixer(trex)
      const clip = THREE.AnimationClip.findByName(gltf.animations, 'run')
      console.log('clip:', clip)
      if (clip) {
        const action = mixer.clipAction(clip)
        action.play()
      }

      mixers.push(mixer)
      console.log('mixer:', mixer)
    })
  }, [])

  const createLighting = useCallback(() => {
    directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.intensity = 2
    directionalLight.position.set(0, 10, 0)

    scene.add(directionalLight)

    const targetObject = new THREE.Object3D()
    targetObject.position.set(0, 0, 0)

    directionalLight.target = targetObject

    const light = new THREE.AmbientLight(0x7f7f7f)
    light.intensity = 10

    scene.add(light)
  }, [])

  const update = (delta: number) => {
    if (!trex) return

    for (const mixer of mixers) {
      mixer.update(delta)
    }

    trex.traverse((child: any) => {
      child.castShadow = true
      child.receiveShadow = false
    })
  }

  const animate = useCallback(() => {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()

    update(delta)

    renderer.render(scene, camera)
  }, [])

  const enableShadow = useCallback(() => {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    directionalLight.castShadow = true

    if (directionalLight.shadow) {
      directionalLight.shadow.mapSize.width = 512
      directionalLight.shadow.mapSize.height = 512
      directionalLight.shadow.camera.near = 0.001
      directionalLight.shadow.camera.far = 500
    }
  }, [])

  useEffect(() => {
    createCamera()
    createRender()
    load3DModels()
    animate()
    createLighting()
    enableShadow()
  }, [createCamera, createRender, load3DModels, animate, createLighting, enableShadow])

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Demo
