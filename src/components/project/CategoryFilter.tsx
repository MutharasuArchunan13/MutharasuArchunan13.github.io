import { cn } from '@/utils/cn'

interface CategoryFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  const all = ['all', ...categories]

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            active === cat
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
