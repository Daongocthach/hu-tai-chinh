import { useQuery } from "@tanstack/react-query"

import projectApi from "@/apis/project.api"
import {
    ColumnComponent,
    Container,
    DepartmentCard,
    FlatListComponent,
    LoadingScreen,
    ProjectDetail,
    TextComponent
} from "@/components"

import { DepartmentDetails, Project, QUERY_KEYS } from "@/lib"
import useStore from "@/store"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"

export default function ProjectScreen() {
    const router = useRouter()
    const { objectId, contentClass, departmentId } = useLocalSearchParams<{
        departmentId?: string,
        objectId?: string,
        contentClass?: string
    }>()

    const { projectStore, userData } = useStore()

    const { data: project, refetch, isRefetching, isLoading, isError } = useQuery<Project>({
        queryKey: [QUERY_KEYS.PROJECT, projectStore.id],
        queryFn: () => projectApi.getProject(projectStore.id, userData?.role).then(response => {
            return response.data.data
        }),
        enabled: !!projectStore.id,
    })


    useEffect(() => {
        if (objectId && contentClass) {
            router.push({
                pathname: '/comment-modal',
                params: {
                    objectId: objectId.toString(),
                    contentClass: contentClass
                }
            })
            router.setParams({ objectId: undefined, contentClass: undefined, departmentId: undefined })
        }
    }, [objectId, contentClass, departmentId])

    if (!project) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <Container>
            <FlatListComponent
                data={project?.departments}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <ColumnComponent gap={20}>
                        <ProjectDetail project={project} />
                        <TextComponent type="title1" text="departments" />
                    </ColumnComponent>
                }
                renderItem={({ item }: { item: DepartmentDetails }) => <DepartmentCard
                    department={item} 
                    isExpandedDefault={contentClass === 'phase' && item.id.toString() === departmentId}
                />}
                onRefresh={refetch}
                refreshing={isRefetching}
                isLoading={isLoading}
                isError={isError}
                hasBottomTabBar
            />
        </Container>
    )
}
