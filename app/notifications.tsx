import { useState } from 'react'

import {
  AllNotifications,
  Container,
  Important,
  TabViewComponent,
  Unread,
} from '@/components'

const routes = [
  { key: 'unread', title: 'unread' },
  { key: 'important', title: 'important' },
  { key: 'all', title: 'all' },
]

export default function NotificationScreen() {
  const [index, setIndex] = useState(0)

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'unread':
        return <Unread />
      case 'important':
        return <Important />
      case 'all':
        return <AllNotifications />
      default:
        return null
    }
  }

  return (
    <Container headerTitle='notifications'>
      <TabViewComponent
        index={index}
        setIndex={setIndex}
        renderScene={renderScene}
        routes={routes}
        isAllLazy
      />
    </Container>
  )
}