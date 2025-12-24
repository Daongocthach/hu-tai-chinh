import { useRouter } from 'expo-router'
import { View } from 'react-native'

import IMAGES from '@/assets/images'
import { ButtonComponent, ImageComponent, TextComponent } from '@/components'
import { useTheme } from '@/hooks'

export default function NoAccessScreen() {
  const { colors } = useTheme()
  const router = useRouter()

  return (
    <View>
      <ImageComponent
        source={IMAGES.FAILED}
        style={{
          width: 150,
          height: 150
        }}
        resizeMode="contain"
      />

      <TextComponent text='you do not have access to this page' type='title1' />
      <TextComponent text='please contact your administrator to get access' type='caption' />

      <ButtonComponent textProps={{ text: 'back to home' }} onPress={() => router.replace('/')} />
      <ButtonComponent textProps={{ text: 'logout' }} onPress={() => router.replace('/')} />
    </View>
  )
}
