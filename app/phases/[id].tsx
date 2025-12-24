import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams, useRouter } from "expo-router"

import {
    Container,
    FlatListComponent,
    LoadingScreen,
    TaskCard
} from "@/components"

import phaseApi from "@/apis/phase.api"
import tasksApi from "@/apis/task.api"
import { CommentContentClass, QUERY_KEYS } from "@/lib"
import useStore from "@/store"
import { useEffect } from "react"

export default function PhaseScreen() {
    const router = useRouter()
    const { userData } = useStore()
    const { id, name, task_id } = useLocalSearchParams<{
        id: string,
        name?: string,
        task_id?: string
    }>()

    const { data: tasks, refetch, isRefetching, isLoading: isLoadingTasks, isError } = useQuery({
        queryKey: [QUERY_KEYS.TASKS, id],
        queryFn: () => tasksApi.getTasksByPhase(Number(id), userData?.role)
            .then(res => res.data.data),
        enabled: !!id,
    })

    const { data: phase, isLoading: isLoadingPhase } = useQuery({
        queryKey: [QUERY_KEYS.PHASE, id],
        queryFn: () => phaseApi.getPhase(Number(id)).then(res => res.data.data),
        enabled: !!id && !name,
    })

    useEffect(() => {
        if (id && task_id && tasks && !isLoadingTasks && !isLoadingPhase) {
            router.push({
                pathname: '/comment-modal',
                params: {
                    objectId: task_id.toString(),
                    contentClass: 'task' as CommentContentClass
                }
            })
            router.setParams({ task_id: undefined })
        }
    }, [id, task_id, tasks, isLoadingTasks, isLoadingPhase, router])

    if (!tasks || isLoadingTasks || (!name && isLoadingPhase)) {
        return <LoadingScreen />
    }

    const headerTitle = name ?? phase?.name ?? "Phase"

    return (
        <Container headerTitle={headerTitle}>
            <FlatListComponent
                data={tasks}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <TaskCard {...item} />}
                onRefresh={refetch}
                refreshing={isRefetching}
                isLoading={isLoadingTasks}
                isError={isError}
                contentContainerStyle={{ paddingBottom: 150 }}
            />
        </Container>
    )
}
