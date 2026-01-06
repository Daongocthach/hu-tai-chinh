import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import { LanguageProps } from "@/lib"
import i18next from "@/locales"
import { storage } from "@/store/storage"

type StoreState = {
  darkMode: boolean
  currentLanguage: LanguageProps
  isLoading: boolean
  isLoggedIn: boolean
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
        }),
      },
    ),
  ),
)

export default useStore
