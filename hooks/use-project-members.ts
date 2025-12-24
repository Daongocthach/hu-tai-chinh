import projectApi from "@/apis/project.api"
import { ProjectMember, QUERY_KEYS } from "@/lib"
import { useQuery } from "@tanstack/react-query"

export function useProjectMembers({ id }: { id: string }) {
    const query = useQuery<ProjectMember[]>({
        queryKey: [QUERY_KEYS.PROJECT_MEMBERS, id],
        queryFn: () => projectApi.getMembersByProject(Number(id)).then(response => {
            return response.data.data
        }),
        enabled: !!id,
    })

    return {
        ...query,
        projectMembers: query.data,
    }
}