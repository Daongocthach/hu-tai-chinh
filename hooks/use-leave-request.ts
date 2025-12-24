import { showAlert, showToast } from "@/alerts"
import leaveRequestApi from "@/apis/leave-request.api"
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

export function useLeaveRequest({ id, userId }: { id: number, userId: number }) {
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
        mutationFn: () => leaveRequestApi.deleteLeaveRequest(Number(id)),
        onSuccess: () => {
            showToast("delete_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEAVE_REQUESTS] })
        },
    })

    const approveMutation = useMutation({
        mutationFn: () =>
            leaveRequestApi.determineLeaveRequest(Number(id), {
                determination: DETERMINATION.APPROVE,
            }),
        onSuccess: () => {
            showToast("submit_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEAVE_REQUESTS] })
        },
    })


    const rejectMutation = useMutation({
        mutationFn: () =>
            leaveRequestApi.determineLeaveRequest(Number(id), {
                determination: DETERMINATION.REJECT,
                rejection_reason: rejectionReason,
            }),
        onSuccess: () => {
            showToast("submit_success")
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LEAVE_REQUESTS] })
            setVisible(false)
        },
    })

    const handleEdit = () =>
        router.push({
            pathname: "/(modals)/create-edit-leave-request",
            params: { id: id.toString() },
        })

    const handleDelete = () =>
        showAlert("delete_leave_request_confirm", async () => deleteMutation.mutate())

    const handleApprove = () =>
        showAlert("approve_leave_request_confirm", async () => approveMutation.mutate())

    const handleReject = () => rejectMutation.mutate()

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
        showRejectModal,
        closeRejectModal,
        setRejectionReason,
        handleEdit,
        handleDelete,
        handleApprove,
        handleReject,
    }
}
