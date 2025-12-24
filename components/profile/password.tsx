import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ColumnComponent from '@/components/common/column-component'
import KeyboardAwareWrapper from '@/components/common/keyboard-aware-wrapper'
import TextComponent from '@/components/common/text-component'
import TextInputComponent from '@/components/common/text-input-component'
import ChangeAvatar from './change-avatar'

import { showToast } from '@/alerts'
import authenApi from '@/apis/authen.api'
import useStore from '@/store'

type FormValues = {
  current_password: string
  new_password: string
  confirm_new_password: string
}

export default function Password() {
  const { refreshToken, signOut } = useStore()

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  })


  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      authenApi.changePassword({
        old_password: data.current_password,
        new_password: data.new_password,
      }),
    onSuccess: () => {
      showToast('update_success')
      signOut({ refresh_token: refreshToken })
    },
  })

  return (
    <KeyboardAwareWrapper extraScrollHeight={20} extraHeight={20}>
      <CardContainer isBorder style={{ gap: 15 }}>
        <ChangeAvatar />

        <ColumnComponent gap={2}>
          <TextComponent text='password' type='display' />
          <TextComponent type='label' text='provide a strong password to secure your account' />
        </ColumnComponent>

        <Controller
          control={control}
          name="current_password"
          rules={{
            required: "please enter your current password",
            minLength: {
              value: 8,
              message: "password must contain at least 8 characters",
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextInputComponent
              label="current password"
              placeholder="enter your current password"
              value={value}
              onChangeText={onChange}
              isPassword
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="new_password"
          rules={{
            required: "please enter your new password",
            minLength: {
              value: 8,
              message: "password must contain at least 8 characters",
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextInputComponent
              label="new password"
              placeholder="enter your new password"
              value={value}
              onChangeText={onChange}
              isPassword
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirm_new_password"
          rules={{
            required: "please re-enter your new password",
            validate: (value) =>
              value === watch("new_password") || "passwords do not match",
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <TextInputComponent
              label="confirm new password"
              placeholder="enter your confirm new password"
              value={value}
              onChangeText={onChange}
              isPassword
              errorMessage={error?.message}
            />
          )}
        />

        <ButtonComponent
          textProps={{ text: 'submit' }}
          onPress={handleSubmit((data) => changePassword(data))}
          loading={isPending}
        />
        <ButtonComponent
          textProps={{ text: 'forgot password' }}
          loading={isPending}
          ghost
          style={{ alignSelf: 'flex-end' }}
        />

      </CardContainer>
    </KeyboardAwareWrapper>
  )
}