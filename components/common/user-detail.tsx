import { User } from '@/lib'

import { useTheme } from '@/hooks'
import ColumnComponent from './column-component'
import RowComponent from './row-component'
import TextComponent from './text-component'
import UserAvatar from './user-avatar'

export default function UserDetail({ user }: { user: User }) {
    const { colors } = useTheme()

    return (
        <RowComponent gap={10} alignItems="center" style={{ flexShrink: 1 }}>
            <UserAvatar
                avatarSize={30}
                avatarUrl={user?.avatar}
                userName={user?.full_name}
                avatarColor={colors.primary}
            />
            <ColumnComponent gap={2}>
                <TextComponent text={user.full_name} type="title1" size={12} style={{ lineHeight: 14 }} />
                <TextComponent text={user.email} type="caption" size={10} style={{ lineHeight: 13 }} />
            </ColumnComponent>
        </RowComponent>
    )
}