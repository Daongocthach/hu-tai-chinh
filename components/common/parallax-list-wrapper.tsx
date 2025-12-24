import { useTheme } from "@/hooks"
import React, { PropsWithChildren } from "react"
import { StyleSheet, ViewStyle } from "react-native"
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from "react-native-reanimated"
import TextComponent from "./text-component"

interface Props extends PropsWithChildren {
    header: React.ReactNode
    headerHeight?: number
    contentContainerStyle?: ViewStyle
    data: any[]
    renderItem: ({ item }: { item: any }) => React.ReactElement
    keyExtractor: (item: any) => string
    onEndReached?: () => void
    refreshing?: boolean
    onRefresh?: () => void
    isLoading?: boolean
    isFetchingNextPage?: boolean
}

const DEFAULT_HEADER_HEIGHT = 160

export default function ParallaxListWrapper({
    header,
    headerHeight = DEFAULT_HEADER_HEIGHT,
    contentContainerStyle,
    data,
    renderItem,
    keyExtractor,
    onEndReached,
    refreshing,
    onRefresh,
    isLoading,
    isFetchingNextPage,
}: Props) {
    const { colors } = useTheme()
    const scrollRef = useAnimatedRef<Animated.FlatList>()
    const offset = useScrollViewOffset(scrollRef)

    const headerStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            offset.value,
            [0, headerHeight],
            [1, 0.6],
            "clamp"
        )

        const opacity = interpolate(
            offset.value,
            [0, headerHeight * 0.8],
            [1, 0],
            "clamp"
        )

        return {
            transform: [{ scale }],
            opacity,
        }
    })

    return (
        <Animated.FlatList
            ref={scrollRef}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListFooterComponent={
                (isLoading || isFetchingNextPage) ? (
                    <TextComponent
                        style={{
                            textAlign: 'center',
                            marginVertical: 16,
                            color: colors.outlineVariant
                        }}
                        text="loading"
                    />
                ) : data.length > 0 ? (
                    (
                        <TextComponent
                            style={{
                                textAlign: 'center',
                                marginVertical: 16,
                                color: colors.outlineVariant
                            }}
                            text="end of page"
                        />
                    )
                ) : null
            }
            contentContainerStyle={[{ paddingTop: headerHeight + 12 }, contentContainerStyle]}
            ListHeaderComponent={
                <Animated.View style={[styles.headerContainer, { height: headerHeight }, headerStyle]}>
                    {header}
                </Animated.View>
            }
        />
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 10,
        justifyContent: "center",
        alignItems: "center",
    },
})
