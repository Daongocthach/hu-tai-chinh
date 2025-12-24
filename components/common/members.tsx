import { useTheme } from '@/hooks'
import { User } from '@/lib'
import { useMemo } from 'react'
import { ScrollView, View } from 'react-native'
import ColumnComponent from './column-component'
import IconComponent from './icon-component'
import MenuComponent from './menu-component'
import RowComponent from './row-component'
import TextComponent from './text-component'
import UserAvatar from './user-avatar'
import UserDetail from './user-detail'

interface MembersProps {
    iconSize?: number
    members?: User[]
    membersLabel?: string
    managers?: User[]
    managersLabel?: string
    maxManagersLength?: number
    maxMembersLength?: number
    hideCrown?: boolean
}

export default function Members({
    iconSize = 32,
    members = [],
    membersLabel,
    managers = [],
    managersLabel,
    maxManagersLength = 1,
    maxMembersLength = 2,
    hideCrown = false,
}: MembersProps) {

    const { colors } = useTheme()

    const { renderedManagers, remainingManagers } = useMemo(() => {
        return {
            renderedManagers: managers.slice(0, maxManagersLength),
            remainingManagers: managers.slice(maxManagersLength),
        }
    }, [managers, maxManagersLength])

    const { renderedMembers, remainingMembers } = useMemo(() => {
        return {
            renderedMembers: members.slice(0, maxMembersLength),
            remainingMembers: members.slice(maxMembersLength),
        }
    }, [members, maxMembersLength])

    const managersCount = renderedManagers.length > 0 ? renderedManagers.length : 0
    const membersCount = renderedMembers.length > 0 ? renderedMembers.length : 0

    const wrapperWidth =
        (managersCount + membersCount - 1) * (iconSize * 0.7) + iconSize

    return (
        <ColumnComponent gap={4} style={{ width: wrapperWidth }}>
            <MenuComponent
                menuChildren={() => (
                    <ScrollView
                        style={{ maxHeight: 400 }}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <ColumnComponent gap={20}>

                            {managers.length > 0 && (
                                <ColumnComponent gap={10}>
                                    <TextComponent
                                        type="label"
                                        text={managersLabel || 'leaders'}
                                    />
                                    <ColumnComponent gap={15}>
                                        {managers.map((item) => (
                                            <UserDetail key={item.id} user={item} />
                                        ))}
                                    </ColumnComponent>
                                </ColumnComponent>
                            )}

                            {members.length > 0 && (
                                <ColumnComponent gap={10}>
                                    <TextComponent
                                        type="label"
                                        text={membersLabel || 'members'}
                                    />
                                    <ColumnComponent gap={15}>
                                        {members.map((item) => (
                                            <UserDetail key={item.id} user={item} />
                                        ))}
                                    </ColumnComponent>
                                </ColumnComponent>
                            )}

                        </ColumnComponent>
                    </ScrollView>
                )}

            >
                <RowComponent
                    style={{ position: 'relative', height: iconSize + (hideCrown ? 4 : 16) }}
                    alignItems="flex-end"
                >
                    {renderedManagers.map((user, index) => {
                        const isLast = index === maxManagersLength - 1 && remainingManagers.length > 0

                        return (
                            <ColumnComponent
                                key={isLast ? 'more-managers' : user.id}
                                alignItems="center"
                                style={{
                                    position: 'absolute',
                                    left: index * (iconSize * 0.7),
                                    zIndex: 100 + index,
                                }}
                            >

                                {!hideCrown &&
                                    <IconComponent
                                        name="Crown"
                                        size={16}
                                        color={'warning'}
                                        style={{
                                            marginBottom: -3,
                                        }}
                                    />
                                }

                                {isLast ? (
                                    <View
                                        style={{
                                            borderRadius: 999,
                                            backgroundColor: colors.primaryContainer,
                                            borderWidth: 2,
                                            borderColor: colors.onPrimary,
                                        }}
                                    >
                                        <UserAvatar
                                            avatarSize={iconSize}
                                            avatarUrl={user.avatar}
                                            userName={`+${remainingManagers.length}`}
                                            notShortName
                                        />
                                    </View>
                                ) : (
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderColor: colors.onPrimary,
                                            borderRadius: 999,
                                        }}
                                    >
                                        <UserAvatar
                                            avatarSize={iconSize}
                                            avatarUrl={user.avatar}
                                            userName={user.full_name}
                                        />
                                    </View>
                                )}
                            </ColumnComponent>
                        )
                    })}

                    {renderedMembers.map((user, index) => {
                        const offset = managersCount * (iconSize * 0.7)
                        const isLast = index === maxMembersLength - 1 && remainingMembers.length > 0

                        return (
                            <View
                                key={isLast ? 'more-members' : user.id}
                                style={{
                                    position: 'absolute',
                                    left: offset + index * (iconSize * 0.7),
                                    zIndex: 200 + index,
                                }}
                            >
                                {isLast ? (
                                    <View
                                        style={{
                                            borderRadius: 999,
                                            backgroundColor: colors.primaryContainer,
                                            borderWidth: 2,
                                            borderColor: colors.onPrimary,
                                        }}
                                    >
                                        <UserAvatar
                                            avatarSize={iconSize}
                                            userName={`+${remainingMembers.length}`}
                                            notShortName
                                        />
                                    </View>
                                ) : (
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderColor: colors.onPrimary,
                                            borderRadius: 999,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <UserAvatar
                                            avatarSize={iconSize}
                                            avatarUrl={user.avatar}
                                            userName={user.full_name}
                                        />
                                    </View>
                                )}
                            </View>
                        )
                    })}

                </RowComponent>
            </MenuComponent>
        </ColumnComponent>
    )
}
