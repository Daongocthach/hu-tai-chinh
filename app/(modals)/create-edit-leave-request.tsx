import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addDays, addHours, format, set } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'

import { showToast } from '@/alerts'
import leaveRequestApi from '@/apis/leave-request.api'
import {
    ButtonComponent,
    ColumnComponent,
    DateTimePicker,
    ImagePickerButton,
    InlineDropdown,
    KeyboardAwareWrapper,
    LoadingScreen,
    ModalWrapper,
    RowComponent,
    TextComponent,
    TextInputComponent,
    TimeSlotSelector
} from '@/components'
import {
    calculateWorkingHours,
    FileProps,
    Leave,
    LEAVE_STATUS,
    LEAVE_STATUS_OPTIONS,
    LEAVE_TYPE,
    LEAVE_TYPE_OPTIONS,
    parseFileFromUrl,
    QUERY_KEYS,
    ROLES
} from '@/lib'
import useStore from '@/store'

type CreateEditLeaveRequestFormValues = {
    leave_date: Date
    start_time: Date
    end_time: Date
    reason: string
    leave_type: number
    status: number
    rejection_reason?: string
    evidence_image?: FileProps
}

export default function CreateLeaveRequest() {
    const { userData } = useStore()
    const { id } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()
    const queryClient = useQueryClient()
    const tomorrow = addDays(new Date(), 1)

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isValid, isDirty, errors },
    } = useForm<CreateEditLeaveRequestFormValues>({
        defaultValues: {
            leave_type: LEAVE_TYPE.ANNUAL_LEAVE,
            leave_date: tomorrow,
            start_time: set(tomorrow, { hours: 8, minutes: 0, seconds: 0 }),
            end_time: set(tomorrow, { hours: 17, minutes: 0, seconds: 0 }),
            reason: '',
            evidence_image: undefined,
        },
    })

    const { data: leaveRequest } = useQuery<Leave>({
        queryKey: [QUERY_KEYS.LEAVE_REQUESTS, id],
        queryFn: async () => {
            const response = await leaveRequestApi.getLeaveRequestDetails(
                Number(id),
            )
            const data = response.data.data
            return data
        },
        enabled: !!id,
    })

    const startTime = watch("start_time")
    const endTime = watch("end_time")

    const leaveHours =
        startTime && endTime
            ? calculateWorkingHours(startTime, endTime)
            : '0'

    useEffect(() => {
        if (!leaveRequest) return
        reset({
            leave_type: leaveRequest.leave_type,
            status: leaveRequest.status,
            leave_date: new Date(leaveRequest.leave_date ?? ''),
            start_time: new Date(`${leaveRequest.leave_date ?? ''} ${leaveRequest.start_time ?? ''}`),
            end_time: new Date(`${leaveRequest.leave_date ?? ''} ${leaveRequest.end_time ?? ''}`),
            reason: leaveRequest.reason,
            rejection_reason: leaveRequest.rejection_reason,
            evidence_image: parseFileFromUrl(leaveRequest.evidence_image)
        })
    }, [leaveRequest, reset])


    const { mutate: createLeaveRequest, isPending: isCreatingLeaveRequest } = useMutation({
        mutationFn: (data: CreateEditLeaveRequestFormValues) => {
            return leaveRequestApi.createLeaveRequest({
                leave_type: data.leave_type,
                leave_date: data.leave_date ? format(data.leave_date, 'yyyy-MM-dd') : '',
                start_time: data.start_time ? format(data.start_time, 'HH:mm:ss') : '',
                end_time: data.end_time ? format(data.end_time, 'HH:mm:ss') : '',
                leave_hours: Number(leaveHours),
                reason: data.reason,
                evidence_image: data.evidence_image,
            })
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEAVE_REQUESTS] })
            showToast('create_success')
        },
    })

    const { mutate: editLeaveRequest, isPending: isEditingLeaveRequest } = useMutation({
        mutationFn: (data: CreateEditLeaveRequestFormValues) => {
            return leaveRequestApi.editLeaveRequest(Number(id), {
                leave_type: data.leave_type,
                leave_date: data.leave_date ? format(data.leave_date, 'yyyy-MM-dd') : '',
                start_time: data.start_time ? format(data.start_time, 'HH:mm:ss') : '',
                end_time: data.end_time ? format(data.end_time, 'HH:mm:ss') : '',
                leave_hours: Number(leaveHours),
                reason: data.reason,
                evidence_image: data?.evidence_image ? data.evidence_image : undefined,
                status: userData?.role === ROLES.ADMIN ? data.status : undefined,
                rejection_reason: userData?.role === ROLES.ADMIN ? data.rejection_reason : undefined,
            })
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEAVE_REQUESTS] })
            showToast('create_success')
        },
    })

    const onSubmit = (data: CreateEditLeaveRequestFormValues) => {
        if (id) return editLeaveRequest(data)
        createLeaveRequest(data)
    }

    return (
        <ModalWrapper isFullHeight>
            <KeyboardAwareWrapper
                extraHeight={300}
                extraScrollHeight={300}
            >
                {(id && !leaveRequest) ? <LoadingScreen /> :
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <ColumnComponent gap={15} style={{ padding: 10 }}>
                            <TextComponent
                                textAlign='center'
                                text={id ? 'edit leave request' : 'create leave request'}
                                type='display'
                            />
                            <Controller
                                control={control}
                                name="leave_type"
                                rules={{ required: 'leave type is required' }}
                                render={({ field: { value, onChange } }) => (
                                    <InlineDropdown
                                        label="leave type"
                                        selected={value}
                                        setSelected={onChange}
                                        selects={LEAVE_TYPE_OPTIONS}
                                        placeholder='select a leave type'
                                        hideFooter
                                        errorMessage={errors.leave_type?.message}
                                        disabled={!!(id && userData?.role !== ROLES.ADMIN)}
                                    />
                                )}
                            />
                            {userData?.role === ROLES.ADMIN && id &&
                                <>
                                    <Controller
                                        control={control}
                                        name="status"
                                        rules={{ required: 'status is required' }}
                                        render={({ field: { value, onChange } }) => (
                                            <InlineDropdown
                                                label="status"
                                                selected={value}
                                                setSelected={onChange}
                                                selects={LEAVE_STATUS_OPTIONS}
                                                hideFooter
                                                errorMessage={errors.status?.message}
                                            />
                                        )}
                                    />
                                    {leaveRequest?.status === LEAVE_STATUS.REJECTED &&
                                        <Controller
                                            control={control}
                                            name="rejection_reason"
                                            render={({ field: { value, onChange } }) => (
                                                <TextInputComponent
                                                    label="rejection reason"
                                                    placeholder="enter rejection reason"
                                                    multiline
                                                    value={value}
                                                    onChangeText={onChange}
                                                    style={{ height: 80, textAlignVertical: 'top' }}
                                                />
                                            )}
                                        />
                                    }
                                </>
                            }

                            <Controller
                                control={control}
                                name="leave_date"
                                rules={{ required: 'leave date is required' }}
                                render={({ field: { value, onChange } }) => (
                                    <DateTimePicker
                                        mode='date'
                                        label='leave date'
                                        placeholder='select date'
                                        dateTime={value}
                                        setDateTime={onChange}
                                        hideClear
                                        errorMessage={errors.leave_date?.message}
                                    />
                                )}
                            />
                            <RowComponent gap={10}>
                                <Controller
                                    control={control}
                                    name="start_time"
                                    rules={{ required: 'start time is required' }}
                                    render={({ field: { value, onChange } }) => (
                                        <TimeSlotSelector
                                            label="start time"
                                            value={value}
                                            onChange={onChange}
                                            minTime='08:00'
                                            maxTime='17:00'
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="end_time"
                                    rules={{ required: 'end time is required' }}
                                    render={({ field: { value, onChange } }) => (
                                        <TimeSlotSelector
                                            label="end time"
                                            value={value}
                                            onChange={onChange}
                                            minTime={
                                                startTime
                                                    ? format(addHours(startTime, 0.5), 'HH:mm')
                                                    : undefined
                                            }
                                            maxTime='17:00'
                                        />
                                    )}
                                />
                            </RowComponent>
                            <TextInputComponent
                                label="leave hours"
                                placeholder="enter leave hours"
                                value={leaveHours}
                                readOnly
                                style={{ color: 'gray' }}
                                hideClear
                            />
                            <Controller
                                control={control}
                                name="reason"
                                rules={{ required: 'reason is required' }}
                                render={({ field: { value, onChange } }) => (
                                    <TextInputComponent
                                        label="reason"
                                        placeholder="enter reason"
                                        multiline
                                        value={value}
                                        onChangeText={onChange}
                                        style={{ height: 80, textAlignVertical: 'top' }}
                                        errorMessage={errors.reason?.message}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="evidence_image"
                                render={({ field: { value, onChange } }) => (
                                    <ImagePickerButton
                                        isSingle
                                        value={value || null}
                                        setValue={onChange}
                                    />
                                )}
                            />
                            <ButtonComponent
                                textProps={{ text: 'submit' }}
                                onPress={handleSubmit(onSubmit)}
                                disabled={!isDirty || isCreatingLeaveRequest || isEditingLeaveRequest || !isValid}
                                loading={isCreatingLeaveRequest || isEditingLeaveRequest}
                            />
                        </ColumnComponent>
                    </ScrollView>
                }
            </KeyboardAwareWrapper>
        </ModalWrapper>
    )
}