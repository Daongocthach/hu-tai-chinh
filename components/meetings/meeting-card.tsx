import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { icons } from 'lucide-react-native'

import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import IconLabel from '@/components/common/icon-label'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'

import { showAlert, showToast } from '@/alerts'
import meetingApi from '@/apis/meeting.api'
import { Meeting, MEETING_STATUS_OPTIONS, MEETING_TYPE, QUERY_KEYS } from '@/lib'
import useStore from '@/store'


export default function MeetingCard(meeting: Meeting) {
    const { userData } = useStore()
    const queryClient = useQueryClient()
    const router = useRouter()

    const handleOpenUrl = async (meeting_link: string | null) => {
        if (!meeting_link) return
        await WebBrowser.openBrowserAsync(meeting_link)
    }

    const deleteMutation = useMutation({
        mutationFn: () => meetingApi.deleteMeeting(Number(meeting.id)),
        onSuccess: () => {
            showToast("delete_success")
            queryClient.invalidateQueries({
                queryKey: [
                    meeting.meeting_type === MEETING_TYPE.MEETING_ROOM ?
                        QUERY_KEYS.MEETINGS : QUERY_KEYS.MEETINGS_ONLINE
                ]
            })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST_ATTEND] })
        },
    })

    const handleRouting = () => {
        router.push({
            pathname: '/meetings/[id]',
            params: {
                id: meeting.id,
                name: meeting.title,
            },
        })
    }

    const infoList = [
        {
            show: !!meeting?.organizer?.full_name,
            icon: 'UserRoundCog',
            label: meeting?.organizer?.full_name,
        },
        {
            show: !!meeting?.meeting_date,
            icon: 'Calendar',
            label: meeting?.meeting_date.toString(),
        },
        {
            show: !!meeting?.start_time || !!meeting?.end_time,
            icon: 'CalendarClock',
            label: meeting?.start_time.slice(0, -3) + " - " + meeting?.end_time.slice(0, -3),
        },
    ]

    if (!meeting) return null


    const handleEdit = () => {
        router.push({
            pathname: meeting.meeting_type === MEETING_TYPE.MEETING_ROOM ? '/create-edit-meeting' : '/create-edit-meeting-online',
            params: {
                id: meeting.id.toString(),
            },
        })
    }
    const handleDelete = () => {
        showAlert('delete_meeting_confirm', async () => deleteMutation.mutate())
    }

    return (
        <CardContainer onPress={handleRouting}>
            <ColumnComponent style={{ flexGrow: 1, flexShrink: 1 }} gap={10}>
                <RowComponent gap={5} justify='space-between' >
                    <TextComponent
                        text={meeting.title}
                        type="title1"
                        numberOfLines={1}
                        style={{ flexShrink: 1 }}
                    />
                    <RowComponent gap={10}>
                        <ChipComponent
                            textProps={{
                                text: MEETING_STATUS_OPTIONS?.[meeting?.status]?.label,
                                color: MEETING_STATUS_OPTIONS?.[meeting?.status]?.color,
                                numberOfLines: 1,
                            }}
                            rowProps={{
                                backgroundColor: MEETING_STATUS_OPTIONS?.[meeting?.status]?.containerColor,
                            }}
                        />
                        {/* <ButtonComponent
                            isIconOnly
                            iconProps={{ name: 'Pencil', size: 16 }}
                            onPress={handleEdit}
                        /> */}
                        {userData?.id === meeting?.organizer?.id &&
                            <ButtonComponent
                                isIconOnly
                                iconProps={{ name: 'Trash2', color: 'error', size: 16 }}
                                onPress={handleDelete}
                            />
                        }
                    </RowComponent>
                </RowComponent>
                {infoList
                    .filter(item => item.show)
                    .map((item, index) => (
                        <IconLabel
                            key={index}
                            iconProps={{
                                name: item.icon as keyof typeof icons,
                            }}
                            label={item.label}
                        />
                    ))}
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
                        label={"https:" + (meeting?.meeting_link || "...")}
                        onPress={() => handleOpenUrl(meeting?.meeting_link)}
                    />
                )}
            </ColumnComponent>
        </CardContainer>
    )
}
