import {
    ButtonComponent,
    CardContainer,
    ColumnComponent,
    Container,
    HeaderAuthentication,
    KeyboardAwareWrapper,
    NotFound,
    Overview,
    RowComponent,
    TextComponent
} from '@/components'

import { useMutation } from "@tanstack/react-query"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Controller, useForm } from "react-hook-form"

import { showToast } from "@/alerts"
import authenApi from "@/apis/authen.api"
import IMAGES from '@/assets/images'
import OTPInput from '@/components/authentication/otp-input'
import useStore from '@/store'

type Verify2FAFormInputs = {
    otp: string[],
}

export default function VerifyLogin2FA() {
    const { signIn } = useStore()
    const router = useRouter()
    const { email } = useLocalSearchParams()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<Verify2FAFormInputs>({
        mode: 'onSubmit',
        defaultValues: {
            otp: ["", "", "", "", "", ""],
        },
    })

    const { mutateAsync: verify2FA, isPending: isPendingVerifyOTP } = useMutation({
        mutationFn: (data: { email: string, otp: string }) => authenApi.verify2FA(data),
        onSuccess: (response) => {
            signIn(response.data)
            showToast('login_success')
            router.replace('/')
        },
    })
    const submitOTP = async (data: Verify2FAFormInputs) => {
        if (!email) return
        await verify2FA({ email: email as string, otp: data.otp.join('') })
    }

    if (!email) {
        return <NotFound />
    }

    return (
        <Container>
            <KeyboardAwareWrapper>
                <HeaderAuthentication title='two-factor authentication' />
                <Overview
                    imageSource={IMAGES.LOGIN_BANNER}
                    title="log in to level up your projects"
                    caption="unlock tools to manage, collaborate, and excel. Take your projects further — smarter and faster"
                />
                <CardContainer isBorder style={{ marginVertical: 20 }}>
                    <ColumnComponent gap={10}>
                        <TextComponent text="authentication code" type="title1" />
                        <TextComponent
                            text="enter the 6-digit code from your authenticator app"
                            type="label"
                        />
                        <ButtonComponent
                            isIconOnly
                            textProps={{ text: email as string }}
                            iconProps={{ name: 'Mail', size: 16 }}
                            buttonStyle={{ alignSelf: 'flex-start' }}
                        />
                        <Controller
                            control={control}
                            name="otp"
                            rules={{
                                required: 'otp is required',
                            }}
                            render={({ field: { onChange, value } }) => (
                                <OTPInput
                                    value={value}
                                    length={6}
                                    onChange={onChange}
                                    onResendOTP={() => handleSubmit(submitOTP)()}
                                    errorMessage={errors.otp?.message}
                                    hideResend
                                />
                            )}
                        />
                        <RowComponent justify='space-between' gap={10}>
                            <ButtonComponent
                                outline
                                textProps={{ text: 'cancel', color: 'onCardDisabled' }}
                                onPress={() => router.back()}
                                style={{ flex: 1 }}
                            />
                            <ButtonComponent
                                textProps={{ text: 'verify' }}
                                onPress={handleSubmit(submitOTP)}
                                loading={isPendingVerifyOTP}
                                style={{ flex: 1 }}
                            />
                        </RowComponent>
                    </ColumnComponent>
                </CardContainer>
            </KeyboardAwareWrapper>
        </Container>
    )
}