import { router } from "expo-router"
import { Socket } from "socket.io-client"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import { showToast } from "@/alerts"
import authenApi from "@/apis/authen.api"
import { LanguageProps, URL_FINEPRO, User } from "@/lib"
import i18next from "@/locales"
import { storage } from "@/store/storage"

type StoreState = {
  darkMode: boolean
  currentLanguage: LanguageProps
  isLoading: boolean
  isLoggedIn: boolean
  userData: User | null
  accessToken: string
  refreshToken: string
  isSocketConnected: boolean
  socket: Socket | null
  url: string | undefined
  socketUrl: string | undefined
  projectStore: {
    id: string,
    name: string,
  }
  signIn: (userData: User) => void
  signOut: (payload: { refresh_token: string, company_url?: string }) => void
  setSocket: (socket: Socket | null) => void
  changeLanguage: (language: LanguageProps) => void
  setDarkMode: (payload: boolean) => void
  setActionName: <key extends keyof StoreState>(key: key, value: StoreState[key]) => void
}

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        darkMode: false,
        currentLanguage: "en",
        isLoading: false,
        isLoggedIn: false,
        userData: null,
        accessToken: "",
        refreshToken: "",
        isSocketConnected: false,
        socket: null,
        url: URL_FINEPRO + "/api/v1/",
        socketUrl: URL_FINEPRO,
        projectStore: {
          id: "",
          name: "",
        },
        signIn: (userData) => {
          set({
            userData,
            accessToken: userData.access_token || "",
            refreshToken: userData.refresh_token || "",
            isLoggedIn: true
          })
        },
        signOut: async ({ refresh_token, company_url }) => {
          try {
            await authenApi.logout(refresh_token)
            showToast("logout_success")
          } catch (error) {
            showToast("logout_failed")
          } finally {
            set({
              userData: null,
              accessToken: "",
              refreshToken: "",
              isLoggedIn: false,
              ...company_url ? {
                url: company_url + "/api/v1/",
                socketUrl: company_url
              } : {},
            })
            router.replace('/login')
          }
        },
        setSocket: (socket) => {
          set({ socket })
        },
        setDarkMode: (payload) => {
          set({ darkMode: payload })
        },
        changeLanguage: (language: LanguageProps) => {
          set({ currentLanguage: language })
          i18next.changeLanguage(language)
        },
        setActionName: (key, value) => {
          set({ [key]: value })
        },
      }),
      {
        name: "hutaichinh",
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          darkMode: state.darkMode,
          currentLanguage: state.currentLanguage,
          isLoggedIn: state.isLoggedIn,
          userData: state.userData,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          url: state.url,
          socketUrl: state.socketUrl,
        }),
      },
    ),
  ),
)

export default useStore
