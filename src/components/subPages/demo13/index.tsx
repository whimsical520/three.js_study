import React, { useEffect, useRef } from 'react'
import * as TWEEN from 'tween.js'
// import THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import img01 from './00125.jpg'
import bgm from './bgm.m4a'
import testJPEG from './test.jpeg'

const Demo: React.FC = () => {
  const THREE = window.THREE
  let camera: any = null
  let scene: any = null
  let tween: any = null
  
  const handleClickToRight = () => {
    // // 设置相机位置
    // camera.position.set(1.87, 1.03, 0.4)
    // // 设置相机指向的位置
    // camera.lookAt(scene.position)

    tween = new TWEEN.Tween({ x: camera.position.x, y: camera.position.y, z: camera.position.z })
    .to({ x: 1.87, y: 1.03, z: 0.4 }, 2000) // 目标位置和过渡时间
    .easing(TWEEN.Easing.Quadratic.InOut) // 缓动函数
    .onUpdate(function() {
        // 更新相机的位置
        camera.position.set(1.87, 1.03, 0.4);
    })
    .start(); // 开始过渡动画
  }

  const handleClickToLeft = () => {
     // 设置相机位置
     camera.position.set(-1.87, -1.03, 0.4)
     // 设置相机指向的位置
     camera.lookAt(scene.position)
  }

  useEffect(() => {
    scene = new THREE.Scene()
    // 创建一个半径为25，经度和维度各分为50的球体几何体
    const box = new THREE.SphereGeometry(25, 50, 50)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide
    })

    const mesh = new THREE.Mesh(box, material)
    scene.add(mesh)

    const textureLoader = new THREE.TextureLoader()
    const listener = new THREE.AudioListener()
    const audio = new THREE.Audio(listener)

    const texture = textureLoader.load(img01, function (obj: any) {
      const audioLoader = new THREE.AudioLoader()
      audioLoader.load(bgm, function (AudioBuffer: any) {
        audio.setBuffer(AudioBuffer)
        audio.setLoop(true)
        audio.setVolume(0.3)
        // audio.play()
      })

      render()
    })

    mesh.material.map = texture

    const width = window.innerWidth
    const height = window.innerHeight
    const k = width / height

    // PerspectiveCamera 是 Three.js 中用于创建透视投影相机的类。在 Three.js 中，相机用于定义场景中的视角和投影方式，影响了最终渲染结果的透视效果。
    // 以下是关于 PerspectiveCamera 的一些重要信息：

    // 透视投影：透视投影是一种常见的投影方式，模拟了人眼看到世界的方式，远处物体看起来较小，近处物体看起来较大，同时具有透视效果。
    // 创建透视相机：通过创建 PerspectiveCamera 对象，你可以定义相机的参数来控制场景的视角和透视效果。
    // 参数：在创建 PerspectiveCamera 对象时，你需要指定以下参数：
    // fov：视场角度，即相机视角的大小。
    // aspect：相机视锥体的宽高比。
    // near：相机视锥体近端面的距离。
    // far：相机视锥体远端面的距离。
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000)
    camera.zoom = 1
    // 在 Three.js 中，updateProjectionMatrix 是一个方法，用于更新相机的投影矩阵。投影矩阵是相机用来将三维场景坐标转换为二维屏幕坐标的关键矩阵。
    // 当你修改相机的参数（如 fov、aspect、near、far 等）时，为了使这些变化生效，你需要调用 updateProjectionMatrix 方法来更新相机的投影矩阵，确保相机的视锥体和投影效果是最新的。
    camera.updateProjectionMatrix()
    // 设置相机位置
    camera.position.set(-0.87, 0.03, 0.4)
    // 设置相机指向的位置
    camera.lookAt(scene.position)



    // WebGLRenderer 是 Three.js 中用于将场景渲染到 WebGL 上下文的类。它是 Three.js 中最重要的组件之一，负责将场景中的物体、光源、相机等元素渲染到屏幕上。

    // 以下是关于 WebGLRenderer 的一些重要信息：

    // 渲染器：WebGLRenderer 是 Three.js 中的渲染器，它使用 WebGL 技术来绘制 3D 场景，利用 GPU 加速实现高性能的渲染效果。
    // 创建渲染器：在使用 Three.js 创建 3D 场景时，你需要首先创建一个 WebGLRenderer 实例，并将其连接到 HTML 文档中的 DOM 元素中，以便在屏幕上显示渲染结果。
    // 渲染场景：通过调用 renderer.render(scene, camera) 方法，可以将场景中的物体根据相机的视角渲染到屏幕上。
    // 配置选项：在创建 WebGLRenderer 实例时，你可以指定一些配置选项，例如抗锯齿设置、渲染器大小等，以满足不同的需求。
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    })

    renderer.setSize(width, height)
    document.body.appendChild(renderer.domElement)


    // 在 Three.js 中，Clock 是用来跟踪时间的工具类。它可以用来管理和跟踪动画的时间，特别是在制作基于时间的动画效果时非常有用。
    const clock = new THREE.Clock()
    const FPS = 30
    const refreshTime = 1 / FPS
    let timeS = 0

    function render() {
      requestAnimationFrame(render)

      // 获取经过的时间
      const renderStep = clock.getDelta()

      timeS = timeS + renderStep

      if (timeS > refreshTime) {
        renderer.render(scene, camera)

        // if (vm.rotateBool) {
        //   mesh.rotateY(0.002)
        // }

        timeS = 0
      }
    }

    render()

    const controls = new OrbitControls(camera, renderer.domElement) // 创建控件对象
    controls.enablePan = false
  }, [])

  return <div>房子3D
    <button onClick={handleClickToRight}>向右</button>
    <button onClick={handleClickToLeft}>向左</button>
  </div>
}

export default Demo
