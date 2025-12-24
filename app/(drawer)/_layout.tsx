import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer"
import { Drawer } from "expo-router/drawer"
import { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

import {
    ButtonComponent,
    ColumnComponent,
    CompanyItem,
    DrawerSection,
    Header,
    TextComponent
} from "@/components"
import { useTheme } from "@/hooks"
import { COMPANIES, DrawerItemProps, VERSION, VERSION_PATCH, } from "@/lib"

const drawerScreen: DrawerItemProps[] = [
    { name: "index", title: "my projects", icon: "Layers", path: "/" },
    { name: "my-tasks", title: "my tasks", icon: "SquarePen", path: "/my-tasks" },
    { name: "leave-request", title: "leave request", icon: "CalendarCheck", path: "/leave-request" },
    { name: "overtime-report", title: "overtime report", icon: "AlarmClock", path: "/overtime-report" },
    { name: "meetings", title: "meetings", icon: "Tv", path: "/meetings" },
    { name: "my-approvals", title: "my approvals", icon: "UserRoundCheck", path: "/my-approvals" },
    { name: "users", title: "users", icon: "Users", path: "/users" },
]

const systemScreen: DrawerItemProps[] = [
    { name: "settings", title: "settings", icon: "Cog", path: "/settings" },
]

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const { colors } = useTheme()
    const [isFlipped, setIsFlipped] = useState(false)
    const rotation = useSharedValue(0)

    const frontStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` }],
        opacity: interpolate(rotation.value, [0, 90, 180], [1, 0, 0]),
    }))

    const backStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg` }],
        opacity: interpolate(rotation.value, [0, 90, 180], [0, 0, 1]),
    }))

    const handleFlip = () => {
        rotation.value = withTiming(isFlipped ? 0 : 180, { duration: 500 })
        setIsFlipped(!isFlipped)
    }

    return (
        <DrawerContentScrollView {...props}>
            <ButtonComponent
                isIconOnly
                iconProps={{ name: "X", size: 20 }}
                style={{ alignSelf: 'flex-end', marginBottom: 8 }}
                onPress={() => {
                    props.navigation.closeDrawer()
                }}
            />
            <View>
                <Animated.View
                    style={[styles.absolute, frontStyle]}
                    pointerEvents={isFlipped ? 'none' : 'auto'}
                >
                    <TouchableOpacity
                        style={[styles.headerContainer, { backgroundColor: colors.cardVariant }]}
                        onPress={handleFlip}
                    >
                        <CompanyItem company={COMPANIES[0]} isDrawerHeader />
                    </TouchableOpacity>

                    <DrawerSection title='main' items={drawerScreen} />
                    <DrawerSection title='system' items={[
                        ...systemScreen,
                        { name: "login", title: "logout", icon: "LogOut", path: "/login" }
                    ]} />
                    <TextComponent
                        type="caption"
                        color='onCardDisabled'
                        text={VERSION + "." + VERSION_PATCH}
                        style={{ textTransform: 'uppercase' }}
                    />
                </Animated.View>

                <Animated.View
                    style={[styles.absolute, backStyle]}
                    pointerEvents={isFlipped ? 'auto' : 'none'}
                >
                    <ColumnComponent gap={20} style={{ marginTop: 10 }}>
                        <ButtonComponent
                            iconProps={{ name: "ChevronLeft", color: 'onBackground' }}
                            textProps={{ text: 'back' }}
                            onPress={handleFlip}
                            ghost
                            style={{ alignItems: 'flex-start' }}
                        />
                        {COMPANIES.map((company, index) => (
                            <CompanyItem key={index} company={company} />
                        ))}
                    </ColumnComponent>
                </Animated.View>
            </View>

        </DrawerContentScrollView>
    )
}


export default function DrawerLayout() {
    const { colors } = useTheme()
    return (
        <Drawer
            initialRouteName="index"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: { width: "70%", backgroundColor: colors.background },
                sceneStyle: { backgroundColor: colors.background },
            }}
        >
            {[...drawerScreen, ...systemScreen].map(screen => (
                <Drawer.Screen
                    key={screen.name}
                    name={screen.name}
                    options={{
                        headerShown: screen.name === "meetings" ? false : true,
                        header: () => <Header title={screen.title ?? ""} isShowSearch />,
                    }}
                />
            ))}
        </Drawer>
    )
}


const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        width: '100%',
        backfaceVisibility: 'hidden',
    },
    headerContainer: {
        padding: 12,
        borderRadius: 5,
        marginBottom: 8,
    },
})
