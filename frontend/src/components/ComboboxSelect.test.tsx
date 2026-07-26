// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ComboboxSelect } from './ComboboxSelect'

const OPTIONS = ['Italian', 'Mexican', 'Thai']

function renderSelect(props = {}) {
  return render(
    <ComboboxSelect
      label="Cuisine Type"
      options={OPTIONS}
      value={null}
      onChange={() => {}}
      placeholder="Search or type"
      {...props}
    />,
  )
}

describe('ComboboxSelect', () => {
  it('renders the label and shows the selected value', () => {
    renderSelect({ value: 'Thai' })

    expect(screen.getByText('Cuisine Type')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('Thai')
  })

  it('filters options as you type', async () => {
    const user = userEvent.setup()
    renderSelect()

    await user.type(screen.getByRole('combobox'), 'ita')

    expect(
      await screen.findByRole('option', { name: 'Italian' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: 'Mexican' }),
    ).not.toBeInTheDocument()
  })

  it('calls onChange when an option is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderSelect({ onChange })

    await user.type(screen.getByRole('combobox'), 'mex')
    await user.click(await screen.findByRole('option', { name: 'Mexican' }))

    expect(onChange).toHaveBeenCalledWith('Mexican')
  })

  it('offers a custom value when allowCustom and no preset matches', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderSelect({ onChange, allowCustom: true })

    await user.type(screen.getByRole('combobox'), 'Cajun')
    await user.click(await screen.findByRole('option', { name: 'Use "Cajun"' }))

    expect(onChange).toHaveBeenCalledWith('Cajun')
  })
})
