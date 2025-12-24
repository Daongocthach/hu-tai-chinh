import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'

import {
    ButtonComponent,
    ColumnComponent,
    CommentCard,
    DiscussionInput,
    FlatListComponent,
    IconComponent,
    ModalWrapper,
    RowComponent,
    TextComponent
} from '@/components'
import { useCommentsInfiniteQuery, useKeyboard } from '@/hooks'
import { CommentContentClass, CommentDetails } from '@/lib'
import useStore from '@/store'
import { Platform, View } from 'react-native'

export default function CommentModal() {
    const keyboardHeight = useKeyboard()
    const router = useRouter()
    const { userData } = useStore()
    const { objectId, contentClass } = useLocalSearchParams<{
        objectId: string
        contentClass: CommentContentClass
    }>()

    const {
        comments,
        totalItems,
        members,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isLoading,
        isFetchingNextPage,
        isError,
        refetch,
    } = useCommentsInfiniteQuery({
        contentClass: contentClass,
        objectId: Number(objectId),
    })

    const otherUsers = useMemo(() => {
        return members?.filter((item) => item.email !== userData?.email) ?? []
    }, [members, userData?.email])

    return (
        <ModalWrapper isFullHeight>
            <FlatListComponent
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <ColumnComponent gap={5} style={{ marginBottom: 15 }} backgroundColor={'background'}>
                        <RowComponent gap={5} justify='space-between'>
                            <RowComponent gap={5}>
                                <IconComponent name='MessagesSquare' size={20} />
                                <TextComponent
                                    text={totalItems.toString()}
                                    type='label'
                                    color='icon'
                                />
                            </RowComponent>
                            <ButtonComponent
                                isIconOnly
                                iconProps={{ name: 'X', color: 'primary' }}
                                onPress={() => router.back()}
                            />
                        </RowComponent>
                        <TextComponent
                            text='discussion'
                            type='title'
                            textAlign='center'
                        />
                    </ColumnComponent>
                }
                stickyHeaderIndices={[0]}
                renderItem={({ item }: { item: CommentDetails }) => (
                    <CommentCard
                        comment={item}
                        contentClass={contentClass}
                        objectId={Number(objectId)}
                        otherUsers={otherUsers}
                    />
                )}
                onRefresh={refetch}
                refreshing={isRefetching}
                loadMore={fetchNextPage}
                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                isError={isError}
                hasMore={hasNextPage}
            />

            <View style={{
                minHeight: (Platform.OS === 'ios' ? 30 : 40) + keyboardHeight,
            }} >
                <DiscussionInput
                    contentClass={contentClass}
                    objectId={Number(objectId)}
                    otherUsers={otherUsers}
                />
            </View>
        </ModalWrapper>
    )
}