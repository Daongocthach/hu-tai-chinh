import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'

import {
    ColumnComponent,
    Container,
    DateSelector,
    FlatListComponent,
    MeetingCard,
    PlusButton
} from '@/components'
import { useRoom } from '@/hooks/use-room'
import { Meeting } from '@/lib'

export default function Room() {
    const router = useRouter()
    const { id, name } = useLocalSearchParams<{ id: string, name: string }>()
    const [dateSelected, setDateSelected] = useState<Date | undefined>(new Date())
    const {
        meetings,
        isFetching,
        refetch,
    } = useRoom({ id, dateSelected })

    return (
        <Container headerTitle={name ?? 'room'}>
            <ColumnComponent gap={10}>
                <DateSelector
                    dateSelected={dateSelected || new Date()}
                    setDateSelected={setDateSelected}
                />
                <FlatListComponent
                    data={meetings}
                    keyExtractor={(item) => item.id.toString()}
                    refreshing={isFetching}
                    onRefresh={refetch}
                    renderItem={({ item }: { item: Meeting }) => (
                        <MeetingCard {...item} />
                    )}
                    extraPaddingBottom={20}
                />
            </ColumnComponent>
            <PlusButton
                onPress={() => {
                    router.push({
                        pathname: '/create-edit-meeting',
                        params: { meeting_room_id: id }
                    })
                }}
            />
        </Container>
    )
}