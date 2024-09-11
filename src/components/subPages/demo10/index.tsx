import React, { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Demo: React.FC = () => {
  const THREE = window.THREE

  useEffect(() => {
    /**
     * 创建场景对象Scene
     */
    const scene = new THREE.Scene()

    const geometry = new THREE.BoxGeometry(40, 100, 40)
    const material = new THREE.MeshLambertMaterial({
      color: 0x0000ff
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // 设置产生投影的网格模型
    mesh.castShadow = true

    // 创建一个平面几何体作为投影面
    const planeGeometry = new THREE.PlaneGeometry(300, 200);
    const planMaterial = new THREE.MeshLambertMaterial({
      color: 0x999999
    })

    // 平面网格模型作为投影面
    const planMesh = new THREE.Mesh(planeGeometry, planMaterial)
    scene.add(planMesh) // 网格模型添加到场景中
    planMesh.rotateX(-Math.PI / 2) // 旋转网格模型
    planMesh.position.y = -50 // 设置网格模型y坐标
    // 设置接收阴影的投影面
    planMesh.receiveShadow = true

    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    // 设置光源位置
    directionalLight.position.set(60, 100, 40)
    scene.add(directionalLight)
    directionalLight.castShadow = true
    // 设置计算阴影的区域，最好刚好紧密包围在对象周围
    // 计算阴影的区域过大；模糊 过小； 看不到或显示不完整
    directionalLight.shadow.camera.near = .5
    directionalLight.shadow.camera.far = 300
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -100;
    // 设置mapSize属性可以使阴影更清晰，不那么模糊
    // directionalLight.shadow.mapSize.set(1024,1024)
    console.log(directionalLight.shadow.camera);

    // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
    const axisHelper = new THREE.AxisHelper(250)
    scene.add(axisHelper)

    /**
     * 相机设置
     */
    const width = window.innerWidth
    const height = window.innerHeight
    const k = width / height
    const s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大
    // 创建相机对象
    const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
    camera.position.set(200, 300, 200) // 设置相机位置
    camera.lookAt(scene.position) // 设置相机方向（指向的场景对象）

    /**
     * 创建渲染器对象
     */
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height) // 设置渲染区域尺寸
    renderer.setClearColor(0xb9d333, 1) // 设置背景颜色
    document.body.appendChild(renderer.domElement) // body 元素中插入canvas对象

    function render() {
      // 执行渲染操作 指定场景、相机作为参数
      renderer.render(scene, camera)
    }

    render()

    const controls = new OrbitControls(camera, renderer.domElement) // 创建控件对象
    controls.addEventListener('change', render)
  }, [])

  return <div>Three.js光照阴影实时计算</div>
}

export default Demo
