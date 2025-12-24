import { Control, Controller } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import ChipSelector from '@/components/common/chip-selector'
import ColumnComponent from '@/components/common/column-component'
import DateTimePicker from '@/components/common/date-time-picker'
import RowComponent from '@/components/common/row-component'

import { useMyProjects, useUsersInfiniteQuery } from '@/hooks'
import {
    OVERTIME_QUICK_TIME_RANGE_MAP,
    OVERTIME_STATUS_MAP,
    OVERTIME_TYPE_MAP,
    OvertimeReportsFilterValues,
} from '@/lib'
import SingleListSelector from '../common/single-list-selector'

type OvertimeReportsFilterProps = {
    control: Control<OvertimeReportsFilterValues>
    handleSubmit: any
    onApply: (data: any) => void
    onReset: () => void
}

export default function OvertimeReportsFilter({
    control,
    handleSubmit,
    onApply,
    onReset,
}: OvertimeReportsFilterProps) {
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
        projectOptions,
        hasNextPage: hasNextPageProjects,
        fetchNextPage: fetchNextPageProjects,
        isFetchingNextPage: isFetchingNextPageProjects,
        isLoading: isLoadingProjects,
        isError: isErrorProjects,
        searchProjectName,
        setSearchProjectName,
    } = useMyProjects()

    return (
        <ColumnComponent gap={10}>
            <Controller
                control={control}
                name="quick_time_range"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        isSingle
                        label="time range"
                        value={value}
                        setValue={onChange}
                        selectOptions={OVERTIME_QUICK_TIME_RANGE_MAP}
                    />
                )}
            />
            <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        isSingle
                        label="status"
                        value={value}
                        setValue={onChange}
                        selectOptions={OVERTIME_STATUS_MAP}
                    />
                )}
            />
            <Controller
                control={control}
                name="overtime_type"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        isSingle
                        label="overtime type"
                        value={value}
                        setValue={onChange}
                        selectOptions={OVERTIME_TYPE_MAP}
                    />
                )}
            />
            <RowComponent gap={10} justify='space-between'>
                <Controller
                    control={control}
                    name="work_date_range_after"
                    render={({ field: { value, onChange } }) => (
                        <DateTimePicker
                            mode='date'
                            label='date from'
                            placeholder='select date'
                            dateTime={value}
                            setDateTime={onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="work_date_range_before"
                    render={({ field: { value, onChange } }) => (
                        <DateTimePicker
                            mode='date'
                            label='date to'
                            placeholder='select date'
                            dateTime={value}
                            setDateTime={onChange}
                        />
                    )}
                />
            </RowComponent>

            <Controller
                control={control}
                name="project"
                render={({ field: { value, onChange } }) => (
                    <SingleListSelector
                        label="project"
                        selects={projectOptions}
                        selected={value}
                        setSelected={onChange}
                        searchValue={searchProjectName}
                        setSearchValue={setSearchProjectName}
                        placeholder='select a project'
                        isLoading={isLoadingProjects}
                        isFetchingNextPage={isFetchingNextPageProjects}
                        loadMore={fetchNextPageProjects}
                        hasMore={hasNextPageProjects}
                        isError={isErrorProjects}
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
