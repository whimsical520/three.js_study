import React, { Suspense, useMemo } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import LogoIcon from '~/images/logo.png'
import Demo from '~@/widget/demo'
import styles from './index.module.less'
import { subPageRoutes } from '~/routes/index'
import type { SubPageRoutesItem } from '~/routes/index'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const initRoutes: (menu: SubPageRoutesItem[]) => React.ReactNode = (
    menu: SubPageRoutesItem[]
  ) => {
    const r = subPageRoutes.map(({ path, Component }) => {
      if (!path) return null
      return (
        <Route
          key={`subpage_${path}`}
          path={`${path}`}
          element={
            Component ? (
              <Suspense>
                <Component />
              </Suspense>
            ) : null
          }
        ></Route>
      )
    })

    return r
  }

  const curPathName = useMemo(() => {
    const pathname = window.location.hash.split('#/')[1]

    return pathname
  }, [window.location.href, subPageRoutes])

  return (
    <div className={styles['home']}>
      <ul className={styles['menu-box']}>
        {subPageRoutes.map((i) => {
          return (
            <li
              className={`${i.path?.includes(curPathName) ? styles['active'] : ''}`}
              key={`route_${i.path}`}
              onClick={() => navigate(`${i.path}`)}
            >
              {i.title}
            </li>
          )
        })}
      </ul>
      <Routes>{initRoutes(subPageRoutes)}</Routes>
    </div>
  )
}

export default Home
