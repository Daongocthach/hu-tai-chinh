import { Control, Controller } from 'react-hook-form'

import ButtonComponent from '@/components/common/button-component'
import ChipSelector from '@/components/common/chip-selector'
import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'

import {
    ROLE_MAP,
    USER_STATUS_MAP,
    UsersFilterValues
} from '@/lib'

type UsersFilterProps = {
    control: Control<UsersFilterValues>
    handleSubmit: any
    onApply: (data: any) => void
    onReset: () => void
}

export default function UsersFilter({
    control,
    handleSubmit,
    onApply,
    onReset,
}: UsersFilterProps) {

    return (
        <ColumnComponent gap={10}>
            <Controller
                control={control}
                name="role"
                render={({ field: { value, onChange } }) => (
                    <ChipSelector
                        isSingle
                        label="role"
                        value={value}
                        setValue={onChange}
                        selectOptions={ROLE_MAP}
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
                        selectOptions={USER_STATUS_MAP}
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
