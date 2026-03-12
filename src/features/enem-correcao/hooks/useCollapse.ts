import { useState } from 'react'

export function useCollapse(defaultOpen = true) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const toggle = () => setIsOpen(v => !v)
  return { isOpen, toggle, setIsOpen }
}
