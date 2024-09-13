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
  const tween: any = null

  useEffect(() => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0x000000)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true

    const axes = new THREE.AxisHelper(20)
    scene.add(axes)

    const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
    const planMatrices = new THREE.MeshLambertMaterial({
      color: 0xaaaaaa
    })
    const plane = new THREE.Mesh(planeGeometry, planMatrices)
    plane.position.set(15, 0, 0)
    plane.rotation.set(-0.5 * Math.PI, 0, 0)
    plane.receiveShadow = true
    scene.add(plane)

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    const cubeMatrices = new THREE.MeshLambertMaterial({
      color: 0xff0000
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMatrices)
    cube.castShadow = true
    cube.position.set(-4, 3, 0)
    scene.add(cube)

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    const sphereMatrices = new THREE.MeshLambertMaterial({
      color: 0x7777ff
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMatrices)
    sphere.position.set(20, 4, 2)
    sphere.castShadow = true
    scene.add(sphere)

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-40, 40, 15)
    spotLight.castShadow = true
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
    spotLight.shadow.camera.far = 130
    spotLight.shadow.camera.near = 40
    scene.add(spotLight)

    camera.position.set(-30, 40, 30)
    camera.lookAt(scene.position)

    const ambient = new THREE.AmbientLight(0x353535)
    scene.add(ambient)

    document.getElementById('WebGL-output')?.append(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement) // 创建控件对象

    controls.target = new THREE.Vector3(0, 0, 0)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    let intersects = null

    renderer.domElement.addEventListener('click', function (event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      intersects = raycaster.intersectObject(scene, true)

      if (intersects.length > 0) {
        const boxMaxY = new THREE.Box3().setFromObject(intersects[0].object).max.y

        const distance = boxMaxY + 10
        const angel = Math.PI / 5

        const position = {
          x: intersects[0].object.position.x + Math.cos(angel) * distance,
          y: intersects[0].object.position.y,
          z: intersects[0].object.position.z + Math.sin(angel) * distance
        }

        const tween = new TWEEN.Tween(camera.position).to(position, 3000)
        const tween1 = new TWEEN.Tween(controls.target).to(intersects[0].object.position, 3000)

        controls.enabled = false
        tween.onComplete(function () {
          controls.enabled = true
        })

        tween.start()
        tween1.start()
      }
    })

    function render() {
      requestAnimationFrame(render)
      TWEEN.update()
      controls.update()
      renderer.render(scene, camera)
    }

    render()

    // https://juejin.cn/post/7083068912627089438
  }, [])

  return (
    <div>
      相机过渡
      <div id='WebGL-output'></div>
    </div>
  )
}

export default Demo
