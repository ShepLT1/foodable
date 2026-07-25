import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders title and children when open', () => {
    render(
      <Modal open title="Welcome">
        <p>Body content</p>
      </Modal>,
    )

    expect(screen.getByText('Welcome')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} title="Welcome">
        <p>Body content</p>
      </Modal>,
    )

    expect(screen.queryByText('Welcome')).not.toBeInTheDocument()
    expect(screen.queryByText('Body content')).not.toBeInTheDocument()
  })

  it('calls onClose on Escape when dismissible', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Dismissible">
        <p>Body content</p>
      </Modal>,
    )

    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('stays open on Escape when non-dismissible (no onClose)', () => {
    render(
      <Modal open title="Locked">
        <p>Body content</p>
      </Modal>,
    )

    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })
})
