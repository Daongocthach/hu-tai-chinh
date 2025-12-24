import departmentApi from "@/apis/department.api"
import { PAGE_SIZE, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

export const useDepartmentsInfiniteQuery = ({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) => {
  const [searchDepartment, setSearchDepartment] = useState('')
  
  const fetchData = async ({ pageParam = 1 }) => {
    const response = await departmentApi.getDepartments({
      page: pageParam,
      page_size: pageSize,
      q: searchDepartment,
    })
    return response.data
  }

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.DEPARTMENTS],
    queryFn: fetchData,
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.pagination?.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,

  })

  const departments = useMemo(
    () => query.data?.pages.flatMap(page => page.data) ?? [],
    [query.data]
  )

  const departmentOptions = useMemo(
    () =>
      departments.map(department => ({
        label: department.name,
        value: department.id.toString(),
      })),
    [departments]
  )

  return {
    searchDepartment,
    setSearchDepartment,

    ...query,
    departments,
    departmentOptions,
  }
}
