import userApi from "@/apis/user.api"
import { QUERY_KEYS, USER_STATUS, UsersFilterValues } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounce } from "./use-debounce"

export const useUsersInfiniteQuery = ({
  pageSize = 20,
}: {
  pageSize?: number,
} = {}) => {
  const [filters, setFilters] = useState<UsersFilterValues | null>(null)
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [searchUser, setSearchUser] = useState('')

  const searchDebounced = useDebounce(searchUser)

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<UsersFilterValues>({
    mode: "onChange"
  })

  const fetchData = async ({ pageParam = 1 }) => {
    const response = await userApi.getUsers({
      page: pageParam,
      page_size: pageSize,
      q: searchDebounced,
      status: filters?.status === USER_STATUS.APPROVED ? true :
        filters?.status === USER_STATUS.PENDING ? false : undefined,
      role: filters?.role,
    })
    return response.data
  }

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.USERS, searchDebounced, filters],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })

  const users = useMemo(
    () => query.data?.pages.flatMap(page => page.data) ?? [],
    [query.data]
  )
  const total_items = query.data?.pages[0].pagination.total_items ?? 0

  const userOptions = useMemo(
    () =>
      users.map(user => ({
        label: user.full_name,
        value: user.id.toString(),
      })),
    [users]
  )

  const handleReset = () => {
    reset()
    setFilters(null)
  }

  return {
    isOpenFilter,
    setIsOpenFilter,
    searchUser,
    setSearchUser,

    filters,
    setFilters,

    control,
    handleSubmit,
    handleReset,
    watch,

    ...query,
    users,
    total_items,
    userOptions,
  }
}
