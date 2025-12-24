import { Tabs } from 'expo-router'

import { BottomTabBar, Header, IconComponent } from '@/components'
import { useTheme } from '@/hooks'
import useStore from '@/store'

export default function TabLayout() {
  const { colors } = useTheme()
  const { projectStore } = useStore()

  const screens = [
    {
      name: 'index',
      title: 'overview',
      icon: 'LayoutPanelLeft' as const,
    },
    {
      name: 'history',
      title: 'history',
      icon: 'History' as const,
    },
    {
      name: 'members',
      title: 'members',
      icon: 'UsersRound' as const,
    },
  ]

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            header: () => <Header title={screen.name === 'index' ? projectStore.name : screen.title} />,
            tabBarIcon: ({ color }) => (
              <IconComponent size={24} name={screen.icon} color={color} />
            ),
            headerShown: true
          }}
        />
      ))}
    </Tabs>
  )
}