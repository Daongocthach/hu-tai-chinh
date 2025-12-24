import { Image, View } from 'react-native'

import { useTheme } from '@/hooks'
import { getShortName } from '@/lib/utils'
import useStore from '@/store'
import TextComponent from './text-component'

export default function UserAvatar({
  avatarSize = 50,
  avatarUrl = '',
  userName = '',
  isMe = false,
  avatarColor,
  notShortName = false,
}: {
  avatarSize?: number
  avatarUrl?: string
  userName?: string
  isMe?: boolean,
  avatarColor?: string
  notShortName?: boolean
}) {
  const { colors } = useTheme()
  const { userData } = useStore()
  const shortName = notShortName ? userName ?? '' : getShortName(isMe ? userData?.full_name : (userName ?? ''))

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.primaryContainer,
        }}
        resizeMode="cover"
      />
    )
  }
  if (isMe && userData?.avatar) {
    return (
      <Image
        source={{ uri: userData.avatar }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.primary,
        }}
        resizeMode="cover"
      />
    )
  }

  return (
    <View
      style={{
        backgroundColor: avatarColor ?? colors.primary,
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextComponent
        style={{
          color: '#ffffff',
          lineHeight: avatarSize * 0.4,
        }}
        type='title1'
        size={avatarSize * 0.3}
        text={shortName}
      />
    </View>
  )
}