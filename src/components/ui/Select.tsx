import { type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, id, ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900',
          'focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500',
          'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
)
Select.displayName = 'Select'
