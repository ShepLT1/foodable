import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserPage } from './UserPage'
import { api } from '../api/client'

vi.mock('../api/client', () => ({
  api: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number
    detail: string
    constructor(detail: string, status = 400) {
      super(detail)
      this.status = status
      this.detail = detail
    }
  },
}))

describe('UserPage Component', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  it('renders live profile data, grocery lists, and todays meals', async () => {
    vi.mocked(api).mockImplementation((endpoint: string) => {
      // 1. Check for lists/groceries
      if (endpoint.includes('list') || endpoint.includes('grocer')) {
        return Promise.resolve([
          {
            id: 'list-1',
            title: 'Weekly Groceries',
            created_at: '2026-07-20T12:00:00Z',
            items: [
              {
                id: 'item-1',
                name: 'Almond Milk',
                quantity: 1,
                checked: false,
              },
            ],
          },
        ])
      }

      // 2. Check for meal plans
      if (endpoint.includes('meal-plan')) {
        return Promise.resolve([])
      }

      // 3. Catch social endpoints BEFORE the generic 'user' check
      if (endpoint.includes('stats')) {
        return Promise.resolve({
          follower_count: 0,
          following_count: 0,
          is_following: false,
        })
      }
      if (endpoint.includes('followers') || endpoint.includes('following')) {
        return Promise.resolve([]) // Return array for lists
      }

      // 4. Check for user profile
      if (endpoint === '/users/me' || endpoint.includes('user')) {
        return Promise.resolve({
          id: '11111111-1111-1111-1111-111111111111',
          display_name: 'Test Chef',
          email: 'chef@foodable.com',
          created_at: '2026-07-20T12:00:00Z',
          dietary_restrictions: ['Vegan'],
          allergies: ['Peanuts'],
          preferences: [],
        })
      }

      return Promise.resolve([])
    })

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserPage />
        </BrowserRouter>
      </QueryClientProvider>,
    )

    // 1. Verify Live Profile Header
    expect(
      await screen.findByText(/Welcome back, Test Chef!/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/chef@foodable.com/i)).toBeInTheDocument()
    expect(screen.getByText('Vegan')).toBeInTheDocument()
    expect(screen.getByText('Avoids Peanuts')).toBeInTheDocument()

    // 2. Verify Live Grocery Lists Widget
    expect(
      screen.getByRole('heading', { name: /Grocery Lists/i }),
    ).toBeInTheDocument()
    expect(await screen.findByText('Weekly Groceries')).toBeInTheDocument()
    expect(screen.getByText('0/1 items')).toBeInTheDocument()

    // 3. Verify Today's Meals and Community sections
    expect(
      screen.getByRole('heading', { name: /Today's Meals/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Community/i }),
    ).toBeInTheDocument()
  })

  it('handles API fetch errors gracefully without crashing', async () => {
    vi.mocked(api).mockRejectedValue(new Error('Network error'))

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserPage />
        </BrowserRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText(/Welcome back!/i)).toBeInTheDocument()
  })
})
