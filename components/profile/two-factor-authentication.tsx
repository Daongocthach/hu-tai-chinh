import { showAlert } from '@/alerts'
import authenApi from '@/apis/authen.api'
import CardContainer from '@/components/common/card-container'
import ColumnComponent from '@/components/common/column-component'
import RefreshControlComponent from '@/components/common/refresh-control-component'
import RowComponent from '@/components/common/row-component'
import SwitchComponent from '@/components/common/switch-component'
import TextComponent from '@/components/common/text-component'
import useStore from '@/store'
import { useMutation } from '@tanstack/react-query'
import { ScrollView } from 'react-native'
import ChangeAvatar from './change-avatar'

export default function TwoFactorAuthentication() {
  const { userData } = useStore()
  const { setActionName } = useStore()

  const { mutate: getMeInformation, isPending } = useMutation({
    mutationFn: () => authenApi.me(),
    onSuccess: (response) => {
      const userData = response.data.data
      setActionName('userData', userData)
    },
  })

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, paddingTop: 10 }}
      refreshControl={
        <RefreshControlComponent
          refreshing={isPending}
          onRefresh={getMeInformation}
        />
      }
    >
      <ColumnComponent gap={15}>
        <ChangeAvatar />
        <CardContainer isBorder style={{ gap: 15 }}>
          <RowComponent justify='space-between' alignItems='center'>
            <ColumnComponent gap={5} style={{ flexShrink: 1 }}>
              <TextComponent type='title1' text='two-factor authentication' />
              <TextComponent type='caption' text='please access the web interface to enable or disable two-factor authentication' />
            </ColumnComponent>

            <SwitchComponent
              textFalse='disabled'
              textTrue='enabled'
              value={userData?.is_2fa_verify || false}
              onToggle={() => showAlert('cannot_activate_two_factor_authentication')}
            />
          </RowComponent>
        </CardContainer>
      </ColumnComponent>
    </ScrollView>
  )
}