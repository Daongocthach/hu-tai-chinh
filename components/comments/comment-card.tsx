import { differenceInSeconds } from 'date-fns'
import { useState } from 'react'
import { useTranslation } from "react-i18next"

import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import UserAvatar from '@/components/common/user-avatar'
import HighlightTaggedWordsInText from './highlight-tagged-words'
import MediaAttachmentDisplay from './media-attachment-display'

import { showAlert } from '@/alerts'
import DiscussionInput from '@/components/comments/discussion-input'
import ButtonComponent from '@/components/common/button-component'
import { useComment } from '@/hooks/use-comment'
import { useLocale } from '@/hooks/use-locale'
import { CommentContentClass, CommentDetails, User } from '@/lib'
import useStore from '@/store'

type CommentCardProps = {
    contentClass: CommentContentClass
    objectId: number
    comment: CommentDetails
    otherUsers: User[]
}

export default function CommentCard({
    contentClass,
    objectId,
    comment,
    otherUsers
}: CommentCardProps) {
    const { userData } = useStore()
    const { t } = useTranslation()
    const { formatDistance } = useLocale()
    const [visible, setVisible] = useState(false)

    const { editMutation, deleteMutation } = useComment({
        id: comment.id,
        contentClass,
        objectId,
    })

    const {
        author,
        created,
        modified,
        content,
        images,
        files,
        mention_users
    } = comment

    if (!comment?.id) return null
    const isOwner = author.id === userData?.id

    const handleDeleteComment = () => {
        showAlert('delete_comment_confirm', () => {
            deleteMutation.mutate()
        })
    }

    return (
        <RowComponent gap={10} style={{ paddingVertical: 10, flexGrow: 1 }}>
            <UserAvatar
                avatarSize={35}
                avatarUrl={author?.avatar}
                userName={author?.full_name}
            />

            <ColumnComponent gap={5} style={{ flexShrink: 1, flexGrow: 1 }}>
                <RowComponent justify='space-between'>
                    <RowComponent gap={5}>
                        <TextComponent
                            text={author.full_name}
                            type="title1"
                            size={11}
                            numberOfLines={1}
                            style={{ flexShrink: 1 }}
                        />
                        <TextComponent
                            text={
                                formatDistance(created) +
                                (differenceInSeconds(new Date(modified), new Date(created)) > 0
                                    ? ` (${t("edited")})`
                                    : '')
                            }
                            type="caption"
                            size={9}
                        />
                    </RowComponent>
                    {isOwner &&
                        <RowComponent gap={10}>
                            <ButtonComponent
                                isIconOnly
                                iconProps={{ name: 'Trash2', size: 14 }}
                                onPress={handleDeleteComment}
                            />
                        </RowComponent>
                    }
                </RowComponent>

                {visible ?
                    <DiscussionInput
                        isEditing
                        commentId={comment.id}
                        mentionUsers={mention_users || []}
                        content={content}
                        contentClass={contentClass}
                        objectId={Number(objectId)}
                        otherUsers={otherUsers}
                    />
                    :
                    <>
                        {content &&
                            <HighlightTaggedWordsInText
                                comment={content}
                                users={mention_users || []}
                            />
                        }

                        {(images?.length > 0 || files?.length > 0) && (
                            <MediaAttachmentDisplay images={images} files={files} />
                        )}
                    </>
                }
            </ColumnComponent>
        </RowComponent>
    )
}