
import {
  Container,
  FlatListComponent
} from "@/components"

import HistoryCard from "@/components/my-projects/history/history-card"
import { useProjectHistories } from "@/hooks"
import { ProjectHistory } from "@/lib"
import useStore from "@/store"

export default function ProjectHistoryScreen() {
  const { projectStore } = useStore()
  const {
    histories,
    refetch,
    isRefetching,
    isLoading,
    isError,
  } = useProjectHistories({ project_id: Number(projectStore.id) })

  return (
    <Container>
      <FlatListComponent
        data={histories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: ProjectHistory }) => <HistoryCard {...item} />}
        onRefresh={refetch}
        refreshing={isRefetching}
        isLoading={isLoading}
        isError={isError}
        hasBottomTabBar
      />
    </Container>
  )
}
