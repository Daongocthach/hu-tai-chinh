import { showToast } from "@/alerts"
import commentApi from "@/apis/comment.api"
import { CommentContentClass, QUERY_KEYS } from "@/lib"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"

export function useComment({
  id,
  contentClass,
  objectId,
}: {
  id: number | string
  contentClass: CommentContentClass
  objectId: number
}) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const editMutation = useMutation({
    mutationFn: async (payload: {
      content: string
      mention_users: number[]
    }) =>
      commentApi.editComment(Number(id), {
        ...payload,
        content_class: contentClass,
        object_id: objectId,
      }),

    onSuccess: () => {
      showToast("update_success")

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, contentClass, objectId],
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => commentApi.deleteComment(Number(id)),

    onSuccess: () => {
      showToast("delete_success")

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMMENTS, contentClass, objectId],
      })

      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.COMMENT, id],
      })
    },
  })

  return {
    editMutation,
    deleteMutation,
  }
}
