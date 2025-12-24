import { showAlert, showToast } from "@/alerts"
import overtimeReportApi from "@/apis/overtime-report.api"
import { useTheme } from "@/hooks/use-theme"
import {
    DETERMINATION,
    QUERY_KEYS
} from "@/lib"
import { ROLES } from "@/lib/constants/user.constant"
import useStore from "@/store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export function useOvertimeReport({
    id,
    userId,
    taskId,
}: { id: number, userId: number, taskId: number }) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { t } = useTranslation()
    const { colors } = useTheme()
    const { userData } = useStore()
    const [visible, setVisible] = useState(false)
    const [rejectionReason, setRejectionReason] = useState("")

    const isOwner = userId === userData?.id
    const isAdmin = userData?.role === ROLES.ADMIN

    const deleteMutation = useMutation({
        mutationFn: () => overtimeReportApi.deleteOvertimeReport(Number(id)),
        onSuccess: () => {
            showToast("delete_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OVERTIME_REPORTS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASK_HOURS] })
        },
    })

    const approveMutation = useMutation({
        mutationFn: () =>
            overtimeReportApi.determineOvertimeReport(Number(id), {
                determination: DETERMINATION.APPROVE,
            }),
        onSuccess: () => {
            showToast("submit_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OVERTIME_REPORTS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASK_HOURS] })
        },
    })


    const rejectMutation = useMutation({
        mutationFn: () =>
            overtimeReportApi.determineOvertimeReport(Number(id), {
                determination: DETERMINATION.REJECT,
                rejection_reason: rejectionReason,
            }),
        onSuccess: () => {
            showToast("submit_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OVERTIME_REPORTS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASK_HOURS] })
            setVisible(false)
        },
    })

    const handleEdit = () =>
        router.push({
            pathname: "/(modals)/create-edit-overtime-report",
            params: {
                id: id.toString(),
                task_id: taskId.toString(),
            },
        })

    const handleApprove = () =>
        showAlert("approve_overtime_report_confirm", async () => approveMutation.mutate())

    const showRejectModal = () => {
        setVisible(true)
    }

    const closeRejectModal = () => {
        setVisible(false)
    }

    return {
        t,
        colors,
        isOwner,
        isAdmin,
        rejectionReason,
        visible,
        rejectMutationPending: rejectMutation.isPending,
        deleteMutation,
        rejectMutation,
        approveMutation,
        showRejectModal,
        closeRejectModal,
        setRejectionReason,
        handleEdit,
    }
}
