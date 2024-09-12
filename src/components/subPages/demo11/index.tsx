import React, { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import demoImg from './demo.jpg'

const Demo: React.FC = () => {
  const THREE = window.THREE

  useEffect(() => {
    /**
     * 创建场景对象Scene
     */
    const scene = new THREE.Scene()

    // 纹理贴图映射到一个矩形平面上
    const geometry = new THREE.PlaneGeometry(204, 102) // 矩形平面
    // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
    const textureLoader = new THREE.TextureLoader()
    console.log('demoImg:', demoImg)
    // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
    textureLoader.load(demoImg, function (texture: any) {
      console.log('texture:', texture)
      const material = new THREE.MeshLambertMaterial({
        // color: 0x000ff,
        // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
        transparent: true,
        opacity: 1,
        map: texture // 设置颜色贴图属性值
      }) // 材质对象Material
      const mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
      scene.add(mesh) // 网格模型添加到场景中

      render()
    })

    // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
    const axisHelper = new THREE.AxisHelper(250)
    scene.add(axisHelper)

    /**
     * 光源设置
     */
    // 点光源
    const point = new THREE.AmbientLight(0xffffff)
    point.position.set(400, 200, 300) // 点光源位置
    scene.add(point) // 点光源添加到场景中

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

    const controls = new OrbitControls(camera, renderer.domElement) // 创建控件对象
    controls.addEventListener('change', render)
  }, [])

  return <div>创建纹理贴图</div>
}

export default Demo
