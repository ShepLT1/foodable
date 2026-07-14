// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserPage } from './UserPage'
import { useCurrentUser } from '../hooks/useCurrentUser'

// 1. Tell Vitest to mock the useCurrentUser hook file
vi.mock('../hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

describe('UserPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the loading state correctly', () => {
    // Force the hook to return loading states
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
    } as any)

    render(<UserPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the error state cleanly if user fetch breaks', () => {
    // Force the hook to return a connection error
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isPending: false,
      error: new Error('Failed to fetch user profiles'),
    } as any)

    render(<UserPage />)
    expect(screen.getByText('Error: Failed to fetch user profiles')).toBeInTheDocument()
  })

  it('renders a fallback message when no user object is found', () => {
    // Force the hook to return no data
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as any)

    render(<UserPage />)
    expect(screen.getByText('No user found.')).toBeInTheDocument()
  })

  it('renders user details successfully when data populates', () => {
    // Force the hook to return a mock database user profile row object
    const mockUser = {
      id: 'usr_8971120',
      email: 'tobi@oregonstate.edu',
      display_name: 'Tobi Fanibi',
    }

    vi.mocked(useCurrentUser).mockReturnValue({
      data: mockUser,
      isPending: false,
      error: null,
    } as any)

    render(<UserPage />)

    // Assertions: Verify headings and explicit user card details exist in DOM text nodes
    expect(screen.getByRole('heading', { name: 'Current User' })).toBeInTheDocument()
    expect(screen.getByText('usr_8971120')).toBeInTheDocument()
    expect(screen.getByText('tobi@oregonstate.edu')).toBeInTheDocument()
    expect(screen.getByText('Tobi Fanibi')).toBeInTheDocument()
  })
})