import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from "@/hooks"
import ChangeCompanyLogo from '../authentication/change-company-logo'
import RowComponent from './row-component'

type DrawerNav = DrawerNavigationProp<any>

type HeaderProps = {
  title: string,
  isShowSearch?: boolean,
}

const Header = ({ title, isShowSearch = false }: HeaderProps) => {
  const { colors } = useTheme()
  const rotateAnim = useState(new Animated.Value(0))[0]
  const { name } = useLocalSearchParams<{ name: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <RowComponent
      justify='space-between'
      backgroundColor='background'
      style={{
        paddingHorizontal: 16,
        gap: 10,
        paddingTop: insets.top + 10,
        paddingBottom: 15,
      }}
    >
      <ChangeCompanyLogo disabled />


    </RowComponent>
  )
}

export default Header
