import { Control, Controller } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import ChipSelector from '@/components/common/chip-selector'
import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'

import {
    PROJECT_PRIORITIES_MAP,
    PROJECT_STATUS_MAP,
    ProjectsFilterValues
} from '@/lib'

import { useCustomersInfiniteQuery } from '@/hooks/use-customers-infinite-query'
import { useDepartmentsInfiniteQuery } from '@/hooks/use-departments-infinite-query'
import { useUsersInfiniteQuery } from '@/hooks/use-users-infinite-query'
import SingleListSelector from '../common/single-list-selector'

type ProjectsFilterProps = {
    control: Control<ProjectsFilterValues>
    handleSubmit: any
    onApply: (data: any) => void
    onReset: () => void
}

export default function ProjectsFilter({
    control,
    handleSubmit,
    onApply,
    onReset,
}: ProjectsFilterProps) {

    const {
        departmentOptions,
        searchDepartment,
        setSearchDepartment,
        hasNextPage: hasNextPageDepartments,
        fetchNextPage: fetchNextPageDepartments,
        isFetchingNextPage: isFetchingNextPageDepartments,
        isLoading: isLoadingDepartments,
        isError: isErrorDepartments,
    } = useDepartmentsInfiniteQuery()

    const {
        userOptions,
        searchUser,
        setSearchUser,
        hasNextPage: hasNextPageUsers,
        fetchNextPage: fetchNextPageUsers,
        isFetchingNextPage: isFetchingNextPageUsers,
        isLoading: isLoadingUsers,
        isError: isErrorUsers,
    } = useUsersInfiniteQuery()

    const {
        customerOptions,
        searchCustomer,
        setSearchCustomer,
        hasNextPage: hasNextPageCustomers,
        fetchNextPage: fetchNextPageCustomers,
        isFetchingNextPage: isFetchingNextPageCustomers,
        isLoading: isLoadingCustomers,
        isError: isErrorCustomers,
    } = useCustomersInfiniteQuery()


    return (
        <ColumnComponent gap={10}>
            <Controller
                control={control}
                name="priority"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        label="priority"
                        values={value}
                        setValues={onChange}
                        selectOptions={PROJECT_PRIORITIES_MAP}
                    />
                )}
            />
            <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        label="status"
                        values={value}
                        setValues={onChange}
                        selectOptions={PROJECT_STATUS_MAP}
                    />
                )}
            />
            <Controller
                control={control}
                name="department"
                render={({ field: { value, onChange } }) => (
                    <SingleListSelector
                        label="department"
                        selects={departmentOptions}
                        selected={value}
                        setSelected={onChange}
                        searchValue={searchDepartment}
                        setSearchValue={setSearchDepartment}
                        placeholder='select a department'
                        isLoading={isLoadingDepartments}
                        isFetchingNextPage={isFetchingNextPageDepartments}
                        loadMore={fetchNextPageDepartments}
                        hasMore={hasNextPageDepartments}
                        isError={isErrorDepartments}
                    />
                )}
            />
            <Controller
                control={control}
                name="customer"
                render={({ field: { value, onChange } }) => (
                    <SingleListSelector
                        label="customer"
                        selects={customerOptions}
                        selected={value}
                        setSelected={onChange}
                        searchValue={searchCustomer}
                        setSearchValue={setSearchCustomer}
                        placeholder='select a customer'
                        isLoading={isLoadingCustomers}
                        isFetchingNextPage={isFetchingNextPageCustomers}
                        loadMore={fetchNextPageCustomers}
                        hasMore={hasNextPageCustomers}
                        isError={isErrorCustomers}
                    />
                )}
            />
            <Controller
                control={control}
                name="user"
                render={({ field: { value, onChange } }) => (
                    <SingleListSelector
                        label="user"
                        selects={userOptions}
                        selected={value}
                        setSelected={onChange}
                        searchValue={searchUser}
                        setSearchValue={setSearchUser}
                        placeholder="select an user"
                        loadMore={fetchNextPageUsers}
                        isLoading={isLoadingUsers}
                        isFetchingNextPage={isFetchingNextPageUsers}
                        hasMore={hasNextPageUsers}
                        isError={isErrorUsers}
                    />
                )}
            />
            <RowComponent justify="flex-end" gap={10}>
                <ButtonComponent
                    textProps={{ text: 'reset', color: 'onCardDisabled' }}
                    backgroundColor="cardDisabled"
                    onPress={onReset}
                />
                <ButtonComponent
                    textProps={{ text: 'apply' }}
                    onPress={handleSubmit(onApply)}
                />
            </RowComponent>
        </ColumnComponent>
    )
}
