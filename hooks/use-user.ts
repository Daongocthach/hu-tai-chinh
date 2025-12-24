import { showToast } from "@/alerts"
import userApi from "@/apis/user.api"
import { useTheme } from "@/hooks/use-theme"
import {
    QUERY_KEYS
} from "@/lib"
import { ROLES } from "@/lib/constants/user.constant"
import useStore from "@/store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export function useUser({ id }: { id: number }) {
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    const { colors } = useTheme()
    const { userData } = useStore()

    const isAdmin = userData?.role === ROLES.ADMIN

    const { mutateAsync: disableMutation } = useMutation({
        mutationFn: () => userApi.disableAccount(Number(id)),
        onSuccess: () => {
            showToast("submit_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] })
        },
    })

    const { mutateAsync: activeMutation } = useMutation({
        mutationFn: () => userApi.activeAccount(Number(id)),
        onSuccess: () => {
            showToast("submit_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] })
        },
    })


    return {
        t,
        colors,
        isAdmin,
        disableMutation,
        activeMutation,
    }
}
