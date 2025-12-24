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
import OTPInput from '@/components/authentication/otp-input'
import { ProgressStepsState, SignUpProps } from '@/lib'
import { useState } from 'react'

type SignUpVerifyFormInputs = {
  email: string,
  otp: string[],
  password: string,
  re_password: string,
  first_name: string,
  last_name: string,
  employee_code: string
}

export default function Register() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState<ProgressStepsState['activeStep']>(0)
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpVerifyFormInputs>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      otp: ["", "", "", "", "", ""],
      password: '',
      re_password: '',
      first_name: '',
      last_name: '',
      employee_code: '',
    },
  })
  const password = watch('password')

  const { mutateAsync: sendOTP, isPending: isPendingSendOTP } = useMutation({
    mutationFn: (email: string) => authenApi.sendOTP({ email }),
    onSuccess: () => {
      showToast('otp_sent_success')
      router.replace('/')
      setActiveStep(1)
    },
  })

  const { mutateAsync: verifyOTP, isPending: isPendingVerifyOTP } = useMutation({
    mutationFn: (data: { email: string, otp: string }) => authenApi.verifyOTP(data),
    onSuccess: () => {
      showToast('otp_sent_success')
      setActiveStep(2)
    },
  })

  const { mutateAsync: signUp, isPending: isPendingSignUp } = useMutation({
    mutationFn: (data: SignUpProps) => authenApi.register(data),
    onSuccess: () => {
      showToast('sign_up_success')
      router.replace('/')
    },
  })

  const submitEmail = async (data: SignUpVerifyFormInputs) => {
    await sendOTP(data.email)
  }

  const submitOTP = async (data: SignUpVerifyFormInputs) => {
    await verifyOTP({ email: data.email, otp: data.otp.join('') })
  }

  const submitRegister = async (data: SignUpVerifyFormInputs) => {
    await signUp({
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      employee_code: data.employee_code,
    })
  }

  const VerifyEmailForm = () => (
    <CardContainer isBorder style={{ marginVertical: 20 }}>
      <ColumnComponent gap={20}>
        <ColumnComponent gap={10}>
          <TextComponent text="register" type="title1" />
          <TextComponent
            text="register with your credentials"
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

  const VerifyOTPForm = () => (
    <CardContainer isBorder style={{ marginVertical: 20 }}>
      <ColumnComponent gap={10}>
        <TextComponent text="one-time password" type="title1" />
        <TextComponent
          text="please enter the one-time password sent to your email"
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
            />
          )}
        />
      </ColumnComponent>
    </CardContainer>
  )


  const RegisterForm = () => (
    <CardContainer isBorder style={{ marginVertical: 20 }}>
      <ColumnComponent gap={10}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value } }) => (
            <TextInputComponent
              label='email'
              readOnly
              value={value}
              hideClear
              rightIcon='CircleCheck'
            />
          )}
        />
        <Controller
          control={control}
          name="first_name"
          rules={{
            required: 'first name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label='first name'
              placeholder="enter your first name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.first_name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="last_name"
          rules={{
            required: 'last name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label='last name'
              placeholder="enter your last name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.last_name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'password is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label='password'
              placeholder="enter your password"
              isPassword
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="re_password"
          rules={{
            required: 're-enter password is required',
            validate: (value) =>
              value === password || 'password does not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label='re-enter password'
              placeholder="enter your re-enter password"
              isPassword
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.re_password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="employee_code"
          rules={{
            required: 'employee code is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label='employee code'
              placeholder="enter your employee code"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorMessage={errors.employee_code?.message}
            />
          )}
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
              imageSource={IMAGES.REGISTER_BANNER}
              title="manage your projects smarter"
              caption="get powerful tools to collaborate, track, and achieve more — all in one place"
            />
            <VerifyEmailForm />
          </ProgressStep>
          <ProgressStep
            label='verify otp'
            onNext={() => handleSubmit(submitOTP)()}
            onPrevious={() => setActiveStep(0)}
            loading={isPendingVerifyOTP}
          >
            <Overview
              imageSource={IMAGES.REGISTER_BANNER}
              title="manage your projects smarter"
              caption="get powerful tools to collaborate, track, and achieve more — all in one place"
            />
            <VerifyOTPForm />
          </ProgressStep>
          <ProgressStep
            label='credentials'
            onSubmit={handleSubmit(submitRegister)}
            loading={isPendingSignUp}
            hidePreviousButton
          >
            <RegisterForm />
          </ProgressStep>
        </ProgressSteps>
      </ColumnComponent>
    </Container>
  )
}