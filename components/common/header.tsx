import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Animated, Image, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import IMAGES from '@/assets/images'
import ColumnComponent from '@/components/common/column-component'
import LinearTextComponent from '@/components/common/linear-text-component'
import { useTheme } from "@/hooks"
import ButtonComponent from './button-component'
import RowComponent from './row-component'
import TextComponent from './text-component'

type DrawerNav = DrawerNavigationProp<any>

type HeaderProps = {
  title: string,
  isShowSearch?: boolean,
}

const Header = ({ title, isShowSearch = false }: HeaderProps) => {
  const { colors } = useTheme()
  const rotateAnim = useState(new Animated.Value(0))[0]
  const { name } = useLocalSearchParams<{ name: string }>()
  const navigation = useNavigation<DrawerNav>()
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
      {router.canGoBack() ? (
        <RowComponent gap={10} style={{ flexShrink: 1 }}>
          <ButtonComponent
            onPress={() => router.back()}
            iconProps={{ name: 'ChevronLeft', size: 30 }}
            backgroundColor='primary'
            buttonStyle={{
              padding: 5,
              borderRadius: 100,
            }}
          />

          <TextComponent
            numberOfLines={1}
            style={{ flexShrink: 1 }}
            text={name ?? title}
            type='title'
          />
        </RowComponent>
      ) : (
        <RowComponent gap={10} style={{ flexShrink: 1 }}>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <RowComponent gap={5}>
              <Image
                source={IMAGES.LOGO}
                alt="fineprojects logo"
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
              <ColumnComponent>
                <LinearTextComponent
                  text="Hũ Tài "
                  textComponentProps={{
                    type: 'title1',
                  }}
                  fontSize={14}
                  colors={['#68cfe4', '#93d5ba', '#68cfe4']}
                />
                <LinearTextComponent
                  text="Chính  "
                  textComponentProps={{
                    type: 'title1',
                    fontWeight: 'bold',
                    style: { lineHeight: 17 },
                  }}
                  fontSize={15}
                  colors={['#68cfe4', '#93d5ba', '#68cfe4']}
                />
              </ColumnComponent>
            </RowComponent>
          </TouchableOpacity>
        </RowComponent>

      )}

    </RowComponent>
  )
}

export default Header
