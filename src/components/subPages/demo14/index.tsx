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
   camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

   let renderer = new THREE.WebGLRenderer()
   renderer.setClearColor(0x000000)
   renderer.setSize(window.innerWidth, window.innerHeight)
   renderer.shadowMap.enabled = true

   let axes = new THREE.AxesHelper(20)
   scene.add(axes)

   let planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
   let planMatrices = new THREE.MeshLamberMaterial({
    color: 0xAAAAAA
   })
   let plane = new THREE.Mesh(planeGeometry, planMatrices)
   plane.position.set(15, 0, 0)
   plane.rotation.set(-0.5 * Math.PI, 0, 0)
   plane.receiveShadow = true
   scene.add(plane)

   // https://juejin.cn/post/7083068912627089438
  }, [])

  return <div>相机过渡
    <button onClick={handleClickToRight}>向右</button>
    <button onClick={handleClickToLeft}>向左</button>
  </div>
}

export default Demo
