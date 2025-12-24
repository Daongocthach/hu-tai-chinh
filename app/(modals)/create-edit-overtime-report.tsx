import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addHours, differenceInMinutes, format, set } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'

import { showToast } from '@/alerts'
import overtimeReportApi from '@/apis/overtime-report.api'
import {
    ButtonComponent,
    ColumnComponent,
    InlineDropdown,
    LoadingScreen,
    ModalWrapper,
    RowComponent,
    TextComponent,
    TextInputComponent,
    TimeSlotSelector
} from '@/components'
import {
    OverTime,
    OVERTIME_STATUS,
    OVERTIME_STATUS_OPTIONS,
    OVERTIME_TYPE,
    OVERTIME_TYPE_OPTIONS,
    QUERY_KEYS,
    ROLES,
} from '@/lib'
import useStore from '@/store'

type CreateEditOvertimeReportFormValues = {
    start_time: Date
    end_time: Date
    note: string
    overtime_type: number
    task: number
    work_date: Date
    status: number
    rejection_reason: string
}

export default function CreateOvertimeReport() {
    const { userData } = useStore()
    const { id, task_id } = useLocalSearchParams<{ id: string, task_id: string }>()
    const router = useRouter()
    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isValid, isDirty, errors },
    } = useForm<CreateEditOvertimeReportFormValues>({
        mode: 'onChange',
        defaultValues: {
            overtime_type: OVERTIME_TYPE.REGULAR,
            work_date: new Date(),
            start_time: set(new Date(), { hours: 17, minutes: 30, seconds: 0 }),
            end_time: set(new Date(), { hours: 20, minutes: 30, seconds: 0 }),
            note: '',
        },
    })

    const { data: overtimeReport } = useQuery<OverTime>({
        queryKey: [QUERY_KEYS.OVERTIME_REPORTS, id],
        queryFn: async () => {
            const response = await overtimeReportApi.getOvertimeReportDetails(
                Number(id),
            )
            const data = response.data.data
            return data
        },
        enabled: !!id,
    })


    const isAdmin = userData?.role === ROLES.ADMIN
    const isOwner = userData?.id && overtimeReport?.user.id === userData.id
    const startTime = watch("start_time")
    const endTime = watch("end_time")
    const overtimeType = watch("overtime_type")
    const workHours = (endTime && startTime)
        ? (differenceInMinutes(endTime, startTime) / 60).toFixed(1)
        : '0'

    useEffect(() => {
        if (!overtimeReport) return

        reset({
            work_date: new Date(overtimeReport.work_date ?? ''),
            start_time: new Date(`${overtimeReport.work_date ?? ''} ${overtimeReport.start_time ?? ''}`),
            end_time: new Date(`${overtimeReport.work_date ?? ''} ${overtimeReport.end_time ?? ''}`),
            note: overtimeReport.note,
            overtime_type: overtimeReport.overtime_type,
            task: overtimeReport.task.id,
            status: overtimeReport.status,
            rejection_reason: overtimeReport.rejection_reason,
        })
    }, [overtimeReport, reset])


    const { mutate: createOvertimeReport, isPending: isCreatingOvertimeReport } = useMutation({
        mutationFn: (data: CreateEditOvertimeReportFormValues) => {
            const payload = {
                start_time: data.start_time ? format(data.start_time, 'HH:mm:ss') : '',
                end_time: data.end_time ? format(data.end_time, 'HH:mm:ss') : '',
                work_hours: Number(workHours),
                note: data.note,
                overtime_type: data.overtime_type,
                task: Number(task_id),
                work_date: data.work_date ? format(data.work_date, 'yyyy-MM-dd') : '',
            }
            return overtimeReportApi.createOvertimeReport(payload)
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OVERTIME_REPORTS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASK_HOURS] })
            showToast('create_success')
        },
    })

    const { mutate: editOvertimeReport, isPending: isEditingOvertimeReport } = useMutation({
        mutationFn: (data: CreateEditOvertimeReportFormValues) => {
            const payload = {
                start_time: data.start_time ? format(data.start_time, 'HH:mm:ss') : '',
                end_time: data.end_time ? format(data.end_time, 'HH:mm:ss') : '',
                work_hours: Number(workHours),
                note: data.note,
                overtime_type: data.overtime_type,
                task: Number(task_id),
                work_date: data.work_date ? format(data.work_date, 'yyyy-MM-dd') : '',
                status: (isAdmin && id) ? data.status : undefined,
                rejection_reason: data.rejection_reason ?? "",
            }
            return overtimeReportApi.editOvertimeReport(Number(id), payload)
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OVERTIME_REPORTS] })
            showToast('update_success')
        },
    })

    const onSubmit = (data: CreateEditOvertimeReportFormValues) => {
        if (id) return editOvertimeReport(data)
        createOvertimeReport(data)
    }



    return (
        <ModalWrapper isFullHeight>
            {(id && !overtimeReport) ? <LoadingScreen /> :
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <ColumnComponent gap={15} style={{ padding: 10 }}>
                        <TextComponent
                            textAlign='center'
                            text={id ? 'edit overtime report' : 'create overtime report'}
                            type='display'
                        />
                        {((id && (isAdmin || isOwner)) || !id) &&
                            <Controller
                                control={control}
                                name="overtime_type"
                                rules={{ required: 'overtime type is required' }}
                                render={({ field: { value, onChange } }) => (
                                    <InlineDropdown
                                        label="overtime type"
                                        selected={value}
                                        setSelected={onChange}
                                        selects={OVERTIME_TYPE_OPTIONS}
                                        placeholder='select an overtime type'
                                        hideFooter
                                        errorMessage={errors.overtime_type?.message}
                                    />
                                )}
                            />
                        }
                        {isAdmin && id &&
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
                                            selects={OVERTIME_STATUS_OPTIONS}
                                            hideFooter
                                            errorMessage={errors.status?.message}
                                        />
                                    )}
                                />
                                {overtimeReport?.status === OVERTIME_STATUS.REJECTED &&
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

                        <RowComponent gap={10}>
                            <Controller
                                control={control}
                                name="start_time"
                                rules={{
                                    required: 'start time is required',
                                }}
                                render={({ field: { value, onChange } }) => (
                                    <TimeSlotSelector
                                        label="start time"
                                        value={value}
                                        onChange={onChange}
                                        maxTime='23:30'
                                        type={overtimeType === OVERTIME_TYPE.REGULAR ? 'regular' : 'night'}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="end_time"
                                rules={{
                                    required: 'end time is required',
                                }}
                                render={({ field: { value, onChange } }) => (
                                    <TimeSlotSelector
                                        label="end time"
                                        value={value}
                                        onChange={onChange}
                                        type={overtimeType === OVERTIME_TYPE.REGULAR ? 'regular' : 'night'}
                                        minTime={
                                            startTime
                                                ? format(startTime, 'HH:mm') === '23:30'
                                                    ? '24:00'
                                                    : format(addHours(startTime, 0.5), 'HH:mm')
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </RowComponent>
                        <TextInputComponent
                            label="work hours"
                            placeholder="enter work hours"
                            value={workHours}
                            readOnly
                            style={{ color: 'gray' }}
                            hideClear
                        />
                        <Controller
                            control={control}
                            name="note"
                            rules={{ required: 'note is required' }}
                            render={({ field: { value, onChange } }) => (
                                <TextInputComponent
                                    label="note"
                                    placeholder="enter note"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline
                                    style={{ height: 80, textAlignVertical: 'top' }}
                                    errorMessage={errors.note?.message}
                                />
                            )}
                        />

                        <ButtonComponent
                            textProps={{ text: 'submit' }}
                            onPress={handleSubmit(onSubmit)}
                            disabled={!isDirty || isCreatingOvertimeReport || isEditingOvertimeReport || !isValid}
                            loading={isCreatingOvertimeReport || isEditingOvertimeReport}
                        />
                    </ColumnComponent>
                </ScrollView>
            }
        </ModalWrapper>
    )
}