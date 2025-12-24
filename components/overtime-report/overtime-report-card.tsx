import { useTranslation } from 'react-i18next'

import { showAlert } from '@/alerts'
import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import LabelContent from '@/components/common/label-content'
import PopupComponent from '@/components/common/popup-component'
import RowComponent from '@/components/common/row-component'
import TextInputComponent from '@/components/common/text-input-component'
import { useLocale, useOvertimeReport, useTheme } from '@/hooks'
import { OVERTIME_STATUS, OVERTIME_STATUS_MAP, OVERTIME_TYPE_MAP, OverTime } from '@/lib'

export default function OvertimeReportCard(overtimeReport: OverTime) {
    const { t } = useTranslation()
    const { colors } = useTheme()
    const { formatLocalDateTime } = useLocale()
    const {
        isOwner,
        isAdmin,
        visible,
        rejectionReason,
        rejectMutationPending,
        approveMutation,
        rejectMutation,
        deleteMutation,
        showRejectModal,
        closeRejectModal,
        setRejectionReason,
        handleEdit,
    } = useOvertimeReport({ id: overtimeReport.id, userId: overtimeReport.user.id, taskId: overtimeReport.task.id })

    const {
        user,
        task,
        work_date,
        start_time,
        end_time,
        work_hours,
        note,
        status,
        confirmed_at,
        rejection_reason,
    } = overtimeReport

    const convertOvertimeReport = [
        { label: 'user', content: user.full_name },
        { label: 'project', content: task.phase.project_department.project.name },
        {
            label: 'overtime type',
            content: null,
            children: (
                <ChipComponent
                    textProps={{
                        text: OVERTIME_TYPE_MAP?.[status]?.label,
                        color: OVERTIME_TYPE_MAP?.[status]?.color
                    }}
                    rowProps={{
                        backgroundColor: OVERTIME_TYPE_MAP?.[status]?.containerColor,
                    }}
                />
            )
        },
        { label: 'work date', content: work_date },
        {
            label: 'start',
            content: start_time,
            children: (
                <LabelContent
                    rowProps={{
                        style: {
                            paddingLeft: 10,
                            borderColor: colors.outlineVariant,
                            borderLeftWidth: 1
                        }
                    }}
                    labelProps={{ text: 'end' }}
                    contentProps={{ text: end_time }}
                />
            )
        },
        { label: 'work hours', content: work_hours?.toString() },
        { label: 'note', content: note },
        {
            label: 'status',
            content: null,
            children: (
                <ChipComponent
                    textProps={{
                        text: OVERTIME_STATUS_MAP?.[status]?.label,
                        color: OVERTIME_STATUS_MAP?.[status]?.color
                    }}
                    rowProps={{
                        backgroundColor: OVERTIME_STATUS_MAP?.[status]?.containerColor,
                    }}
                />
            )
        },
        { label: 'confirmed at', content: confirmed_at ? formatLocalDateTime(confirmed_at, 'datetime') : '' },
        { label: 'reject reason', content: rejection_reason },
    ].filter(item => item.content || item.children)


    return (
        <CardContainer>
            <ColumnComponent gap={8}>
                <RowComponent justify="flex-end" gap={15}>
                    {((isOwner && status === OVERTIME_STATUS.PENDING) || isAdmin) &&
                        <ButtonComponent
                            isIconOnly
                            iconProps={{ name: 'Pencil' }}
                            onPress={handleEdit}
                        />
                    }
                    {isOwner && status === OVERTIME_STATUS.PENDING &&
                        <ButtonComponent
                            isIconOnly
                            iconProps={{ name: 'Trash2', color: 'error' }}
                            onPress={() =>
                                showAlert("delete_overtime_report_confirm", async () => deleteMutation.mutate())
                            }
                        />
                    }
                </RowComponent>
                {convertOvertimeReport.map((item, index) => (
                    <LabelContent
                        key={index}
                        rowProps={{
                            style: {
                                paddingVertical: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: colors.outlineVariant
                            }
                        }}
                        labelProps={{ text: t(item.label) + ':' }}
                        contentProps={{ text: item.content || '' }}
                    >
                        {item.children}
                    </LabelContent>
                ))}
            </ColumnComponent>
            {isAdmin && status === OVERTIME_STATUS.PENDING &&
                <RowComponent justify="space-between" gap={10} style={{ marginTop: 15 }}>
                    <ButtonComponent
                        iconProps={{ name: 'X' }}
                        textProps={{ text: 'reject' }}
                        backgroundColor='error'
                        style={{ flex: 1 }}
                        onPress={showRejectModal}
                    />
                    <ButtonComponent
                        iconProps={{ name: 'Check' }}
                        textProps={{ text: 'approve' }}
                        backgroundColor='primary'
                        style={{ flex: 1 }}
                        onPress={() => showAlert("approve_overtime_report_confirm", async () => approveMutation.mutate())}
                    />
                </RowComponent>
            }
            <PopupComponent
                visible={visible}
                onClose={closeRejectModal}
                isLoading={rejectMutationPending}
                modalTitle='reject overtime report'
                handle={() => rejectMutation.mutate()}
                isOnlyConfirmButton
                buttonTitle='submit'
            >
                <ColumnComponent style={{ marginVertical: 10 }}>
                    <TextInputComponent
                        value={rejectionReason}
                        onChangeText={setRejectionReason}
                        placeholder='enter rejection reason'
                        multiline
                        style={{ height: 100, textAlignVertical: 'top' }}
                    />
                </ColumnComponent>
            </PopupComponent>
        </CardContainer>
    )
}

