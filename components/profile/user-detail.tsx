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
import { useEffect } from 'react'

type FormValues = {
  first_name: string
  last_name: string
  employee_code: string
}

export default function UserDetail() {
  const { userData, setActionName } = useStore()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      employee_code: userData?.employee_code || "",
    },
  })

  useEffect(() => {
    if (userData) {
      reset({
        first_name: userData.first_name,
        last_name: userData.last_name,
        employee_code: userData.employee_code || "",
      })
    }
  }, [userData])

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data: FormValues) =>
      authenApi.updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        employee_code: data.employee_code,
      }),
    onSuccess: (response) => {
      if (!userData) return
      const updatedData = {
        ...userData,
        ...response.data.data,
      }
      setActionName('userData', updatedData)
      showToast('update_success')
    },
  })

  const handleSubmitProfile = (data: FormValues) => {
    updateProfile(data)
  }

  const { mutate: getMeInformation, isPending } = useMutation({
    mutationFn: () => authenApi.me(),
    onSuccess: (response) => {
      const userData = response.data.data
      setActionName('userData', userData)
    },
  })

  return (
    <KeyboardAwareWrapper extraScrollHeight={20} extraHeight={20}>
      <CardContainer isBorder style={{ gap: 15 }}>
        <ButtonComponent
          isIconOnly
          iconProps={{ name: 'RefreshCcw', size: 20, color: 'primary' }}
          style={{ alignSelf: 'flex-end' }}
          onPress={() => getMeInformation()}
          loading={isPending}
        />
        <ChangeAvatar />
        <ColumnComponent gap={2}>
          <TextComponent text='profile' type='display' />
          <TextComponent type='label' text='update your personal details' />
        </ColumnComponent>

        <Controller
          control={control}
          name="first_name"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextInputComponent
              label="first name"
              placeholder="enter your first name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="last_name"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextInputComponent
              label="last name"
              placeholder="enter your last name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="employee_code"
          render={({ field: { value, onChange } }) => (
            <TextInputComponent
              label="employee code"
              placeholder="enter your employee code"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <ButtonComponent
          textProps={{ text: 'submit' }}
          onPress={handleSubmit(handleSubmitProfile)}
          disabled={!isDirty || isUpdatingProfile || !isValid}
          loading={isUpdatingProfile}
        />

      </CardContainer>
    </KeyboardAwareWrapper>
  )
}
