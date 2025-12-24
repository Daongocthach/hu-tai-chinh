import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ScrollView } from 'react-native'

import { showAlert, showToast } from '@/alerts'
import meetingApi from '@/apis/meeting.api'
import {
    AvatarLabel,
    ButtonComponent,
    CameraModal,
    CardContainer,
    ChipComponent,
    ColumnComponent,
    ConfirmRejectSwitch,
    Container,
    IconLabel,
    ImageComponent,
    PlusButton,
    RefreshControlComponent,
    RoomServices,
    RowComponent,
    TextComponent,
    UsersTagged,
} from '@/components'
import { useCameraPermission, useMeeting } from '@/hooks'
import {
    ConfirmState,
    MEETING_INVITED_STATUS,
    MEETING_STATUS,
    MEETING_STATUS_OPTIONS,
    ROLES
} from '@/lib'
import useStore from '@/store'

export default function Meeting() {
    const { t } = useTranslation()
    const { checkAndRequestPermission } = useCameraPermission()
    const { userData } = useStore()
    const { id, name, } = useLocalSearchParams<{ id: string, name: string }>()
    const [visible, setVisible] = useState(false)
    const [status, setStatus] = useState<ConfirmState>('neutral')

    const {
        meeting,
        isRefetching,
        isLoading,
        refetch,
        completeMutation,
        jointMeetingMutation,
        deleteMutation,
    } = useMeeting({ id })

    const room = meeting?.meeting_room
    const building = meeting?.meeting_room?.floor?.building
    const meetingStatus = meeting?.status
    const isAdmin = useMemo(() => userData?.role === ROLES.ADMIN, [userData?.role])
    const isOrganizer = useMemo(() => meeting?.organizer?.id === userData?.id, [meeting?.organizer?.id, userData?.id])
    const isInvited = useMemo(() => meeting?.invited?.some(user => user.id === userData?.id), [meeting?.invited, userData?.id])

    useEffect(() => {
        if (meeting?.confirmed?.some(user => user.id === userData?.id)) {
            setStatus('confirmed')
        } else if (meeting?.rejected?.some(user => user.id === userData?.id)) {
            setStatus('rejected')
        } else {
            setStatus('neutral')
        }
    }, [meetingStatus])

    const handleOpenUrl = (meeting_link: string | null) => {
        if (!meeting_link) return
        showAlert("open_link", () => Linking.openURL(meeting_link))
    }

    const handleScanPress = async () => {
        const hasPermission = await checkAndRequestPermission()
        if (hasPermission) {
            setVisible(true)
        }
    }

    const { mutate: confirmMeeting, isPending } = useMutation({
        mutationFn: (newStatus: ConfirmState) => meetingApi.confirmMeeting(
            meeting?.id ?? -1,
            newStatus === 'confirmed' ? MEETING_INVITED_STATUS.CONFIRMED :
                newStatus === 'rejected' ? MEETING_INVITED_STATUS.REJECTED :
                    MEETING_INVITED_STATUS.UNCONFIRMED
        ),
        onSuccess: (_, newStatus) => {
            showToast('update_success')
            setStatus(newStatus)
            refetch()
        }
    })


    const handleDeleteMeeting = () => {
        showAlert('delete_meeting_confirm', async () => {
            await deleteMutation.mutateAsync()
        })
    }

    return (
        <Container headerTitle={name ?? 'meeting'} style={{ position: 'relative' }}>
            <ScrollView
                refreshControl={
                    <RefreshControlComponent
                        refreshing={isRefetching || isLoading}
                        onRefresh={refetch}
                    />
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <ColumnComponent gap={10}>
                    <CardContainer>
                        <ColumnComponent gap={10}>
                            <RowComponent justify='space-between'>
                                <TextComponent
                                    text={room?.name ?? ""}
                                    type='title1'
                                    style={{ flexShrink: 1 }}
                                />
                            </RowComponent>
                            <RowComponent gap={10} alignItems='center' style={{ marginTop: 10 }}>
                                <ImageComponent
                                    uri={building?.image}
                                    isShowViewer
                                    style={{ width: 120, height: 120, borderRadius: 10 }}
                                    resizeMode='cover'
                                />
                                <ColumnComponent gap={8} justify='center'>
                                    <TextComponent
                                        text={building?.name}
                                        type='title2'
                                    />
                                    <RoomServices
                                        isOnlyIcon
                                        isWifi={room?.wifi}
                                        isProjector={room?.projector}
                                        isTelevision={room?.television ? true : false}
                                        isWhiteboard={room?.whiteboard}
                                    />
                                    <IconLabel
                                        iconProps={{ name: 'Users' }}
                                        label={`${room?.capacity} ${t("persons")}`}
                                    />
                                    {room?.floor?.name && (
                                        <IconLabel
                                            iconProps={{ name: 'Layers2' }}
                                            label={room.floor.name}
                                        />
                                    )}
                                    {room?.floor?.building?.address && (
                                        <IconLabel
                                            iconProps={{ name: 'MapPin' }}
                                            label={room.floor.building.address}
                                        />
                                    )}
                                </ColumnComponent>
                            </RowComponent>
                        </ColumnComponent>
                    </CardContainer>
                    <CardContainer>
                        <ColumnComponent gap={10}>
                            <RowComponent gap={10} justify='space-between'>
                                <RowComponent gap={10}>
                                    <ButtonComponent
                                        isIconOnly
                                        iconProps={{ name: 'CalendarDays', size: 14 }}
                                        textProps={{
                                            text: (meeting?.meeting_date ? format(meeting?.meeting_date?.toString(), "yyyy-MM-dd") ?? "" : "") + '   ' +
                                                (meeting ? `${meeting.start_time.slice(0, -3)} - ${meeting.end_time.slice(0, -3)}` : ""),
                                            type: 'caption'
                                        }}
                                    />
                                </RowComponent>

                                <RowComponent gap={10}>
                                    {meeting?.status &&
                                        <ChipComponent
                                            textProps={{
                                                text: MEETING_STATUS_OPTIONS?.[meeting.status]?.label,
                                                color: MEETING_STATUS_OPTIONS?.[meeting.status]?.color,
                                                numberOfLines: 1,
                                            }}
                                            rowProps={{
                                                backgroundColor: MEETING_STATUS_OPTIONS?.[meeting.status]?.containerColor,
                                            }}
                                        />
                                    }
                                    {(isOrganizer || isAdmin) &&
                                        <ButtonComponent
                                            isIconOnly
                                            iconProps={{ name: 'Trash2', color: 'error' }}
                                            onPress={handleDeleteMeeting}
                                        />
                                    }
                                </RowComponent>
                            </RowComponent>

                            <AvatarLabel
                                avatarSize={30}
                                avatarUrl={meeting?.organizer?.avatar}
                                userName={meeting?.organizer?.full_name}
                                textProps={{
                                    text: meeting?.organizer?.full_name || '',
                                    type: 'title2',
                                    style: { flexShrink: 1 }
                                }}
                            />

                            {meeting?.meeting_link && (
                                <IconLabel
                                    iconProps={{
                                        name: 'Link',
                                        color: 'secondary',
                                    }}
                                    textProps={{
                                        type: 'link',
                                        color: 'secondary',
                                        style: { flexShrink: 1 },
                                        numberOfLines: undefined
                                    }}
                                    label={meeting.meeting_link}
                                    onPress={() => handleOpenUrl(meeting?.meeting_link)}
                                />
                            )}
                            <UsersTagged label="invited" users={meeting?.invited} />
                            <UsersTagged label="confirmed" users={meeting?.confirmed} />
                            <UsersTagged label="attended" users={meeting?.attended} />
                            <UsersTagged label="rejected" users={meeting?.rejected} />
                        </ColumnComponent>
                    </CardContainer>
                    {isInvited && (meetingStatus === MEETING_STATUS.UPCOMING || meetingStatus === MEETING_STATUS.ONGOING) &&
                        <ConfirmRejectSwitch
                            value={status}
                            onChange={confirmMeeting}
                            disabled={isPending}
                        />
                    }

                    {(isInvited || isOrganizer || isAdmin) && (meetingStatus === MEETING_STATUS.ONGOING) &&
                        <ButtonComponent
                            textProps={{ text: 'complete meeting' }}
                            backgroundColor='success'
                            onPress={() => showAlert('complete_meeting_confirm', async () => {
                                await completeMutation.mutateAsync()
                            })}
                            style={{ flex: 1 }}
                        />
                    }
                </ColumnComponent>
            </ScrollView>
            {meetingStatus === MEETING_STATUS.ONGOING &&
                <PlusButton
                    iconProps={{ name: 'ScanQrCode' }}
                    onPress={handleScanPress}
                />
            }
            <CameraModal
                visible={visible}
                isScanQR
                onClose={() => setVisible(false)}
                onReadCode={(code: string) => async () => {
                    await jointMeetingMutation.mutateAsync(code)
                }}
            />
        </Container>
    )
}