// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserPage } from './UserPage'
import { useCurrentUser } from '../hooks/useCurrentUser'

// 1. Tell Vitest to mock the useCurrentUser hook file
vi.mock('../hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

const mockUseCurrentUser = (v: Partial<ReturnType<typeof useCurrentUser>>) =>
  vi.mocked(useCurrentUser).mockReturnValue(v as unknown as ReturnType<typeof useCurrentUser>)

describe('UserPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the loading state correctly', () => {
    // Look how clean this is now! No manual casting required inside the test blocks.
    mockUseCurrentUser({
      data: undefined,
      isPending: true,
      error: null,
    })

    render(<UserPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the error state cleanly if user fetch breaks', () => {
    mockUseCurrentUser({
      data: undefined,
      isPending: false,
      error: new Error('Failed to fetch user profiles'),
    })

    render(<UserPage />)
    expect(screen.getByText('Error: Failed to fetch user profiles')).toBeInTheDocument()
  })

  it('renders a fallback message when no user object is found', () => {
    mockUseCurrentUser({
      data: undefined,
      isPending: false,
      error: null,
    })

    render(<UserPage />)
    expect(screen.getByText('No user found.')).toBeInTheDocument()
  })

  it('renders user details successfully when data populates', () => {
    mockUseCurrentUser({
      data: {
        id: 'usr_8971120',
        email: 'tobi@oregonstate.edu',
        display_name: 'Tobi Fanibi',
      },
      isPending: false,
      error: null,
    })

    render(<UserPage />)

    expect(screen.getByRole('heading', { name: 'Current User' })).toBeInTheDocument()
    expect(screen.getByText('usr_8971120')).toBeInTheDocument()
    expect(screen.getByText('tobi@oregonstate.edu')).toBeInTheDocument()
    expect(screen.getByText('Tobi Fanibi')).toBeInTheDocument()
  })
})