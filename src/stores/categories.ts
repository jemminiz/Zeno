import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    allCategories: JSON.parse(localStorage.getItem('categories') || '[]')
  }),
  actions: {
    addCategory(category: { name: string, color: string }) {
      this.allCategories.push(category)
      localStorage.setItem('categories', JSON.stringify(this.allCategories))
    },
    updateCategoryColor(name: string, color: string) {
      const cat = this.allCategories.find(c => c.name === name)
      if (cat) {
        cat.color = color
        localStorage.setItem('categories', JSON.stringify(this.allCategories))
      }
    },
    loadCategories() {
      this.allCategories = JSON.parse(localStorage.getItem('categories') || '[]')
    }
  }
})
