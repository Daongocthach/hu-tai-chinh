import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import Toast from 'react-native-toast-message'

import { LoadingScreen } from '@/components'
import { GlobalAlertProvider } from '@/contexts/global-alert-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import { initDatabase } from '@/database/init-db'
import { FONT_FAMILIES } from '@/lib/constants'
import i18next from '@/locales'
import useStore from '@/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 0,
    },
    mutations: {
      retry: 0,
    }
  },
})

SplashScreen.preventAutoHideAsync()

const screens = [
  '(tabs)',
]

const modalScreens = [
]

export default function RootLayout() {
  const { darkMode } = useStore()
  const router = useRouter()
  const [loaded] = useFonts({
    [FONT_FAMILIES.REGULAR]: require('../assets/fonts/Poppins-Regular.ttf'),
    [FONT_FAMILIES.MEDIUM]: require('../assets/fonts/Poppins-Medium.ttf'),
    [FONT_FAMILIES.SEMIBOLD]: require('../assets/fonts/Poppins-SemiBold.ttf'),
    [FONT_FAMILIES.BOLD]: require('../assets/fonts/Poppins-Bold.ttf'),
  })
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    const bootstrap = async () => {
      await initDatabase()
      console.log('Database initialized')
      setDbReady(true)
    }

    bootstrap()
  }, [])

  useEffect(() => {
    if (loaded && dbReady) {
      SplashScreen.hideAsync()
    }
  }, [loaded, dbReady])

  if (!loaded || !dbReady) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView>
        <GlobalAlertProvider>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18next}>
              <Stack
                screenOptions={{
                  animation: 'slide_from_right',
                  contentStyle: {
                    backgroundColor: darkMode ? '#0D0A18' : 'FFFFFF',
                  }
                }}
              >
                {screens.map((screen) => (
                  <Stack.Screen
                    key={screen}
                    name={screen}
                    options={{
                      headerShown: false,
                    }} />
                ))}


              </Stack>
              <Toast />
            </I18nextProvider>
          </QueryClientProvider>
        </GlobalAlertProvider>
      </GestureHandlerRootView>
      <StatusBar backgroundColor='#000' style={darkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  )
}
