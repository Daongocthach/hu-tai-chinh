import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'

interface ProgressBarProps {
    progress: number
    height?: number
    backgroundColor?: string
    progressColor?: string
}
const ProgressBar = ({
    progress,
    height = 10,
    backgroundColor = '#e5e7eb',
    progressColor = '#818cf8',
}: ProgressBarProps) => {
    const widthAnim = new Animated.Value(progress)

    Animated.timing(widthAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
    }).start()

    return (
        <View style={[styles.container, { height, backgroundColor }]}>
            <Animated.View
                style={[
                    styles.progress,
                    {
                        height,
                        backgroundColor: progressColor,
                        width: widthAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    },
                ]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
    },
    progress: {
        borderRadius: 8,
    },
})

export default ProgressBar
