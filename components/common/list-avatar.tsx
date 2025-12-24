import { User } from '@/lib'
import { FlatList, View } from 'react-native'

import { useTheme } from '@/hooks'
import ColumnComponent from './column-component'
import MenuComponent from './menu-component'
import RowComponent from './row-component'
import TextComponent from './text-component'
import UserAvatar from './user-avatar'
import UserDetail from './user-detail'

interface ListAvatarProps {
    users: User[]
    iconSize?: number
    maxUsers?: number
    label?: string
}

export default function ListAvatar({ users, iconSize = 32, maxUsers = 3, label }: ListAvatarProps) {
    const { colors } = useTheme()
    const showUsers = users.slice(0, maxUsers)
    const remaining = users.length - maxUsers

    const wrapperWidth = iconSize + ((remaining > 0 ? maxUsers : users.length) - 1) * (iconSize * 0.7)

    return (
        <ColumnComponent gap={4} style={{ width: label ? undefined : wrapperWidth }}>
            {label && (
                <TextComponent
                    text={label}
                    type="label"
                />
            )}
            <MenuComponent
                menuChildren={() => (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <UserDetail user={item} />}
                        style={{ maxHeight: 400 }}
                        contentContainerStyle={{ gap: 15 }}
                    />
                )}
            >
                <RowComponent style={{ position: 'relative', height: iconSize }}>
                    {showUsers.map((user, index) => {
                        const isLast = index === maxUsers - 1 && remaining > 0

                        return (
                            <View
                                key={isLast ? 'more' : user.id }
                                style={{
                                    position: 'absolute',
                                    borderWidth: 2,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    left: index * (iconSize * 0.7),
                                    zIndex: maxUsers + index,
                                    borderColor: colors.onPrimary,
                                }}
                            >
                                <UserAvatar
                                    avatarSize={iconSize}
                                    avatarUrl={isLast ? undefined : user?.avatar}
                                    userName={isLast ? `+ ${remaining}` : user?.full_name}
                                    avatarColor={colors.primary + 'EF'}
                                />
                            </View>
                        )
                    })}
                </RowComponent>
            </MenuComponent>

        </ColumnComponent>
    )
}
