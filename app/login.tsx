import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'

import {
  ButtonComponent,
  CardContainer,
  ColumnComponent,
  Container,
  HeaderAuthentication,
  KeyboardAwareWrapper,
  Overview,
  RowComponent,
  TextComponent,
  TextInputComponent
} from '@/components'

import { showToast } from '@/alerts'
import authenApi from '@/apis/authen.api'
import IMAGES from '@/assets/images'
import { LoginFormInputs } from '@/lib'
import useStore from '@/store'
import { AxiosError } from 'axios'

export default function Login() {
  const router = useRouter()
  const { signIn } = useStore()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: LoginFormInputs) => authenApi.login(data),
    onSuccess: (response) => {
      const {
        is_2fa_verify,
        is_locked,
        lock_time,
        email,
      } = response.data
      if (is_locked) {
        router.push({
          pathname: '/locked',
          params: {
            email: email,
            lock_time: lock_time,
          },
        })
      } else if (is_2fa_verify) {
        router.push({
          pathname: '/verify-login-2fa',
          params: { email: response.data.email },
        })
      } else {
        signIn(response.data)
        showToast('login_success')
        router.replace('/')
      }
    },
    onError: (error: AxiosError<any>) => {
      const res = error.response?.data
      if (!res) return

      if (res.data?.is_locked) {
        router.push({
          pathname: '/locked',
          params: res.data,
        })
      }
    }
  })


  const onSubmit = (data: LoginFormInputs) => {
    login(data)
  }

  return (
    <Container>
      <HeaderAuthentication isLogin />
      <KeyboardAwareWrapper>
        <Overview
          imageSource={IMAGES.LOGIN_BANNER}
          title="log in to level up your projects"
          caption="unlock tools to manage, collaborate, and excel. Take your projects further — smarter and faster"
        />
        <CardContainer isBorder style={{ marginTop: 20 }}>
          <ColumnComponent gap={20}>
            <ColumnComponent gap={10}>
              <TextComponent text="sign in" type="title1" />
              <TextComponent
                text="sign in with your credentials"
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
                    keyboardType="email-address"
                    autoCapitalize="none"
                    errorMessage={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'password is required',
                  minLength: {
                    value: 3,
                    message: 'password must be at least 3 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    placeholder="enter your password"
                    isPassword
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

            </ColumnComponent>

            <ButtonComponent
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              textProps={{ text: 'sign in' }}
            />
            <RowComponent justify='space-between'>
              <ButtonComponent
                isIconOnly
                onPress={() => router.push('/forgot-password')}
                loading={isPending}
                textProps={{ text: 'forgot password', color: 'primary' }}
              />
              <ButtonComponent
                isIconOnly
                onPress={() => router.push('/register')}
                loading={isPending}
                textProps={{ text: 'register', color: 'primary' }}
              />
            </RowComponent>
          </ColumnComponent>
        </CardContainer>
      </KeyboardAwareWrapper>
    </Container>
  )
}