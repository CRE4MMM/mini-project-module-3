import { FC } from 'react'

interface CategoryFilterProps {
    categories: string[]
    selectedCategory: string | null
    onSelect: (category: string) => void
}

const CategoryFilter: FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onSelect,
}) => {
    return (
        <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
            <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSelect(category)}
            >
            {category}
            </button>
        ))}
        </div>
    )
}

export default CategoryFilter
