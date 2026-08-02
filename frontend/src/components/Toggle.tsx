import { Field, Label, Switch } from '@headlessui/react'

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <Field className="flex items-center gap-3">
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition`}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
      <Label className="text-sm text-gray-700 cursor-pointer">{label}</Label>
    </Field>
  )
}