import { Control, Controller } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import ChipSelector from '@/components/common/chip-selector'
import ColumnComponent from '@/components/common/column-component'
import DateTimePicker from '@/components/common/date-time-picker'
import RowComponent from '@/components/common/row-component'
import { MEETING_STATUS_OPTIONS, MeetingsOnlineFilterValues } from '@/lib'

type FilterProps = {
    control: Control<MeetingsOnlineFilterValues>
    handleSubmit: any
    onApply: (data: any) => void
    onReset: () => void
}

export default function MeetingsOnlineFilter({
    control,
    handleSubmit,
    onApply,
    onReset,
}: FilterProps) {

    return (
        <ColumnComponent gap={10}>
            <Controller
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        isSingle
                        label="status"
                        value={value}
                        setValue={onChange}
                        selectOptions={MEETING_STATUS_OPTIONS}
                    />
                )}
            />
            <Controller
                control={control}
                name="date_start"
                render={({ field: { value, onChange } }) => (
                    <DateTimePicker
                        mode='date'
                        label='date start'
                        placeholder='select start date'
                        dateTime={value}
                        setDateTime={onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="date_end"
                render={({ field: { value, onChange } }) => (
                    <DateTimePicker
                        mode='date'
                        label='date end'
                        placeholder='select end date'
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
