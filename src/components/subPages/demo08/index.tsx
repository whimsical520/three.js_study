import React, { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Demo: React.FC = () => {
  const THREE = window.THREE

  useEffect(() => {
    /**
     * 创建场景对象Scene
     */
    const scene = new THREE.Scene()

    // 创建一个Buffer类型几何体对象
    const geometry = new THREE.BufferGeometry()
    // 类型数组创建顶点数据
    const vertices = new Float32Array([
      0, // y
      0, // z
      0, // x 顶点1坐标
      50,
      0,
      0, // 顶点2坐标
      0,
      100,
      0, // 顶点3坐标
      0,
      0,
      10, // 顶点4坐标
      0,
      0,
      100, // 顶点5坐标
      50,
      0,
      10 // 顶点6坐标
    ])

    // 创建属性缓冲区对象
    const attribue = new THREE.BufferAttribute(vertices, 3) // 3个为一组，表示一个顶点的xyz坐标
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue

    // 类型数组创建顶点颜色color数据
    const colors = new Float32Array([
      1,
      0,
      0, // 顶点1颜色
      0,
      1,
      0, // 顶点2颜色
      0,
      0,
      1, // 顶点3颜色

      1,
      1,
      0, // 顶点4颜色
      0,
      1,
      1, // 顶点5颜色
      1,
      0,
      1 //顶点6颜色
    ])

    // 设置几何体attributes属性的颜色color属性
    geometry.attributes.color = new THREE.BufferAttribute(colors, 3) // 3个为1组，表示一个顶点
    // 材质对象
    const material = new THREE.PointsMaterial({
      // 使用顶点颜色数据渲染模型，不需要再定义color属性
      // color: 0xff0000,
      vertexColors: THREE.VertexColors, // 以顶点颜色为准
      size: 10.0 // 点对象像素尺寸
    })

    // 点渲染模式  点模型对象Points
    const points = new THREE.Points(geometry, material) //点模型对象
    scene.add(points) //点对象添加到场景

    const mesh = new THREE.Mesh(geometry, material) // 网络模型对象Mesh

    scene.add(mesh) // 网格模型添加到场景中

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

  return <div>顶点法向量数据光照计算</div>
}

export default Demo
