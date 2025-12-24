import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { LoadingScreen } from '@/components'
import { GlobalAlertProvider } from '@/contexts/global-alert-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import { useSocket } from '@/hooks'
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
  '(drawer)',
  'project',
  'profile',
  'notifications',
  'phases/[id]',
  'rooms/[id]',
  'meetings/[id]',
]

const authenScreens = [
  'login',
  'register',
  'locked',
  'forgot-password',
  'verify-login-2fa',
]

const modalScreens = [
  '(modals)/comment-modal',
  '(modals)/create-edit-room',
  '(modals)/create-edit-meeting',
  '(modals)/create-edit-meeting-online',
  '(modals)/create-edit-leave-request',
  '(modals)/create-edit-overtime-report',
  '(modals)/create-edit-timesheet',
]

export default function RootLayout() {
  useSocket()
  const { darkMode, isLoggedIn, userData } = useStore()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [loaded] = useFonts({
    [FONT_FAMILIES.REGULAR]: require('../assets/fonts/Poppins-Regular.ttf'),
    [FONT_FAMILIES.MEDIUM]: require('../assets/fonts/Poppins-Medium.ttf'),
    [FONT_FAMILIES.SEMIBOLD]: require('../assets/fonts/Poppins-SemiBold.ttf'),
    [FONT_FAMILIES.BOLD]: require('../assets/fonts/Poppins-Bold.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded, router])

  if (!loaded) {
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
                <Stack.Protected guard={isLoggedIn && userData?.status === true}>
                  {screens.map((screen) => (
                    <Stack.Screen
                      key={screen}
                      name={screen}
                      options={{
                        headerShown: false,
                      }} />
                  ))}

                  {modalScreens.map((screen) => (
                    <Stack.Screen
                      key={screen}
                      name={screen}
                      options={{
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'fade_from_bottom',
                        contentStyle: {
                          backgroundColor: 'transparent',
                        },
                      }}
                    />
                  ))}
                </Stack.Protected>

                <Stack.Protected guard={isLoggedIn && userData?.status !== true}>
                  <Stack.Screen
                    name='approval-request'
                    options={{
                      headerShown: false,
                      contentStyle: {
                        paddingTop: insets.top,
                        backgroundColor: darkMode ? '#0D0A18' : 'FFFFFF',
                      }
                    }}
                  />
                </Stack.Protected>

                <Stack.Protected guard={!isLoggedIn}>
                  {authenScreens.map((screen) => (
                    <Stack.Screen
                      key={screen}
                      name={screen}
                      options={{
                        headerShown: false,
                        contentStyle: {
                          paddingTop: insets.top,
                          backgroundColor: darkMode ? '#0D0A18' : 'FFFFFF',
                        }
                      }}
                    />))}
                </Stack.Protected>

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
