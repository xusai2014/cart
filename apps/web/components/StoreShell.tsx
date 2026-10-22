'use client'

import AppBar from '@mui/material/AppBar'
import Badge from '@mui/material/Badge'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Snackbar from '@mui/material/Snackbar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Category } from '@/lib/types'
import { CartDrawer } from './CartDrawer'
import { FirstOpen } from './FirstOpen'
import { useCart } from './CartProvider'

export function StoreShell({
  categories,
  children,
}: {
  categories: Category[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { count, openDrawer, notice, clearNotice } = useCart()
  const shopSelected = pathname.startsWith('/c') || pathname === '/' || pathname.startsWith('/p')

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{
          bgcolor: 'rgba(243, 239, 232, 0.92)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: 72, px: { phone: 2, pad: 3, largePc: 5 } }}>
          <Typography
            component={Link}
            href="/"
            variant="h2"
            sx={{ fontSize: 22, textDecoration: 'none', mr: { phone: 'auto', pad: 1 } }}
          >
            Northline
          </Typography>
          <Box sx={{ display: { phone: 'none', pad: 'flex' }, gap: 0.5, flex: 1 }}>
            <Button component={Link} href="/c/all" color="inherit">
              Shop
            </Button>
            {categories.map((category) => (
              <Button key={category.id} component={Link} href={`/c/${category.id}`} color="inherit">
                {category.label}
              </Button>
            ))}
          </Box>
          <Box
            component="form"
            action="/c/all"
            method="get"
            sx={{
              display: { phone: 'none', smallPc: 'flex' },
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: 999,
              px: 2,
              minWidth: 220,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <InputBase name="q" placeholder="Search" inputProps={{ 'aria-label': 'Search' }} fullWidth />
          </Box>
          <IconButton aria-label={`Cart, ${count} items`} onClick={openDrawer} color="inherit">
            <Badge color="secondary" badgeContent={count} invisible={count === 0}>
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
        <Box
          component="form"
          action="/c/all"
          method="get"
          sx={{ display: { phone: 'block', smallPc: 'none' }, px: 2, pb: 1.5 }}
        >
          <InputBase
            name="q"
            placeholder="Search"
            inputProps={{ 'aria-label': 'Search' }}
            fullWidth
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 999,
              px: 2,
              py: 0.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        </Box>
      </AppBar>
      <FirstOpen>
        <Box component="main" sx={{ px: { phone: 2, pad: 3, smallPc: 4, largePc: 5 }, pb: { phone: 12, pad: 8 } }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>{children}</Box>
        </Box>
      </FirstOpen>
      <Box
        component="footer"
        sx={{
          px: { phone: 2, pad: 3, largePc: 5 },
          pb: { phone: 12, pad: 4 },
          color: 'text.secondary',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="body2">
            Northline is a demo storefront. Prices are mock. Checkout does not charge a card.
          </Typography>
        </Box>
      </Box>
      <CartDrawer />
      <Box
        sx={{
          display: { phone: 'block', pad: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(255, 252, 248, 0.96)',
        }}
      >
        <BottomNavigation showLabels value={shopSelected ? 'shop' : 'cart'}>
          <BottomNavigationAction
            label="Shop"
            value="shop"
            icon={<StorefrontOutlinedIcon />}
            component={Link}
            href="/c/all"
          />
          <BottomNavigationAction
            label="Cart"
            value="cart"
            icon={<ShoppingBagOutlinedIcon />}
            onClick={openDrawer}
          />
        </BottomNavigation>
      </Box>
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={2600}
        onClose={clearNotice}
        slots={{ transition: Grow }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={notice?.message}
        action={
          notice?.tone === 'success' ? (
            <Button color="inherit" size="small" onClick={openDrawer}>
              View
            </Button>
          ) : undefined
        }
        sx={{ mb: { phone: 8, pad: 0 } }}
      />
    </>
  )
}
