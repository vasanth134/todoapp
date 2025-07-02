import React, { createContext, useContext, useEffect, useState } from 'react'
import { theme } from 'antd'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
  antdTheme: any
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    // Apply theme class to body
    if (isDarkMode) {
      document.body.classList.add('dark-theme')
      document.body.classList.remove('light-theme')
    } else {
      document.body.classList.add('light-theme')
      document.body.classList.remove('dark-theme')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const antdTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: isDarkMode ? '#3b82f6' : '#2563eb',
      colorPrimaryHover: isDarkMode ? '#60a5fa' : '#1d4ed8',
      borderRadius: 12,
      borderRadiusLG: 16,
      colorBgContainer: isDarkMode ? '#1e293b' : '#ffffff',
      colorBgElevated: isDarkMode ? '#334155' : '#ffffff',
      colorBgLayout: isDarkMode ? '#0f172a' : '#f8fafc',
      colorText: isDarkMode ? '#f1f5f9' : '#1e293b',
      colorTextSecondary: isDarkMode ? '#cbd5e1' : '#64748b',
      colorBorder: isDarkMode ? '#475569' : '#e2e8f0',
      colorBorderSecondary: isDarkMode ? '#64748b' : '#f1f5f9',
      boxShadow: isDarkMode 
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' 
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      boxShadowSecondary: isDarkMode
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
    },
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, antdTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
