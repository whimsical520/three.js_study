import React, { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const Demo: React.FC = () => {
  const THREE = window.THREE

  useEffect(() => {
    console.log('????')
    /**
     * 创建场景对象Scene
     */
    const scene = new THREE.Scene()
    /**
     * 创建网格模型
     */
    const geometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象Geometry
    const material = new THREE.MeshLambertMaterial({
      color: 0x0000ff
    }) //材质对象Material
    const mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
    console.log('mesh :', mesh )
    scene.add(mesh) // 网格模型添加到场景中
    /**
     * 光源设置
     */
    // 点光源
    const point = new THREE.PointLight(0xffffff)
    point.position.set(400, 200, 300) // 点光源位置
    scene.add(point) // 点光源添加到场景中
    // 环境光
    const ambient = new THREE.AmbientLight(0x444444)
    scene.add(ambient) 
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
    renderer.setClearColor(0xb9d333, 1)// 设置背景颜色
    document.body.appendChild(renderer.domElement) // body 元素中插入canvas对象

    function render() {
      // 执行渲染操作 指定场景、相机作为参数
      renderer.render(scene, camera)
    }

    render()

    const controls = new OrbitControls(camera, renderer.domElement) // 创建控件对象
    controls.addEventListener('change', render)
  }, [])

  return (
    <div>鼠标操作三维场景</div>
  )
}

export default Demo