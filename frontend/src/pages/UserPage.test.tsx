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
    // Force the hook to return loading states safely without using 'any'
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
    } as unknown as ReturnType<typeof useCurrentUser>)

    render(<UserPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the error state cleanly if user fetch breaks', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isPending: false,
      error: new Error('Failed to fetch user profiles'),
    } as unknown as ReturnType<typeof useCurrentUser>)

    render(<UserPage />)
    expect(screen.getByText('Error: Failed to fetch user profiles')).toBeInTheDocument()
  })

  it('renders a fallback message when no user object is found', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useCurrentUser>)

    render(<UserPage />)
    expect(screen.getByText('No user found.')).toBeInTheDocument()
  })

  it('renders user details successfully when data populates', () => {
    const mockUser = {
      id: 'usr_8971120',
      email: 'johnnysmith@oregonstate.edu',
      display_name: 'Johnny Smith',
    }

    vi.mocked(useCurrentUser).mockReturnValue({
      data: mockUser,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useCurrentUser>)

    render(<UserPage />)

    expect(screen.getByRole('heading', { name: 'Current User' })).toBeInTheDocument()
    expect(screen.getByText('usr_8971120')).toBeInTheDocument()
    expect(screen.getByText('johnnysmith@oregonstate.edu')).toBeInTheDocument()
    expect(screen.getByText('Johnny Smith')).toBeInTheDocument()
  })
})
