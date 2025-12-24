import { Control, Controller } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import ChipSelector from '@/components/common/chip-selector'
import ColumnComponent from '@/components/common/column-component'
import DateTimePicker from '@/components/common/date-time-picker'
import InlineDropdown from '@/components/common/inline-dropdown'
import RowComponent from '@/components/common/row-component'
import SingleListSelector from '@/components/common/single-list-selector'

import { useUsersInfiniteQuery } from '@/hooks'
import {
    LEAVE_DURATION_MAP,
    LEAVE_QUICK_TIME_RANGE_MAP,
    LEAVE_STATUS_MAP,
    LEAVE_TYPE_OPTIONS,
    LeaveRequestsFilterValues
} from '@/lib'

type LeaveRequestsFilterProps = {
    control: Control<LeaveRequestsFilterValues>
    handleSubmit: any
    onApply: (data: any) => void
    onReset: () => void
}

export default function LeaveRequestsFilter({
    control,
    handleSubmit,
    onApply,
    onReset,
}: LeaveRequestsFilterProps) {
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
                        selectOptions={LEAVE_QUICK_TIME_RANGE_MAP}
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
                        selectOptions={LEAVE_STATUS_MAP}
                    />
                )}
            />
            <Controller
                control={control}
                name="duration_type"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        isSingle
                        label="duration type"
                        value={value}
                        setValue={onChange}
                        selectOptions={LEAVE_DURATION_MAP}
                    />
                )}
            />
            <Controller
                control={control}
                name="leave_type"
                render={({ field: { value, onChange } }) => (
                    <InlineDropdown
                        label="leave type"
                        selected={value}
                        setSelected={onChange}
                        selects={LEAVE_TYPE_OPTIONS}
                        placeholder='select a leave type'
                    />
                )}
            />
            <RowComponent gap={10} justify='space-between'>
                <Controller
                    control={control}
                    name="leave_date_range_after"
                    render={({ field: { value, onChange } }) => (
                        <DateTimePicker
                            mode='date'
                            label='date from'
                            placeholder='select date'
                            dateTime={value}
                            setDateTime={onChange}
                            hideClear
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="leave_date_range_before"
                    render={({ field: { value, onChange } }) => (
                        <DateTimePicker
                            mode='date'
                            label='date to'
                            placeholder='select date'
                            dateTime={value}
                            setDateTime={onChange}
                            hideClear
                        />
                    )}
                />
            </RowComponent>
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
