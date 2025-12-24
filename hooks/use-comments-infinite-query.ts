import commentApi from "@/apis/comment.api"
import { CommentContentClass, QUERY_KEYS, User } from "@/lib"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export function useCommentsInfiniteQuery({
    contentClass,
    objectId
}: {
    contentClass: CommentContentClass
    objectId: number
}) {
    const fetchData = async ({ pageParam = 1 }) => {
        const response = await commentApi.getComments({
            page: pageParam,
            page_size: 20,
            content_class: contentClass,
            object_id: objectId,
        })

        return response.data
    }

    const query = useInfiniteQuery({
        queryKey: [QUERY_KEYS.COMMENTS, contentClass, objectId],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.pagination.next_page
                ? lastPage.pagination.current_page + 1
                : undefined,
        enabled: !!objectId && !!contentClass,
    })


    const { data: members } = useQuery<User[]>({
        queryKey: [QUERY_KEYS.COMMENT_MEMBERS, objectId],
        queryFn: async () => {
            const response = await commentApi.getMembersByContentClass({
                content_class: contentClass,
                object_id: objectId,
            })
            return response.data.data
        },
        enabled: !!objectId && !!contentClass,
    })

    const comments = query.data?.pages.flatMap(page => page.data) ?? []

    const totalItems = query.data?.pages[0]?.pagination?.total_items ?? 0

    return {
        ...query,
        comments,
        members,
        totalItems,
    }
}
