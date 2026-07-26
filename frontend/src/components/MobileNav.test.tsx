// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MobileNav } from './MobileNav'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signOut: vi.fn() } },
}))

function renderNav() {
  return render(
    <MemoryRouter>
      <MobileNav />
    </MemoryRouter>,
  )
}

describe('MobileNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the hamburger with the drawer closed', () => {
    renderNav()

    expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('opens the drawer on click and shows the nav links', async () => {
    renderNav()

    fireEvent.click(screen.getByLabelText('Open menu'))

    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Recipes')).toBeInTheDocument()
    expect(screen.getByText('Grocery Lists')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })

  it('signs out when Sign Out is clicked', async () => {
    renderNav()

    fireEvent.click(screen.getByLabelText('Open menu'))
    fireEvent.click(await screen.findByText('Sign Out'))

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1)
  })
})
