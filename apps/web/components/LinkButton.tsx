'use client'

import Button, { type ButtonProps } from '@mui/material/Button'
import Link from 'next/link'

type LinkButtonProps = Omit<ButtonProps, 'href'> & {
  href: string
}

export function LinkButton({ href, ...props }: LinkButtonProps) {
  return <Button component={Link} href={href} {...props} />
}
