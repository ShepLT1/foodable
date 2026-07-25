// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HeaderUserMenu } from './HeaderUserMenu'
import { supabase } from '../lib/supabase'

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { signOut: vi.fn() } },
}))

function renderMenu(props = {}) {
  return render(
    <MemoryRouter>
      <HeaderUserMenu name="Test User" email="test@example.com" {...props} />
    </MemoryRouter>,
  )
}

describe('HeaderUserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the avatar initial and keeps the menu closed', () => {
    renderMenu()

    expect(screen.getByLabelText('Account menu')).toHaveTextContent('T')
    expect(screen.queryByText('View Profile')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
  })

  it('opens on click and shows the account actions', async () => {
    renderMenu()

    fireEvent.click(screen.getByLabelText('Account menu'))

    expect(await screen.findByText('View Profile')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('links View Profile to /profile', async () => {
    renderMenu()

    fireEvent.click(screen.getByLabelText('Account menu'))

    expect(
      await screen.findByRole('menuitem', { name: 'View Profile' }),
    ).toHaveAttribute('href', '/profile')
  })

  it('signs out when Sign Out is clicked', async () => {
    renderMenu()

    fireEvent.click(screen.getByLabelText('Account menu'))
    fireEvent.click(await screen.findByText('Sign Out'))

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1)
  })
})
