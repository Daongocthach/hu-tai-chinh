import { Control, Controller } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import ChipSelector from '@/components/common/chip-selector'
import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'
import { ListAttendFilterValues, MEETING_INVITED_STATUS_OPTIONS, MEETING_STATUS_OPTIONS } from '@/lib'

type ListAttendFilterProps = {
    control: Control<ListAttendFilterValues>
    handleSubmit: any
    onApply: (data: any) => void
    onReset: () => void
}

export default function ListAttendFilter({
    control,
    handleSubmit,
    onApply,
    onReset,
}: ListAttendFilterProps) {
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
                name="progress"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        label="progress"
                        values={value}
                        setValues={onChange}
                        selectOptions={MEETING_INVITED_STATUS_OPTIONS}
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
