import { lazy } from 'react'
import type { LazyExoticComponent } from 'react'

export interface SubPageRoutesItem {
  title: string
  Component?: LazyExoticComponent<any>
  path?: string
  children?: SubPageRoutesItem[]
}

export const subPageRoutes: SubPageRoutesItem[] = [
  {
    title: '第一个three.js文件_WebGL三维场景',
    path: '/demo01',
    Component: lazy(() => import('~/components/subPages/demo01/index'))
  },
  {
    title: '旋转动画、requestAnimationFrame周期性渲染',
    path: '/demo02',
    Component: lazy(() => import('~/components/subPages/demo02/index'))
  },
  {
    title: '鼠标操作三维场景',
    path: '/demo03',
    Component: lazy(() => import('~/components/subPages/demo03/index'))
  },
  {
    title: '3D场景中插入新的几何体',
    path: '/demo04',
    Component: lazy(() => import('~/components/subPages/demo04/index'))
  },
  {
    title: '材质效果',
    path: '/demo05',
    Component: lazy(() => import('~/components/subPages/demo05/index'))
  },
  {
    title: 'threejs光源',
    path: '/demo06',
    Component: lazy(() => import('~/components/subPages/demo06/index'))
  },
  {
    title: '顶点位置数据解析渲染',
    path: '/demo07',
    Component: lazy(() => import('~/components/subPages/demo07/index'))
  },
  {
    title: '顶点颜色数据插值计算',
    path: '/demo08',
    Component: lazy(() => import('~/components/subPages/demo08/index'))
  },
  {
    title: '顶点法向量数据光照计算',
    path: '/demo09',
    Component: lazy(() => import('~/components/subPages/demo09/index'))
  },
  {
    title: 'Three.js光照阴影实时计算',
    path: '/demo10',
    Component: lazy(() => import('~/components/subPages/demo10/index'))
  },
]
