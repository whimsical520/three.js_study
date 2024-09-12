import React, { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Demo: React.FC = () => {
  const THREE = window.THREE

  useEffect(() => {
    /**
     * 创建场景对象Scene
     */
    const scene = new THREE.Scene()
    /**
     * 创建网格模型
     */
    //长方体 参数：长，宽，高
    // const geometry = new THREE.BoxGeometry(100, 100, 100) // 创建一个立方体几何对象Geometry

    // 球体 参数：半径60  经纬度细分数40,40
    // const geometry = new THREE.SphereGeometry(60, 40, 40);

    // 圆柱  参数：圆柱面顶部、底部直径50,50   高度100  圆周分段数
    // const geometry = new THREE.CylinderGeometry( 50, 50, 100, 25 );

    // 正八面体
    // const geometry = new THREE.OctahedronGeometry(50);

    // 正十二面体
    // const geometry = new THREE.DodecahedronGeometry(50);

    // 正二十面体
    // const geometry = new THREE.IcosahedronGeometry(50);

    // const material = new THREE.MeshLambertMaterial({
    //   color: 0x0000ff
    // }) //材质对象Material
    // const mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh

    // scene.add(mesh) // 网格模型添加到场景中

    // 立方体网络模型
    const geometry1 = new THREE.BoxGeometry(100, 100, 100)
    const material1 = new THREE.MeshLambertMaterial({
      color: 0x000ff
    })
    const mesh1 = new THREE.Mesh(geometry1, material1)
    scene.add(mesh1)

    const geometry2 = new THREE.SphereGeometry(60, 40, 40)
    const material2 = new THREE.MeshLambertMaterial({
      color: 0xff00ff
    })
    const mesh2 = new THREE.Mesh(geometry2, material2)
    mesh2.translateY(120) // 球体网络模型沿Y轴正方向平移120
    scene.add(mesh2)

    // 圆柱网格模型
    const geometry3 = new THREE.CylinderGeometry(50, 50, 100, 25)
    const material3 = new THREE.MeshLambertMaterial({
      color: 0xffff00
    })
    const mesh3 = new THREE.Mesh(geometry3, material3) //网格模型对象Mesh
    // mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
    mesh3.position.set(120, 0, 0) //设置mesh3模型对象的xyz坐标为120,0,0
    scene.add(mesh3) //

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

  return <div>3D场景中插入新的几何体</div>
}

export default Demo
