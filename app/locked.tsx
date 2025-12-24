import {
  ButtonComponent,
  ColumnComponent,
  Container,
  HeaderAuthentication,
  NotFound,
  Overview,
  RowComponent,
  TextComponent
} from '@/components'

import { useMutation } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useTranslation } from 'react-i18next'

import { showToast } from "@/alerts"
import authenApi from "@/apis/authen.api"
import IMAGES from '@/assets/images'
import { useCountdownSeconds } from '@/hooks/use-countdown'
import { addHours, format } from 'date-fns'

export default function Locked() {
  const { t } = useTranslation()
  const {
    formatted,
    isExpired,
    start,
  } = useCountdownSeconds(60, false)

  const { email, lock_time } = useLocalSearchParams() as {
    email?: string,
    lock_time?: string,
  }

  const { mutate: sendUnlockRequest, isPending: isPendingVerifyOTP } =
    useMutation({
      mutationFn: (data: { email: string }) =>
        authenApi.requestUnlockAccount(data),

      onSuccess: () => {
        showToast('submit_success')
        start(60)
      },
    })


  if (!email) {
    return <NotFound />
  }

  const lockTimeConverted = lock_time ?
    format(addHours(new Date(lock_time || ""), 2), "dd/MM/yyyy HH:mm") : 'N/A'

  const handleSendRequestUnlock = () => {
    if (!email || isPendingVerifyOTP || !isExpired) return
    sendUnlockRequest({ email })
  }
  return (
    <Container>
      <ColumnComponent gap={30}>
        <HeaderAuthentication title='locked' />
        <Overview
          imageSource={IMAGES.LOGIN_BANNER}
          title="your account has been locked"
          caption="please wait 2 hours to continue logging in or request us to unlock"
        />
        <TextComponent
          text={`${t("lock time until")}: ${lockTimeConverted}`}
          textAlign='center'
          type='label'
        />
        <RowComponent justify='space-between' gap={10}>
          <ButtonComponent
            disabled={!isExpired}
            loading={isPendingVerifyOTP}
            onPress={handleSendRequestUnlock}
            style={{ flex: 1 }}
            textProps={{
              text: isExpired
                ? t("send unlock request")
                : `${t("send unlock request")} (${formatted})`,
              color: 'onPrimary',
            }}
          />
        </RowComponent>
      </ColumnComponent>
    </Container>
  )
}