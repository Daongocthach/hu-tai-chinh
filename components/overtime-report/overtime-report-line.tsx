
import ButtonComponent from '@/components/common/button-component'
import ChipComponent from '@/components/common/chip-component'
import RowComponent from '@/components/common/row-component'
import { useOvertimeReport } from '@/hooks'
import { OverTime, OVERTIME_STATUS, OVERTIME_STATUS_MAP } from '@/lib'

export default function OvertimeReportLine(overtimeReport: OverTime) {
    const {
        deleteMutation,
        handleEdit,
    } = useOvertimeReport({ id: overtimeReport.id, userId: overtimeReport.user.id, taskId: overtimeReport.task.id })

    const {
        start_time,
        end_time,
        status,
    } = overtimeReport

    return (
        <RowComponent gap={5} alignItems='center'>
            <ButtonComponent
                outline
                backgroundColor={'outline'}
                textProps={{ text: start_time.slice(0, 5), color: 'icon' }}
                style={{ flex: 1 }}
                disabled
            />
            <ButtonComponent
                outline
                backgroundColor={'outline'}
                textProps={{ text: end_time.slice(0, 5), color: 'icon' }}
                style={{ flex: 1 }}
                disabled
            />
            {status === OVERTIME_STATUS.PENDING &&
                <>
                    <ButtonComponent
                        outline
                        backgroundColor={'outline'}
                        iconProps={{ name: 'Pencil', color: 'icon' }}
                        onPress={() => handleEdit()}
                        loading={deleteMutation.isPending}
                    />
                    <ButtonComponent
                        outline
                        backgroundColor={'outline'}
                        iconProps={{ name: 'Trash2', color: 'error' }}
                        onPress={() => deleteMutation.mutate()}
                        loading={deleteMutation.isPending}
                    />
                </>
            }
            <ChipComponent
                textProps={{
                    text: OVERTIME_STATUS_MAP?.[status]?.label,
                    color: OVERTIME_STATUS_MAP?.[status]?.color
                }}
                rowProps={{
                    backgroundColor: OVERTIME_STATUS_MAP?.[status]?.containerColor,
                }}
            />
        </RowComponent>
    )
}

