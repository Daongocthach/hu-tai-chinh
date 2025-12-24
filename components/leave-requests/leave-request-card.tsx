import { useTranslation } from 'react-i18next'

import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import ImageComponent from '@/components/common/image-component'
import LabelContent from '@/components/common/label-content'
import PopupComponent from '@/components/common/popup-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import TextInputComponent from '@/components/common/text-input-component'
import { useLeaveRequest, useLocale, useTheme } from '@/hooks'
import { Leave, LEAVE_STATUS, LEAVE_STATUS_MAP, LEAVE_TYPE_MAP } from '@/lib'

export default function LeaveRequestCard(leaveRequest: Leave) {
    const { t } = useTranslation()
    const { colors } = useTheme()
    const { formatLocalDateTime } = useLocale()
    const {
        isOwner,
        isAdmin,
        visible,
        rejectionReason,
        rejectMutationPending,
        showRejectModal,
        closeRejectModal,
        setRejectionReason,
        handleApprove,
        handleDelete,
        handleReject,
        handleEdit,
    } = useLeaveRequest({ id: leaveRequest.id, userId: leaveRequest.user.id })

    const {
        user,
        leave_date,
        start_time,
        end_time,
        leave_hours,
        reason,
        evidence_image,
        status,
        leave_type,
        confirmed_at,
        rejection_reason,
    } = leaveRequest

    const convertLeaveRequest = [
        { label: 'user', content: user.full_name },
        {
            label: 'leave type',
            content: null,
            children: (
                <ChipComponent
                    textProps={{
                        text: LEAVE_TYPE_MAP?.[leave_type]?.label,
                        color: LEAVE_TYPE_MAP?.[leave_type]?.color
                    }}
                    rowProps={{
                        backgroundColor: LEAVE_TYPE_MAP?.[leave_type]?.containerColor,
                    }}
                />
            )
        },

        { label: 'leave date', content: leave_date },
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
        { label: 'leave hours', content: leave_hours?.toString() },
        { label: 'reason', content: reason },
        {
            label: 'status',
            content: null,
            children: (
                <ChipComponent
                    textProps={{
                        text: LEAVE_STATUS_MAP?.[status]?.label,
                        color: LEAVE_STATUS_MAP?.[status]?.color
                    }}
                    rowProps={{
                        backgroundColor: LEAVE_STATUS_MAP?.[status]?.containerColor,
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
                    {(isOwner || isAdmin) &&
                        <ButtonComponent
                            isIconOnly
                            iconProps={{ name: 'Pencil' }}
                            onPress={handleEdit}
                        />
                    }
                    {isOwner && status === LEAVE_STATUS.PENDING &&
                        <ButtonComponent
                            isIconOnly
                            iconProps={{ name: 'Trash2', color: 'error' }}
                            onPress={handleDelete}
                        />
                    }
                </RowComponent>
                {convertLeaveRequest.map((item, index) => (
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
                {evidence_image &&
                    <ColumnComponent gap={6} style={{ marginTop: 10 }}>
                        <TextComponent
                            text={t('evidence images') + ':'}
                            type="label"
                        />
                        <ImageComponent
                            uri={evidence_image}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 8,
                            }}
                            isShowViewer
                            resizeMode="cover"
                        />
                    </ColumnComponent>
                }
            </ColumnComponent>

            {isAdmin && status === LEAVE_STATUS.PENDING &&
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
                        onPress={handleApprove}
                    />
                </RowComponent>
            }
            <PopupComponent
                visible={visible}
                onClose={closeRejectModal}
                isLoading={rejectMutationPending}
                modalTitle='reject leave request'
                handle={handleReject}
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

