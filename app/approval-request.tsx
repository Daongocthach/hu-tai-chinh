import {
  ButtonComponent,
  ColumnComponent,
  Container,
  HeaderAuthentication,
  Overview
} from '@/components'

import { useMutation } from "@tanstack/react-query"
import { useTranslation } from 'react-i18next'

import { showAlert, showToast } from "@/alerts"
import userApi from '@/apis/user.api'
import IMAGES from '@/assets/images'
import { useCountdownSeconds } from '@/hooks/use-countdown'
import useStore from '@/store'

export default function Locked() {
  const { t } = useTranslation()
  const { refreshToken, signOut } = useStore()
  const {
    formatted,
    isExpired,
    start,
  } = useCountdownSeconds(60, false)

  const { mutate: sendUnlockRequest, isPending: isPendingVerifyOTP } =
    useMutation({
      mutationFn: () => userApi.requestActivateAccount(),
      onSuccess: () => {
        showToast('submit_success')
        start(60)
      },
    })

  const handleLogout = () => {
    showAlert('logout', () =>
      signOut({ refresh_token: refreshToken })
    )
  }

  return (
    <Container>
      <ColumnComponent gap={30}>
        <HeaderAuthentication title='approval request' isLogin />
        <Overview
          imageSource={IMAGES.LOGIN_BANNER}
          title="welcome to fine projects"
          caption="your account has not been approved yet. please click the button below to submit your approval request. thank you for joining us."
        />
        <ColumnComponent gap={10}>
          <ButtonComponent
            disabled={!isExpired}
            loading={isPendingVerifyOTP}
            onPress={() => sendUnlockRequest()}
            textProps={{
              text: isExpired
                ? t("approval request")
                : `${t("approval request")} (${formatted})`,
              color: 'onPrimary',
            }}
          />
          <ButtonComponent
            outline
            textProps={{ text: 'logout' }}
            onPress={handleLogout}
          />
        </ColumnComponent>
      </ColumnComponent>
    </Container>
  )
}