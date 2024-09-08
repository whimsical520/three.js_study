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
  }
]
