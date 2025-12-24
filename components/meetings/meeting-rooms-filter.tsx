import { Control, Controller } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import ChipSelector from '@/components/common/chip-selector'
import ColumnComponent from '@/components/common/column-component'
import DateTimePicker from '@/components/common/date-time-picker'
import InlineDropdown from '@/components/common/inline-dropdown'
import RowComponent from '@/components/common/row-component'
import { MeetingRoomsFilterValues, ROOM_FACILITIES } from '@/lib'

const capacityOptions = [
    { label: 'all', value: '' },
    { label: '<5', value: '5' },
    { label: '<10', value: '10' },
    { label: '<15', value: '15' },
    { label: '<20', value: '20' },
]

type FilterProps = {
    control: Control<MeetingRoomsFilterValues>
    handleSubmit: any
    onApply: (data: any) => void
    onReset: () => void
}

export default function MeetingRoomsFilter({
    control,
    handleSubmit,
    onApply,
    onReset,
}: FilterProps) {

    return (
        <ColumnComponent gap={10}>
            <Controller
                control={control}
                name="facilities"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        label="facilities"
                        values={value}
                        setValues={onChange}
                        selectOptions={ROOM_FACILITIES}
                    />
                )}
            />
            <Controller
                control={control}
                name="max_capacity"
                render={({ field: { value, onChange } }) => (
                    <InlineDropdown
                        label="max capacity"
                        selected={value}
                        setSelected={onChange}
                        selects={capacityOptions}
                        hideFooter
                    />
                )}
            />
            <Controller
                control={control}
                name="date_selected"
                render={({ field: { value, onChange } }) => (
                    <DateTimePicker
                        mode='date'
                        label='date'
                        placeholder='select date'
                        dateTime={value}
                        setDateTime={onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="start_time"
                render={({ field: { value, onChange } }) => (
                    <DateTimePicker
                        mode='time'
                        label='start time'
                        placeholder='select start time'
                        dateTime={value}
                        setDateTime={onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="end_time"
                render={({ field: { value, onChange } }) => (
                    <DateTimePicker
                        mode='time'
                        label='end time'
                        placeholder='select end time'
                        dateTime={value}
                        setDateTime={onChange}
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