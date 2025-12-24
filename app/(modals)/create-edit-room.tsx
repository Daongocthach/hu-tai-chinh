import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView } from 'react-native'

import { showToast } from '@/alerts'
import roomApi from '@/apis/room.api'
import {
    ButtonComponent,
    ChipSelector,
    ColumnComponent,
    ImagePickerButton,
    InlineDropdown,
    LoadingScreen,
    ModalWrapper,
    TextComponent,
    TextInputComponent
} from '@/components'
import { useBuildingsInfiniteQuery } from '@/hooks/use-buildings-infinite-query'
import { DropdownProps, FileProps, MeetingRoom, parseFileFromUrl, QUERY_KEYS, ROOM_FACILITIES, ROOM_STATUS } from '@/lib'

type CreateRoomFormValues = {
    name: string
    capacity: string
    building: string
    floor: number
    status: number
    facilities: string[]
    television: string
    image: FileProps | null
}

export default function CreateRoom() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { id } = useLocalSearchParams<{ id: string }>()
    const { television, ...facilitiesForSelector } = ROOM_FACILITIES
    const [floorOptions, setFloorOptions] = useState<DropdownProps[]>([])

    const {
        buildings,
        buildingOptions,
        hasNextPage: hasNextPageBuildings,
        fetchNextPage: fetchNextPageBuildings,
        isFetchingNextPage: isFetchingNextPageBuildings,
        isLoading: isLoadingBuildings,
        isError: isErrorBuildings,
    } = useBuildingsInfiniteQuery()

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { isValid, isDirty, errors },
    } = useForm<CreateRoomFormValues>({
        mode: 'onChange',
        defaultValues: {
            capacity: '10',
            name: '',
            television: '',
            status: ROOM_STATUS.AVAILABLE,
            building: '',
            facilities: ['wifi', 'whiteboard', 'projector'],
        },
    })

    const selectedBuildingId = getValues('building')

    const { data: room } = useQuery<MeetingRoom>({
        queryKey: [QUERY_KEYS.MEETING_ROOM, id],
        queryFn: async () => {
            const response = await roomApi.getRoomById(Number(id))
            const data = response.data.data
            return data
        },
        enabled: !!id,
    })

    useEffect(() => {
        if (room) {
            reset({
                name: room.name,
                capacity: room.capacity.toString(),
                television: room.television,
                building: room.floor.building.id.toString(),
                floor: room.floor.id,
                facilities: [
                    room.wifi ? 'wifi' : '',
                    room.whiteboard ? 'whiteboard' : '',
                    room.projector ? 'projector' : '',
                ].filter(Boolean) as string[],
                image: parseFileFromUrl(room.image) ?? null,
            })
            handleBuildingChange(room.floor.building.id.toString())
        }
    }, [room, setValue])


    const handleBuildingChange = (buildingId: string) => {
        setValue('building', buildingId)

        const foundBuilding = buildings?.find(building => building?.id?.toString() === buildingId)

        if (foundBuilding) {
            const newFloorOptions = foundBuilding.floors.map(floor => ({
                label: floor.name,
                value: floor.id,
            }))
            setFloorOptions(newFloorOptions)
        } else {
            setFloorOptions([])
        }
    }


    const { mutate: createRoom, isPending: isCreatingRoom } = useMutation({
        mutationFn: (data: CreateRoomFormValues) => {
            return roomApi.createRoom({
                name: data.name,
                capacity: Number(data.capacity),
                wifi: data.facilities.includes('wifi'),
                whiteboard: data.facilities.includes('whiteboard'),
                projector: data.facilities.includes('projector'),
                television: data.television,
                status: data.status,
                floor: data.floor,
                building: Number(data.building),
                image: data.image ?? undefined,
            })
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETING_ROOMS] })
            showToast('create_success')
        },
    })

    const { mutate: editRoom, isPending: isEditingRoom } = useMutation({
        mutationFn: (data: CreateRoomFormValues) => {
            return roomApi.editRoom(
                Number(id), {
                name: data.name,
                capacity: Number(data.capacity),
                wifi: data.facilities.includes('wifi'),
                whiteboard: data.facilities.includes('whiteboard'),
                projector: data.facilities.includes('projector'),
                television: data.television,
                status: data.status,
                floor: data.floor,
                building: Number(data.building),
                image: data.image ?? undefined,
            })
        },
        onSuccess: () => {
            router.back()
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETING_ROOMS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEETING] })
            showToast('update_success')
        },
    })

    const onSubmit = (data: CreateRoomFormValues) => {
        if (id) {
            editRoom(data)
        } else {
            createRoom(data)
        }
    }

    return (
        <ModalWrapper isFullHeight>
            {(id && !room) ? <LoadingScreen /> :
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <ColumnComponent gap={15} style={{ padding: 10 }}>
                        <TextComponent
                            textAlign='center'
                            text={id ? 'edit room' : 'create room'}
                            type='display'
                        />
                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: 'room name is required' }}
                            render={({ field: { value, onChange } }) => (
                                <TextInputComponent
                                    label="name"
                                    placeholder="enter room name"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="capacity"
                            rules={{
                                required: 'capacity is required',
                                validate: value => Number(value) > 0 || 'capacity must be greater than 0'
                            }}
                            render={({ field: { value, onChange } }) => (
                                <TextInputComponent
                                    label="capacity"
                                    placeholder="enter capacity"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="television"
                            render={({ field: { value, onChange } }) => (
                                <TextInputComponent
                                    label="television"
                                    placeholder="enter television"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="facilities"
                            render={({ field: { value, onChange } }) => (
                                <ChipSelector
                                    label="facilities"
                                    values={value}
                                    setValues={onChange}
                                    selectOptions={facilitiesForSelector}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="building"
                            rules={{ required: 'building is required' }}
                            render={({ field: { value, onChange } }) => (
                                <InlineDropdown
                                    label="building"
                                    selected={value}
                                    setSelected={handleBuildingChange}
                                    selects={buildingOptions}
                                    placeholder='select a building'
                                    hideFooter
                                    isLoading={isLoadingBuildings}
                                    isFetchingNextPage={isFetchingNextPageBuildings}
                                    loadMore={fetchNextPageBuildings}
                                    hasMore={hasNextPageBuildings}
                                    isError={isErrorBuildings}
                                    errorMessage={errors.building?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="floor"
                            rules={{ required: 'floor is required' }}
                            render={({ field: { value, onChange } }) => (
                                <InlineDropdown
                                    label="floor"
                                    selected={value}
                                    setSelected={onChange}
                                    selects={floorOptions}
                                    placeholder='select a floor'
                                    hideFooter
                                    disabled={!selectedBuildingId}
                                    errorMessage={errors.floor?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="image"
                            rules={{ required: 'image is required' }}
                            render={({ field: { value, onChange } }) => (
                                <ImagePickerButton
                                    isSingle
                                    value={value}
                                    setValue={onChange}
                                />
                            )}
                        />

                        <ButtonComponent
                            textProps={{ text: 'submit' }}
                            onPress={handleSubmit(onSubmit)}
                            disabled={!isDirty || !isValid}
                            loading={isCreatingRoom || isEditingRoom}
                        />
                    </ColumnComponent>
                </ScrollView>
            }
        </ModalWrapper>
    )
}