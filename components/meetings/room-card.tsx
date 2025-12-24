import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { icons } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import IconLabel from '@/components/common/icon-label'
import ImageComponent from '@/components/common/image-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import RoomServices from '@/components/meetings/room-services'

import { showAlert, showToast } from '@/alerts'
import roomApi from '@/apis/room.api'
import { useTheme } from '@/hooks'
import { MeetingRoom, QUERY_KEYS, ROLES, ROOM_STATUS } from '@/lib'
import useStore from '@/store'


export default function RoomCard(room: MeetingRoom) {
    const queryClient = useQueryClient()
    const router = useRouter()
    const { t } = useTranslation()
    const { userData } = useStore()
    const { colors } = useTheme()

    const handleRouting = () => {
        router.push({
            pathname: '/rooms/[id]',
            params: {
                id: room.id.toString(),
                name: room.name
            },
        })
    }

    if (!room) return null

    const infoList = [
        {
            show: !!room?.floor?.name,
            icon: 'Layers2',
            label: room?.floor?.name,
        },
        {
            show: !!room?.floor?.building?.name,
            icon: 'Building',
            label: room?.floor?.building?.name,
        },
        {
            show: !!room?.floor?.building?.address,
            icon: 'MapPin',
            label: room?.floor?.building?.address,
        },
        {
            show: true,
            icon: 'UsersRound',
            label: `${room.capacity} ${t("persons")}`,
        },
    ]

    const handleEdit = () => {
        router.push({
            pathname: '/create-edit-room',
            params: {
                id: room.id.toString(),
            },
        })
    }
    const handleDelete = () => {
        showAlert('delete_room_confirm', async () => deleteMutation.mutate())
    }

    const deleteMutation = useMutation({
        mutationFn: () => roomApi.deleteRoom(Number(room.id)),
        onSuccess: () => {
            showToast("delete_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETING_ROOMS] })
        },
    })

    return (
        <CardContainer onPress={handleRouting} gap={10}>
            {userData?.role === ROLES.ADMIN &&
                <RowComponent justify="flex-end" gap={15}>
                    <ButtonComponent
                        isIconOnly
                        iconProps={{ name: 'Pencil', size: 16 }}
                        onPress={handleEdit}
                    />
                    <ButtonComponent
                        isIconOnly
                        iconProps={{ name: 'Trash2', color: 'error', size: 16 }}
                        onPress={handleDelete}
                    />
                </RowComponent>
            }
            <RowComponent gap={10} alignItems='center'>
                <ImageComponent
                    uri={room?.image}
                    style={{ width: 100, height: 100, borderRadius: 10, backgroundColor: colors.cardVariant }}
                    resizeMode='contain'
                />

                <ColumnComponent style={{ flexGrow: 1, flexShrink: 1 }} gap={10}>
                    <RowComponent gap={5} justify='space-between' >
                        <TextComponent
                            text={room.name}
                            type="body"
                            fontWeight='semibold'
                            style={{ flexShrink: 1 }}
                        />
                        <ChipComponent
                            textProps={{
                                text: room?.status === ROOM_STATUS.FIXED ? 'fixed' : 'available',
                                color: room?.status === ROOM_STATUS.FIXED ? 'error' : 'success',
                                numberOfLines: 1,
                            }}
                            rowProps={{
                                backgroundColor: room?.status === ROOM_STATUS.FIXED ? colors.errorContainer :
                                    colors.successContainer,
                            }}
                        />
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
                    <RoomServices
                        isOnlyIcon
                        isWifi={room.wifi}
                        isProjector={room.projector}
                        isTelevision={room.television ? true : false}
                        isWhiteboard={room.whiteboard}
                    />
                </ColumnComponent>
            </RowComponent>
        </CardContainer>
    )
}
