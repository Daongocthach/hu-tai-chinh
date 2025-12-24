import { AppTheme, darkTheme, lightTheme } from '@/lib'
import useStore from '@/store'
import { createContext, ReactNode } from 'react'

export const ThemeContext = createContext<AppTheme>(lightTheme)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { darkMode } = useStore()
  const theme = darkMode ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}