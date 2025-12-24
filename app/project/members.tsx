
import {
  Container,
  FlatListComponent,
  LoadingScreen,
  MemberCard
} from "@/components"

import { useProjectMembers } from "@/hooks"
import { ProjectMember } from "@/lib"
import useStore from "@/store"

export default function ProjectScreen() {
    const { projectStore } = useStore()
    const { projectMembers, refetch, isRefetching, isLoading, isError } = useProjectMembers({ id: projectStore.id })

    if (!projectMembers) {
        return (
            <LoadingScreen />
        )
    }
    return (
        <Container>
            <FlatListComponent
                data={projectMembers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }: { item: ProjectMember }) => <MemberCard {...item} />}
                onRefresh={refetch}
                refreshing={isRefetching}
                isLoading={isLoading}
                isError={isError}
                hasBottomTabBar
            />
        </Container>
    )
}
