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
  }
]
