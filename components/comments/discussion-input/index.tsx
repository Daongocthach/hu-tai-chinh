import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TextInput,
  View
} from 'react-native'
import { TriggersConfig, useMentions } from 'react-native-controlled-mentions'

import { showToast } from '@/alerts'
import commentApi from '@/apis/comment.api'
import ButtonComponent from '@/components/common/button-component'
import ColumnComponent from '@/components/common/column-component'
import FilesPreview from '@/components/common/files-preview'
import ImagesPreview from '@/components/common/images-preview'
import RowComponent from '@/components/common/row-component'
import { useFilePicker, useImagePicker, useSendMessageSocket, useTheme } from "@/hooks"
import { useInfiniteListUpdater } from '@/hooks/use-infinite-list-updater'
import { CommentContentClass, CommentDetails, FileProps, User } from '@/lib'
import { FONT_FAMILIES, QUERY_KEYS } from '@/lib/constants'
import UserSuggestions from './user-suggestions'

const triggersConfig: TriggersConfig<'mention'> = {
  mention: {
    trigger: '@',
    textStyle: { fontWeight: 'bold', color: '#7F64F4' },
  },
}

type DiscussionInputProps = {
  contentClass: CommentContentClass
  handleCancel?: () => void
  objectId: number
  otherUsers: User[]
} & (
    | {
      isEditing: true
      commentId: number
      mentionUsers: User[]
      content: string
    }
    | {
      isEditing?: false
      commentId?: never
      mentionUsers?: never[]
      content?: never
    }
  )

export default function DiscussionInput({
  content = "",
  commentId,
  mentionUsers = [],
  handleCancel,
  contentClass,
  objectId,
  otherUsers,
  isEditing,
}: DiscussionInputProps) {
  const { sendMessage } = useSendMessageSocket()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { prependItem } = useInfiniteListUpdater<CommentDetails>([QUERY_KEYS.COMMENTS, contentClass, objectId])
  const { openFilePicker } = useFilePicker()
  const { openImagePicker } = useImagePicker()
  const [input, setInput] = useState(content)
  const [images, setImages] = useState<FileProps[]>([])
  const [videos, setVideos] = useState<FileProps[]>([])
  const [files, setFiles] = useState<FileProps[]>([])
  const [taggedUsers, setTaggedUsers] = useState<User[]>(mentionUsers)
  const [isFocused, setIsFocused] = useState(false)

  const focusBorderColor = isFocused ? colors.primary : colors.outline
  const focusIconColor = isFocused ? colors.primary : colors.icon

  const canShowClear =
    typeof input === 'string' &&
    input.length > 0

  const { textInputProps, triggers } = useMentions({
    value: input,
    onChange: setInput,
    triggersConfig,
    onSelectionChange: () => {
      setIsFocused(true)
    }
  })

  const isReady = useMemo(() => {
    return (
      input?.trim() ||
      images.length > 0 ||
      files.length > 0 ||
      videos.length > 0
    )
  }, [input, images, files, videos])

  const { mutate: sendComment, isPending } = useMutation({
    mutationFn: () => commentApi.sendComment({
      content: input,
      content_class: contentClass,
      object_id: objectId,
      images: images,
      videos: videos,
      files: files,
      mention_users: taggedUsers.map((user) => user.id),
    }),
    onSuccess: (response) => {
      sendMessage("COMMENT_CREATED", { commentId: response.data.data.id });
      if (taggedUsers.length > 0)
        sendMessage("COMMENT_TAGGED", { commentId: response.data.data.id });
      setInput('')
      setImages([])
      setVideos([])
      setFiles([])
      showToast('comment_sent_successfully')
      const newComment: CommentDetails = response.data.data
      prependItem(newComment)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECT] })
    },
  })

  const handlePickFile = () => {
    setIsFocused(true)
    openFilePicker((file) => {
      setFiles((prev) => [...prev, file])
    })
  }
  const handlePickImage = () => {
    setIsFocused(true)
    openImagePicker((file) => {
      setImages((prev) => [...prev, file])
    })
  }

  return (
    <ColumnComponent gap={8} style={{ paddingTop: 5 }}>
      <UserSuggestions
        keyword={triggers.mention.keyword}
        onSelect={triggers.mention.onSelect}
        suggestionUsers={otherUsers}
        setTaggedUsers={setTaggedUsers}
      />

      <ImagesPreview images={images} setImages={setImages} />
      <FilesPreview files={files} setFiles={setFiles} />

      <View style={{
        position: 'relative',
        borderWidth: (isFocused ? 1.5 : 1),
        borderRadius: 8,
        borderColor: focusBorderColor,
      }}>
        <TextInput
          {...textInputProps}
          underlineColorAndroid="transparent"
          placeholderTextColor={colors.icon}
          placeholder={t('type a comment')}
          multiline
          onFocus={() => {
            setIsFocused(true)
          }}
          onBlur={() => {
            setIsFocused(false)
          }}
          style={[
            {
              flexGrow: 1,
              color: colors.onBackground,
              fontSize: 13,
              fontFamily: FONT_FAMILIES.REGULAR,
              paddingVertical: 12,
              paddingRight: 60,
              paddingLeft: 70,
              borderRadius: 8,
              maxHeight: 150,
            },
          ]}
        />

        <RowComponent
          gap={10}
          alignItems='flex-end'
          style={{
            position: 'absolute',
            left: 10,
            height: "100%",
            paddingBottom: 13,
          }}
        >
          <ButtonComponent
            isIconOnly
            iconProps={{ name: 'Paperclip', color: focusIconColor }}
            onPress={handlePickFile}
            disabled={isPending}
          />
          <ButtonComponent
            isIconOnly
            iconProps={{ name: 'Image', color: focusIconColor }}
            onPress={handlePickImage}
            disabled={isPending}
          />
        </RowComponent>

        <RowComponent
          gap={10}
          alignItems='flex-end'
          style={{
            position: 'absolute',
            right: 10,
            height: "100%",
            paddingBottom: 13,
          }}
        >
          {canShowClear && (
            <ButtonComponent
              onPress={() => setInput('')}
              isIconOnly
              iconProps={{ name: "X", color: focusIconColor }}
            />
          )}
          <ButtonComponent
            isIconOnly
            iconProps={{ name: 'SendHorizontal', color: focusIconColor }}
            onPress={() => sendComment()}
            loading={isPending}
            disabled={!isReady || isPending}
          />
        </RowComponent>
      </View>
    </ColumnComponent>
  )
}