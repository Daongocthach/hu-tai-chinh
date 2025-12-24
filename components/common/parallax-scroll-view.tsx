import type { PropsWithChildren, ReactElement } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated'

import { useTheme } from '@/hooks'

const HEADER_HEIGHT = 200

type Props = PropsWithChildren<{
  children: ReactElement
  headerImage: ReactElement
  headerHeight?: number
}>

export default function ParallaxScrollView({
  children,
  headerImage,
  headerHeight = HEADER_HEIGHT
}: Props) {
  const { colors } = useTheme()
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOffset = useScrollOffset(scrollRef)
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    }
  })

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor: colors.background, flex: 1 }}
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: colors.background},
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <View style={styles.content}>{children}</View>
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 16,
    overflow: 'hidden',
  },
})
