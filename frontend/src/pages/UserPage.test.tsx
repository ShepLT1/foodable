import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dashboard layout and main sections correctly', async () => {
    vi.mocked(api).mockImplementation((endpoint: string) => {
      if (endpoint === '/users/me') {
        return Promise.resolve({ display_name: 'Test Chef' })
      }
      if (endpoint.startsWith('/meal-plans')) {
        return Promise.resolve([])
      }
      if (endpoint === '/recipes') {
        return Promise.resolve([])
      }
      if (endpoint === '/lists') {
        return Promise.resolve([])
      }
      return Promise.resolve([])
    })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test Chef!/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Daily Nutrition Breakdown/i)).toBeInTheDocument()
    expect(screen.getByText(/Planned Meals/i)).toBeInTheDocument()
    expect(screen.getByText(/Grocery List Export/i)).toBeInTheDocument()
  })

  it('renders all meal slots (breakfast, lunch, dinner, snack)', async () => {
    vi.mocked(api).mockResolvedValue([])

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText(/breakfast \(0\)/i)).toBeInTheDocument()
      expect(screen.getByText(/lunch \(0\)/i)).toBeInTheDocument()
      expect(screen.getByText(/dinner \(0\)/i)).toBeInTheDocument()
      expect(screen.getByText(/snack \(0\)/i)).toBeInTheDocument()
    })
  })

  it('renders custom quick items in planned meal slots with macros', async () => {
    const todayStr = new Date().toLocaleDateString('en-CA')

    vi.mocked(api).mockImplementation((endpoint: string) => {
      if (endpoint === '/users/me') {
        return Promise.resolve({ display_name: 'John' })
      }
      if (endpoint.startsWith('/meal-plans')) {
        return Promise.resolve([
          {
            id: 'meal-1',
            user_id: 'user-1',
            recipe_id: null,
            custom_name: '{"name":"Burger","qty":1,"cal":500}',
            date: todayStr,
            slot: 'lunch',
            recipe: null,
          },
        ])
      }
      return Promise.resolve([])
    })

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText('Burger')).toBeInTheDocument()
      // Use getAllByText to handle 500 kcal matching both the summary banner and card
      expect(screen.getAllByText(/500 kcal/i).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('handles API fetch errors gracefully without crashing', async () => {
    vi.mocked(api).mockRejectedValue(new Error('Network error'))

    render(<UserPage />)

    await waitFor(() => {
      expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument()
    })
  })
})
