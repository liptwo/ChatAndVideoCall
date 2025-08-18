import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('appchatvideo-theme') || 'sunset',
  setTheme: (theme) => {
    localStorage.setItem('appchatvideo-theme', theme)
    set({ theme })
  }
}))
