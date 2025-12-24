import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addHours, format } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'

import { showToast } from '@/alerts'
import meetingApi from '@/apis/meeting.api'
import {
    ButtonComponent,
    ColumnComponent,
    DateTimePicker,
    InlineDropdown,
    LoadingScreen,
    ModalWrapper,
    MultipleListSelector,
    RowComponent,
    TextComponent,
    TextInputComponent,
    TimeSlotSelector
} from '@/components'
import { useMeetingRooms, useUsersInfiniteQuery } from '@/hooks'
import { Meeting, MEETING_TYPE, QUERY_KEYS, roundUpTo15Minutes } from '@/lib'

type FormValues = {
    title: string
    meeting_date: Date
    start_time: Date
    end_time: Date
    meeting_type: number
    meeting_room: string
    invited: string[]
}

export default function CreateMeeting() {
    const queryClient = useQueryClient()
    const { id, meeting_room_id } = useLocalSearchParams<{ id: string, meeting_room_id: string }>()
    const router = useRouter()
    const {
        meetingRoomOptions,
        hasNextPage: hasNextPageMeetingRooms,
        fetchNextPage: fetchNextPageMeetingRooms,
        isFetchingNextPage: isFetchingNextPageMeetingRooms,
        isLoading: isLoadingMeetingRooms,
        isError: isErrorMeetingRooms,
    } = useMeetingRooms()

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
            meeting_type: MEETING_TYPE.MEETING_ROOM,
            meeting_room: meeting_room_id ? meeting_room_id : undefined,
            invited: [],
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
                meeting_type: meeting.meeting_type,
                meeting_room: meeting.meeting_room.id.toString(),
                invited: meeting.invited.map((item) => item.id.toString()),
            })
        }
    }, [meeting, reset])

    const { mutate: createMeeting, isPending: isCreatingMeeting } = useMutation({
        mutationFn: (data: FormValues) => {
            const payload = {
                ...data,
                meeting_room: Number(data.meeting_room),
                meeting_date: data?.meeting_date ? format(data.meeting_date, 'yyyy-MM-dd') : '',
                start_time: data?.start_time ? format(data.start_time, 'HH:mm:ss') : '',
                end_time: data?.end_time ? format(data.end_time, 'HH:mm:ss') : '',
                invited: data.invited.map((item) => parseInt(item)),
            }
            return meetingApi.createMeeting(payload)
        },
        onSuccess: () => {
            router.back()
            showToast('create_success')
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST_ATTEND] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETINGS] })
        },
    })

    const { mutate: editMeeting, isPending: isEditingMeeting } = useMutation({
        mutationFn: (data: FormValues) => {
            return meetingApi.editMeeting(Number(id), {
                title: data.title,
                meeting_date: data?.meeting_date ? format(data.meeting_date, 'yyyy-MM-dd') : '',
                start_time: data?.start_time ? format(data.start_time, 'HH:mm:ss') : '',
                end_time: data?.end_time ? format(data.end_time, 'HH:mm:ss') : '',
                meeting_type: data.meeting_type,
                meeting_room: Number(data.meeting_room),
                invited: data.invited.map((item) => parseInt(item)),
            })
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETINGS] })
            showToast('update_success')
        },
    })


    const onSubmit = (data: FormValues) => {
        if (id) {
            editMeeting(data)
        } else {
            createMeeting(data)
        }
    }

    return (
        <ModalWrapper isFullHeight>
            {(id && !meeting) ? <LoadingScreen /> :
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <ColumnComponent gap={15} style={{ padding: 10 }}>
                        <TextComponent
                            textAlign='center'
                            text={id ? 'edit meeting' : 'create meeting'}
                            type='display'
                        />

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
                        {!meeting_room_id &&
                            <Controller
                                control={control}
                                name="meeting_room"
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <InlineDropdown
                                        label="meeting room"
                                        selected={value}
                                        setSelected={onChange}
                                        selects={meetingRoomOptions}
                                        placeholder='select a meeting room'
                                        hideFooter
                                        isClearable
                                        isLoading={isLoadingMeetingRooms}
                                        isFetchingNextPage={isFetchingNextPageMeetingRooms}
                                        loadMore={fetchNextPageMeetingRooms}
                                        hasMore={hasNextPageMeetingRooms}
                                        isError={isErrorMeetingRooms}
                                        errorMessage={errors.meeting_room?.message}
                                    />
                                )}
                            />
                        }
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
                            disabled={!isDirty || isCreatingMeeting || isEditingMeeting || !isValid}
                            loading={isCreatingMeeting || isEditingMeeting}
                        />
                    </ColumnComponent>
                </ScrollView>
            }
        </ModalWrapper>
    )
}