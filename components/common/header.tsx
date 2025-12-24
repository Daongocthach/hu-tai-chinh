import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Animated, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import notificationApi from '@/apis/notification.api'
import { useTheme } from "@/hooks"
import { QUERY_KEYS, SOCKET_CHANNELS } from '@/lib'
import useStore from '@/store'
import ChangeCompanyLogo from '../authentication/change-company-logo'
import ButtonComponent from './button-component'
import RowComponent from './row-component'
import TextComponent from './text-component'
import UserAvatar from './user-avatar'

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
  const { userData, socket, isSocketConnected } = useStore()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const [hasNewNotification, setHasNewNotification] = useState(false)

  const { data: count = 0 } = useQuery<number>({
    queryKey: [QUERY_KEYS.NOTIFICATIONS_COUNT],
    queryFn: async () => {
      const response = await notificationApi.unreadNotificationsCount()
      return response.data.data
    },
  })

  const runStarAnimation = () => {
    rotateAnim.setValue(0)

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    if (!socket) return

    const fetchNotificationsCount = () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS_COUNT] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.IMPORTANT] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
      setHasNewNotification(true)
      runStarAnimation()

      setTimeout(() => setHasNewNotification(false), 2000)
    }

    socket.on(SOCKET_CHANNELS.NOTIFICATIONS, fetchNotificationsCount)

    return () => {
      socket.off(SOCKET_CHANNELS.NOTIFICATIONS, fetchNotificationsCount)
    }
  }, [socket])


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
      {isShowSearch ? (
        <RowComponent gap={10} style={{ flexShrink: 1 }}>
          <TouchableOpacity onPress={() => router.replace('/')}>
            <ChangeCompanyLogo disabled/>
          </TouchableOpacity>
        </RowComponent>
      ) : (
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
      )}

      {!['notifications', 'profile'].includes(title) && (
        <RowComponent gap={6}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <UserAvatar
              avatarUrl={userData?.avatar}
              userName={userData?.full_name}
              avatarSize={45}
            />
          </TouchableOpacity>

          <View style={{ position: 'relative' }}>
            <Animated.View
              style={{
                transform: hasNewNotification
                  ? [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ]
                  : [],
              }}
            >
              <ButtonComponent
                iconProps={{
                  name: hasNewNotification
                    ? 'Star'
                    : isSocketConnected
                      ? 'Bell'
                      : 'BellOff',
                  size: 25,
                  color: hasNewNotification ? 'warning': 'onPrimary',
                }}
                backgroundColor={hasNewNotification ? 'warningContainer': 'primary'}
                buttonStyle={{ padding: 10, borderRadius: 100 }}
                onPress={() => router.push('/notifications')}
              />
            </Animated.View>


            <View
              style={{
                position: 'absolute',
                top: 6,
                right: 9,
                backgroundColor: colors.error,
                borderRadius: 10,
                width: 15,
                height: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >

              <TextComponent
                type='badge'
                size={7}
                color='onPrimary'
                text={count > 99 ? '99+' : count.toString()}
              />
            </View>
          </View>

          {navigation.openDrawer && (
            <ButtonComponent
              isIconOnly
              iconProps={{ name: 'TextAlignEnd', size: 25 }}
              onPress={() => navigation.openDrawer()}
            />
          )}
        </RowComponent>
      )}
    </RowComponent>
  )
}

export default Header
