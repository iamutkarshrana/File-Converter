'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'
import { TOOLS } from '@/lib/tools'

const categories = [
  { key: 'all', label: 'All Tools' },
  { key: 'image', label: 'Images' },
  { key: 'video', label: 'Video' },
  { key: 'audio', label: 'Audio' },
  { key: 'document', label: 'Documents' },
  { key: 'ebook', label: 'eBooks' },
]

export default function ToolGrid() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredTools = activeCategory === 'all'
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory)

  return (
    <div>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={activeCategory === cat.key
              ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white' }
              : { background: 'var(--bg-surface)', color: 'var(--text-secondary)' }
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredTools.map(tool => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <p className="text-center py-12 text-sm" style={{ color: 'var(--text-tertiary)' }}>
          No tools found in this category.
        </p>
      )}
    </div>
  )
}
