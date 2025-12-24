import { showAlert } from '@/alerts'
import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import UserAvatar from '@/components/common/user-avatar'
import { useUser } from '@/hooks/use-user'
import { ROLE_MAP, User } from '@/lib'

export default function UserCard(user: User) {
    const {
        disableMutation,
        activeMutation,
    } = useUser({ id: user.id })

    const {
        avatar,
        full_name,
        email,
        role,
        status,
        is_disabled,
    } = user

    const handleDisable = () => {
        if (!is_disabled) {
            showAlert('disable_user_confirm', async () =>
                await disableMutation()
            )
        } else {
            disableMutation()
        }
    }

    const handleApprove = () => {
        showAlert('approval_user_confirm', async () => await activeMutation())
    }

    return (
        <CardContainer>
            <RowComponent gap={10} justify='space-between'>
                <RowComponent gap={15} style={{ flexShrink: 1 }}>
                    <ColumnComponent alignItems='center' gap={5}>
                        <UserAvatar
                            avatarSize={45}
                            avatarUrl={avatar}
                            userName={full_name}
                        />

                    </ColumnComponent>
                    <ColumnComponent gap={5} style={{ flexShrink: 1 }}>
                        <ChipComponent
                            textProps={{
                                text: ROLE_MAP?.[role]?.label,
                                color: ROLE_MAP?.[role]?.color,
                                numberOfLines: 1,
                            }}
                            rowProps={{
                                style: { alignSelf: 'flex-start' },
                                backgroundColor: ROLE_MAP?.[role]?.containerColor,
                            }}
                        />
                        <TextComponent
                            text={full_name}
                            type='title2'
                            numberOfLines={1}
                            style={{ flexShrink: 1 }}
                        />
                        <TextComponent
                            text={email}
                            type='caption'
                            numberOfLines={1}
                            style={{ flexShrink: 1 }}
                        />

                    </ColumnComponent>
                </RowComponent>
                {status === false ?
                    <ButtonComponent
                        isIconOnly
                        iconProps={{ name: 'CircleCheck', color: 'warning', size: 14 }}
                        textProps={{ text: 'approval', size: 12 }}
                        onPress={handleApprove}
                    />
                    :
                    <ButtonComponent
                        isIconOnly
                        iconProps={{ name: 'Ban', color: is_disabled ? 'warning' : 'error', size: 14 }}
                        textProps={{ text: is_disabled ? 'enable' : 'disable', size: 12 }}
                        onPress={handleDisable}
                    />
                }
            </RowComponent>
        </CardContainer>
    )
}

