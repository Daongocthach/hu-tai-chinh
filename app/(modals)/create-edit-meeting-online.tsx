import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'

import { showToast } from '@/alerts'
import meetingApi from '@/apis/meeting.api'
import { ColumnComponent, InlineDropdown, LoadingScreen, ModalWrapper, MultipleListSelector, RowComponent, TimeSlotSelector } from '@/components'
import ButtonComponent from '@/components/common/button-component'
import DateTimePicker from '@/components/common/date-time-picker'
import TextComponent from '@/components/common/text-component'
import TextInputComponent from '@/components/common/text-input-component'
import { useUsersInfiniteQuery } from '@/hooks/use-users-infinite-query'
import { Meeting, MEETING_TYPE, QUERY_KEYS, roundUpTo15Minutes } from '@/lib'
import { addHours, format } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'

type FormValues = {
    title: string
    meeting_date: Date
    start_time: Date
    end_time: Date
    meeting_type: number
    invited: string[]
    meeting_link: string
    conferencing: 'google_meet' | 'zoom'
}

const meeting_conferencing_options = [
    { label: 'Google Meet', value: 'google_meet' },
    { label: 'Zoom', value: 'zoom' },
]

export default function CreateMeetingOnline() {
    const queryClient = useQueryClient()
    const { id, } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()

    const {
        userOptions,
        searchUser,
        setSearchUser,
        hasNextPage: hasNextPageUsers,
        fetchNextPage: fetchNextPageUsers,
        isFetchingNextPage: isFetchingNextPageUsers,
        isLoading: isLoadingUsers,
        isError: isErrorUsers,
    } = useUsersInfiniteQuery()

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isValid, isDirty, errors },
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            meeting_date: new Date(),
            start_time: roundUpTo15Minutes(new Date()),
            end_time: roundUpTo15Minutes(new Date(addHours(new Date(), 1))),
            meeting_type: MEETING_TYPE.MEETING_ONLINE,
            invited: [],
            meeting_link: '',
            conferencing: 'google_meet',
        },
    })

    const { data: meeting } = useQuery<Meeting>({
        queryKey: [QUERY_KEYS.MEETING, id],
        queryFn: async () => {
            const response = await meetingApi.getMeeting(Number(id))
            const data = response.data.data
            return data
        },
        enabled: !!id,
    })

    const startTime = watch("start_time")


    useEffect(() => {
        if (meeting) {
            reset({
                title: meeting.title,
                meeting_date: new Date(meeting.meeting_date),
                start_time: new Date(`${meeting.meeting_date}T${meeting.start_time}`),
                end_time: new Date(`${meeting.meeting_date}T${meeting.end_time}`),
                meeting_type: MEETING_TYPE.MEETING_ONLINE,
                invited: meeting.invited.map((item) => item.id.toString()),
                meeting_link: meeting.meeting_link,
                conferencing: meeting.meeting_link?.includes("zoom")
                    ? "zoom"
                    : "google_meet",
            })
        }
    }, [meeting, reset])


    const { mutate: createMeetingOnline, isPending: isCreatingMeetingOnline } = useMutation({
        mutationFn: (data: FormValues) => {
            const payload = {
                title: data.title,
                meeting_type: MEETING_TYPE.MEETING_ONLINE,
                meeting_link: data.meeting_link,
                conferencing: data.conferencing,
                meeting_date: data?.meeting_date ? format(data.meeting_date, 'yyyy-MM-dd') : '',
                start_time: data?.start_time ? format(data.start_time, 'HH:mm:ss') : '',
                end_time: data?.end_time ? format(data.end_time, 'HH:mm:ss') : '',
                invited: data.invited.map((item) => parseInt(item)),
            }
            return meetingApi.createMeeting(payload)
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETINGS_ONLINE] })
            showToast('create_success')
        },
    })

    const { mutate: editMeetingOnline, isPending: isEditingMeetingOnline } = useMutation({
        mutationFn: (data: FormValues) => {
            return meetingApi.editMeeting(Number(id), {
                title: data.title,
                meeting_date: data?.meeting_date ? format(data.meeting_date, 'yyyy-MM-dd') : '',
                start_time: data?.start_time ? format(data.start_time, 'HH:mm:ss') : '',
                end_time: data?.end_time ? format(data.end_time, 'HH:mm:ss') : '',
                meeting_type: MEETING_TYPE.MEETING_ONLINE,
                meeting_room: undefined,
                invited: data.invited.map((item) => parseInt(item)),
                meeting_link: data.meeting_link,
                conferencing: data.conferencing,
            })
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETINGS_ONLINE] })
            showToast('update_success')
        },
    })


    const onSubmit = (data: FormValues) => {
        if (id) {
            editMeetingOnline(data)
        } else {
            createMeetingOnline(data)
        }
    }

    return (
        <ModalWrapper isFullHeight>
            {(id && !meeting) ? <LoadingScreen /> :
                <ScrollView>
                    <ColumnComponent gap={15} style={{ padding: 10 }}>
                        <TextComponent
                            textAlign='center'
                            text={id ? 'edit meeting online' : 'create meeting online'}
                            type='display' />
                        <Controller
                            control={control}
                            name="title"
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextInputComponent
                                    label="title"
                                    placeholder="enter meeting title"
                                    value={value}
                                    onChangeText={onChange}
                                    errorMessage={errors.title?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="meeting_date"
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <DateTimePicker
                                    mode='date'
                                    label='date'
                                    placeholder='select meeting date'
                                    dateTime={value}
                                    setDateTime={onChange}
                                    hideClear
                                    errorMessage={errors.meeting_date?.message}
                                />
                            )}
                        />
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
                                        stepMinutes={15}
                                        maxTime='23:45'
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
                                        stepMinutes={15}
                                        minTime={
                                            startTime ? format(startTime, 'HH:mm') === '23:45'
                                                ? '24:00'
                                                : format(addHours(startTime, 0.25), 'HH:mm')
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </RowComponent>
                        <Controller
                            control={control}
                            name="meeting_link"
                            rules={{ required: "meeting link is required" }}
                            render={({ field: { value, onChange } }) => (
                                <TextInputComponent
                                    label="meeting link"
                                    placeholder="enter meeting link"
                                    value={value}
                                    onChangeText={onChange}
                                    errorMessage={errors.meeting_link?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="conferencing"
                            rules={{ required: "conferencing is required" }}
                            render={({ field: { value, onChange } }) => (
                                <InlineDropdown
                                    label="conferencing"
                                    selected={value}
                                    setSelected={onChange}
                                    selects={meeting_conferencing_options}
                                    placeholder='select a conferencing option'
                                    hideFooter
                                    errorMessage={errors.conferencing?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="invited"
                            render={({ field: { value, onChange } }) => (
                                <MultipleListSelector
                                    label="participants"
                                    selected={value}
                                    setSelected={onChange}
                                    selects={userOptions}
                                    placeholder='select an user'
                                    isLoading={isLoadingUsers}
                                    isFetchingNextPage={isFetchingNextPageUsers}
                                    loadMore={fetchNextPageUsers}
                                    hasMore={hasNextPageUsers}
                                    isError={isErrorUsers}
                                    searchValue={searchUser}
                                    setSearchValue={setSearchUser}
                                    searchPlaceholder='search user'
                                />
                            )}
                        />

                        <ButtonComponent
                            textProps={{ text: 'submit' }}
                            onPress={handleSubmit(onSubmit)}
                            disabled={!isDirty || isCreatingMeetingOnline || isEditingMeetingOnline || !isValid}
                            loading={isCreatingMeetingOnline || isEditingMeetingOnline}
                        />
                    </ColumnComponent>
                </ScrollView>
            }
        </ModalWrapper>
    )
}