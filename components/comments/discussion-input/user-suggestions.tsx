import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import UserAvatar from '@/components/common/user-avatar'
import { useTheme } from '@/hooks'
import { User } from '@/lib'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SuggestionsProvidedProps } from 'react-native-controlled-mentions'

type SuggestionsProps = SuggestionsProvidedProps & {
    suggestionUsers: User[]
    setTaggedUsers: (updater: (users: User[]) => User[]) => void
}

export default function UserSuggestions({
    keyword,
    suggestionUsers,
    onSelect,
    setTaggedUsers,
}: SuggestionsProps) {
    const { colors } = useTheme()
    if (keyword === undefined) return null

    const filteredSuggestions = suggestionUsers.filter((item) =>
        item.full_name.toLowerCase().includes(keyword.toLowerCase())
    )

    if (filteredSuggestions.length === 0) return null

    const handleSelectUser = (user: User) => {
        onSelect({
            id: String(user.id),
            name: user.full_name,
        })

        setTaggedUsers((prev) => {
            if (prev.some((item) => item.id === user.id)) return prev
            return [...prev, user]
        })
    }

    return (
        <View
            style={[
                styles.userListContainer,
                { borderColor: colors.outline, backgroundColor: colors.background },
            ]}
        >
            <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                <ColumnComponent gap={5}>
                    {filteredSuggestions.map((user) => (
                        <Pressable
                            key={user.id}
                            onPress={() => handleSelectUser(user)}
                            style={({ pressed }) => [
                                styles.userListItem,
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <RowComponent gap={10} style={{ alignItems: 'center' }}>
                                <UserAvatar
                                    avatarSize={25}
                                    avatarUrl={user.avatar}
                                    userName={user.full_name}
                                />
                                <TextComponent text={user.full_name} type="body" />
                            </RowComponent>
                        </Pressable>
                    ))}
                </ColumnComponent>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    userListContainer: {
        maxHeight: 200,
        borderRadius: 8,
        borderWidth: 1,
        padding: 8,
    },
    userListItem: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
})
