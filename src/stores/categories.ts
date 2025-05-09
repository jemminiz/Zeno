import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    allCategories: [] as { name: string, color: string }[],
    cards: [] as any[], // optional
  }),
  actions: {
    loadCategories() {
      const stored = localStorage.getItem('categories')
      if (stored) {
        this.allCategories = JSON.parse(stored)
      } else {
        // Default categories if none exist
        this.allCategories = [
          { name: 'Personal', color: '#EF4444' },  // red
          { name: 'Work', color: '#3B82F6' },      // blue
          { name: 'Study', color: '#10B981' },     // green
        ]
        localStorage.setItem('categories', JSON.stringify(this.allCategories))
      }
    },

    updateCategoryNames(updatedCategories: { name: string, color: string }[]) {
      this.allCategories = updatedCategories
      this.updateCardCategories(updatedCategories)
      localStorage.setItem('categories', JSON.stringify(this.allCategories))  // save after update
    },

    updateCardCategories(updatedCategories: { name: string, color: string }[]) {
      this.cards.forEach(card => {
        const category = updatedCategories.find(cat => cat.name === card.categoryName)
        if (category) {
          card.categoryName = category.name
          card.categoryColor = category.color
        }
      })
    },
  },
})
