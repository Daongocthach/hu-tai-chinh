import customerApi from "@/apis/customer.api"
import { PAGE_SIZE, QUERY_KEYS } from "@/lib"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"

export const useCustomersInfiniteQuery = ({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) => {
  const [searchCustomer, setSearchCustomer] = useState('')

  const fetchData = async ({ pageParam = 1 }) => {
    const response = await customerApi.getCustomers({
      page: pageParam,
      page_size: pageSize,
    })
    return response.data
  }

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS],
    queryFn: fetchData,
    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.pagination?.next_page
        ? lastPage.pagination.current_page + 1
        : undefined,
  })

  const customers = useMemo(
    () => query.data?.pages.flatMap(page => page.data) ?? [],
    [query.data]
  )

  const customerOptions = useMemo(
    () =>
      customers.map(customer => ({
        label: customer.name,
        value: customer.id.toString(),
      })),
    [customers]
  )

  return {
    searchCustomer,
    setSearchCustomer,

    ...query,
    customers,
    customerOptions,
  }
}
