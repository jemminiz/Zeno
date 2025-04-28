import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Array<{ name: string, color: string }>>([
    { name: 'Personal', color: '#f87171' },
    { name: 'Work', color: '#60a5fa' },
    { name: 'Health', color: '#34d399' },
    { name: 'Finance', color: '#fbbf24' },
    { name: 'Other', color: '#c084fc' },
  ])

  function setCategoryColor(categoryName: string, color: string) {
    const category = categories.value.find(c => c.name === categoryName)
    if (category) {
      category.color = color
    }
  }

  function addCategory(categoryName: string, color: string) {
    categories.value.push({ name: categoryName, color })
  }

  return {
    categories,
    setCategoryColor,
    addCategory
  }
})
