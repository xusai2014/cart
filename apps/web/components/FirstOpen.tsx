'use client'

import Grow from '@mui/material/Grow'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { ReactElement } from 'react'

const ENTER_MS = 360

export function FirstOpen({ children }: { children: ReactElement }) {
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true })

  return (
    <Grow in appear timeout={reduce ? 0 : ENTER_MS}>
      {children}
    </Grow>
  )
}
