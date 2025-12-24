import {
    ButtonComponent,
    CardContainer,
    ColumnComponent,
    Container,
    HeaderAuthentication,
    Overview,
    ProgressStep,
    ProgressSteps,
    TextComponent,
    TextInputComponent
} from '@/components'

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { Controller, useForm } from "react-hook-form"

import { showToast } from "@/alerts"
import authenApi from "@/apis/authen.api"
import IMAGES from '@/assets/images'
import { useCountdownSeconds } from '@/hooks/use-countdown'
import { ProgressStepsState } from '@/lib'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type ForgotPasswordFormInputs = {
    email: string,
    otp: string[],
}

export default function ForgotPassword() {
    const { t } = useTranslation()
    const router = useRouter()
    const {
        formatted,
        isExpired,
        start,
    } = useCountdownSeconds(60, false)
    const [activeStep, setActiveStep] = useState<ProgressStepsState['activeStep']>(0)
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormInputs>({
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            otp: ["", "", "", "", "", ""],
        },
    })

    const { mutateAsync: forgotPassword, isPending: isPendingSendOTP } = useMutation({
        mutationFn: (email: string) => authenApi.forgotPassword({ email }),
        onSuccess: () => {
            showToast('otp_sent_success')
            router.replace('/')
            setActiveStep(1)
            start(60)
        },
    })

    const submitEmail = async (data: ForgotPasswordFormInputs) => {
        await forgotPassword(data.email)
    }

    const VerifyEmailForm = () => (
        <CardContainer isBorder style={{ marginVertical: 20 }}>
            <ColumnComponent gap={20}>
                <ColumnComponent gap={10}>
                    <TextComponent text="forgot password" type="title1" />
                    <TextComponent
                        text="we will send a password reset link to your email address"
                        type="label"
                    />
                </ColumnComponent>
                <ColumnComponent gap={10}>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: 'email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'invalid email format',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInputComponent
                                placeholder="enter your email"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                label="email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />
                </ColumnComponent>
            </ColumnComponent>
        </CardContainer>
    )

    const ChangePasswordLinkForm = () => (
        <CardContainer isBorder style={{ marginVertical: 20 }}>
            <ColumnComponent gap={10}>
                <TextComponent text="we have sent a password reset link to your email address" type="title1" />
                <TextComponent
                    text="please check your inbox (and spam folder) for an email from us"
                    type="label"
                />
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { value } }) => (
                        <ButtonComponent
                            isIconOnly
                            textProps={{ text: value }}
                            iconProps={{ name: 'Mail', size: 16 }}
                            buttonStyle={{ alignSelf: 'flex-start' }}
                        />
                    )}
                />
                <ButtonComponent
                    disabled={!isExpired}
                    loading={isPendingSendOTP}
                    onPress={handleSubmit(submitEmail)}
                    style={{ flex: 1 }}
                    textProps={{
                        text: isExpired
                            ? t("resend link")
                            : `${t("resend link")} (${formatted})`,
                        color: 'onPrimary',
                    }}
                />
            </ColumnComponent>
        </CardContainer>
    )


    return (
        <Container>
            <HeaderAuthentication title='sign up' />
            <ColumnComponent gap={20} style={{ flex: 1, marginTop: 20 }}>
                <ProgressSteps activeStep={activeStep} setActiveStep={setActiveStep} >
                    <ProgressStep
                        label='email'
                        onNext={() => handleSubmit(submitEmail)()}
                        loading={isPendingSendOTP}
                        hidePreviousButton
                    >
                        <Overview
                            imageSource={IMAGES.FORGOT_PASSWORD_BANNER}
                            title="empower your team, drive success"
                            caption="manage projects smarter. collaborate, track, and deliver outstanding results faster"
                        />
                        <VerifyEmailForm />
                    </ProgressStep>
                    <ProgressStep
                        label='verified'
                        onPrevious={() => setActiveStep(0)}
                        hideFinishButton
                        hideNextButton
                        hidePreviousButton
                    >
                        <Overview
                            imageSource={IMAGES.FORGOT_PASSWORD_BANNER}
                            title="empower your team, drive success"
                            caption="manage projects smarter. collaborate, track, and deliver outstanding results faster"
                        />
                        <ChangePasswordLinkForm />
                    </ProgressStep>
                </ProgressSteps>
            </ColumnComponent>
        </Container>
    )
}