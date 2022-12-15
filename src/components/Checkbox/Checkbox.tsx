import { Check } from "phosphor-react"
import React, { useState } from "react"

interface CheckboxProps {
  id: string
  checked: boolean
  onClick: (checked: boolean) => void
}

export function Checkbox(props: CheckboxProps) {
  const { id, checked, onClick } = props
  const handleCheck = () => {
    onClick(!checked)
  }
  return (
    <button
      id={id}
      type="button"
      onClick={handleCheck}
      className="w-5 h-5 bg-blue800 text-blue-400 flex items-center justify-center rounded-md cursor-pointer"
    >
      {checked ? <Check weight="bold" /> : null}
    </button>
  )
}
