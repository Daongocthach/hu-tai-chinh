import { useState } from 'react'

import {
  Container,
  Email,
  Password,
  TabViewComponent,
  TwoFactorAuthentication,
  UserDetail
} from '@/components'

const routes = [
  { key: 'profile', title: 'profile' },
  { key: 'email', title: 'email' },
  { key: 'password', title: 'password' },
  { key: 'two-factor-authentication', title: 'two-factor authentication' },
]

export default function ProfileScreen() {
  const [index, setIndex] = useState(0)


  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'profile':
        return <UserDetail />
      case 'email':
        return <Email />
      case 'password':
        return <Password />
      case 'two-factor-authentication':
        return <TwoFactorAuthentication />
      default:
        return null
    }
  }

  return (
    <Container headerTitle='profile'>
        <TabViewComponent
          index={index}
          setIndex={setIndex}
          renderScene={renderScene}
          routes={routes}
        />
    </Container>
  )
}