import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import type { StateStorage } from 'zustand/middleware'

const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const storage: StateStorage = {
  getItem: async (name) => {
    try {
      if (Platform.OS === 'web') {
        if (!isBrowser()) return null // ⬅️ CHỐT HẠ
        return window.localStorage.getItem(name)
      }
      return await AsyncStorage.getItem(name)
    } catch (e) {
      console.error('Storage getItem error:', e)
      return null
    }
  },

  setItem: async (name, value) => {
    try {
      if (Platform.OS === 'web') {
        if (!isBrowser()) return
        window.localStorage.setItem(name, value)
        return
      }
      await AsyncStorage.setItem(name, value)
    } catch (e) {
      console.error('Storage setItem error:', e)
    }
  },

  removeItem: async (name) => {
    try {
      if (Platform.OS === 'web') {
        if (!isBrowser()) return
        window.localStorage.removeItem(name)
        return
      }
      await AsyncStorage.removeItem(name)
    } catch (e) {
      console.error('Storage removeItem error:', e)
    }
  },
}
