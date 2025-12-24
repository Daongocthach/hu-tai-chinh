import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'

import { showToast } from '@/alerts'
import timeSheetApi from '@/apis/time-sheet.api'
import {
    ButtonComponent,
    ColumnComponent,
    DateTimePicker,
    ModalWrapper,
    RowComponent,
    TextComponent,
    TextInputComponent
} from '@/components'
import OvertimeReportLine from '@/components/overtime-report/overtime-report-line'
import { LogTime, OverTime, QUERY_KEYS } from '@/lib'
import { format } from 'date-fns'
import { useEffect } from 'react'

type CreateEditTimeSheetFormValues = {
    work_date: Date
    work_hours: string
}

export default function CreateEditLogTime() {
    const { task_id, task_name } = useLocalSearchParams<{ task_id: string, task_name: string }>()
    const router = useRouter()
    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isValid, isDirty, errors },
    } = useForm<CreateEditTimeSheetFormValues>({
        mode: 'onChange',
        defaultValues: {
            work_date: new Date(),
            work_hours: '',
        },
    })

    const watchedWorkDate = watch('work_date')

    const { data: taskHours } = useQuery<{
        log_time: LogTime,
        overtime: OverTime[]
    }>({
        queryKey: [QUERY_KEYS.TASK_HOURS, task_id, watchedWorkDate?.toISOString().split('T')[0]],
        queryFn: async () => {
            const response = await timeSheetApi.getTaskHours({
                task_id: Number(task_id),
                work_date: format(watchedWorkDate, 'yyyy-MM-dd'),
            })

            return response.data.data
        },
        enabled: !!task_id,
    })

    useEffect(() => {
        if (taskHours) {
            reset({
                work_hours: taskHours.log_time?.work_hours?.toString() || '',
                work_date: watchedWorkDate,
            })
        }
    }, [taskHours, reset])

    const { mutate: createLogTime, isPending: isCreatingLogTime } = useMutation({
        mutationFn: (data: CreateEditTimeSheetFormValues) => {
            return timeSheetApi.createLogTime({
                task: Number(task_id),
                work_date: data.work_date ? format(data.work_date, 'yyyy-MM-dd') : '',
                work_hours: Number(data.work_hours),
            })
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_TASKS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASK_HOURS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, response?.data?.data?.task?.phase?.id.toString()] })
            showToast('create_success')
        },
    })

    const { mutate: editLogTime, isPending: isEditingLogTime } = useMutation({
        mutationFn: (data: CreateEditTimeSheetFormValues) => {
            return timeSheetApi.editLogTime(Number(taskHours?.log_time.id), {
                work_date: data.work_date ? format(data.work_date, 'yyyy-MM-dd') : '',
                work_hours: Number(data.work_hours),
            })
        },
        onSuccess: (response) => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_TASKS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASK_HOURS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, response?.data?.data?.task?.phase?.id.toString()] })
            showToast('update_success')
        },
    })

    const { mutate: deleteLogTime, isPending: isDeletingLogTime } = useMutation({
        mutationFn: () => {
            return timeSheetApi.deleteLogTime(Number(taskHours?.log_time.id))
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_TASKS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASK_HOURS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS, task_id] })
            showToast('update_success')
        },
    })

    const onSubmit = (data: CreateEditTimeSheetFormValues) => {
        if (taskHours?.log_time) {
            return editLogTime(data)
        }
        createLogTime(data)
    }

    return (
        <ModalWrapper isFullHeight>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <ColumnComponent gap={15} style={{ padding: 10 }}>
                    <ColumnComponent gap={5}>
                        <TextComponent
                            textAlign='center'
                            text='update working hours'
                            type='display'
                        />
                        {(taskHours?.log_time?.task?.name || task_name) &&
                            <TextComponent
                                textAlign='center'
                                text={taskHours?.log_time?.task?.name ?? task_name}
                                type='caption'
                            />
                        }
                    </ColumnComponent>
                    <Controller
                        control={control}
                        name="work_date"
                        render={({ field: { value, onChange } }) => (
                            <DateTimePicker
                                mode='date'
                                label='work date'
                                placeholder='select date'
                                dateTime={value}
                                setDateTime={onChange}
                                errorMessage={errors.work_date?.message}
                                hideClear
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="work_hours"
                        rules={{
                            required: 'work hours is required',
                            validate: value => {
                                const numberValue = Number(value)
                                if (numberValue < 0) {
                                    return 'work hours must be greater than or equal to 0'
                                }
                            }
                        }}
                        render={({ field: { value, onChange } }) => (
                            <RowComponent gap={5} alignItems='center'>
                                <TextInputComponent
                                    label="work hours"
                                    placeholder="enter work hours"
                                    value={value}
                                    keyboardType='numeric'
                                    onChangeText={(text) => {
                                        const normalized = text.replace(',', '.')
                                        onChange(normalized)
                                    }}
                                    viewStyle={{
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
                                    }}
                                />
                                <ButtonComponent
                                    outline
                                    buttonStyle={{
                                        marginTop: 20,
                                        borderRadius: 0,
                                        borderTopRightRadius: 8,
                                        borderBottomRightRadius: 8,
                                    }}
                                    backgroundColor={'outline'}
                                    iconProps={{ name: 'Trash2', color: 'error' }}
                                    onPress={() => deleteLogTime()}
                                    disabled={!taskHours?.log_time || isDeletingLogTime}
                                />
                            </RowComponent>
                        )}
                    />
                    <ColumnComponent gap={10} style={{ marginTop: 10 }}>
                        <TextComponent
                            text='overtime hours'
                            type='label'
                        />
                        {Array.isArray(taskHours?.overtime) && taskHours?.overtime.map((overtime) => {
                            return (
                                <OvertimeReportLine key={overtime.id} {...overtime} />
                            )
                        })}
                    </ColumnComponent>
                    <ButtonComponent
                        outline
                        textProps={{ text: 'add overtime hours' }}
                        onPress={() => router.push({
                            pathname: '/(modals)/create-edit-overtime-report',
                            params: {
                                task_id: task_id.toString(),
                                task_name: taskHours?.log_time?.task?.name ?? task_name,
                                work_date: format(watchedWorkDate, 'yyyy-MM-dd'),
                            }
                        })}
                    />
                    <ButtonComponent
                        textProps={{ text: taskHours?.log_time ? 'update' : 'submit' }}
                        onPress={handleSubmit(onSubmit)}
                        disabled={!isDirty || isCreatingLogTime || isEditingLogTime || !isValid}
                        loading={isCreatingLogTime || isEditingLogTime}
                    />
                </ColumnComponent>
            </ScrollView>
        </ModalWrapper>
    )
}