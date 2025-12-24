import { useMutation } from '@tanstack/react-query'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

import IconComponent from '@/components/common/icon-component'
import UserAvatar from '@/components/common/user-avatar'

import { showToast } from '@/alerts'
import authenApi from '@/apis/authen.api'
import { useImagePicker, useTheme } from '@/hooks'
import { FileProps } from '@/lib'
import useStore from '@/store'

export default function ChangeAvatar() {
    const { userData, setActionName } = useStore()
    const { colors } = useTheme()
    const { openImagePicker } = useImagePicker()

    const { mutate: updateAvatar, isPending } = useMutation({
        mutationFn: (data: FileProps) => authenApi.updateAvatar(data),
        onSuccess: (response) => {
            setActionName('userData', response.data.data)
            showToast('avatar_updated')
        },
    })

    return (
        <View
            style={{
                padding: 12,
                borderRadius: 100,
                position: 'relative',
                backgroundColor: colors.primaryContainer,
                alignSelf: 'center'
            }}
        >
            <UserAvatar
                avatarSize={70}
                userName={userData?.full_name}
                avatarUrl={userData?.avatar}
            />

            <TouchableOpacity
                onPress={() => openImagePicker((file) => {
                    updateAvatar(file)
                })}
                disabled={isPending}
            >
                <View
                    style={{
                        padding: 4,
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: colors.background,
                        borderRadius: 20,
                    }}
                >
                    {isPending ?
                        <ActivityIndicator size='small' color={colors.secondary} />
                        :
                        <IconComponent name='Settings2' size={20} />
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}
