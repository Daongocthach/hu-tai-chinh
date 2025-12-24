import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { BellRing, ClockAlert, Crown } from "lucide-react-native"
import React, { JSX } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, View } from "react-native"

import { showToast } from "@/alerts"
import notificationApi from "@/apis/notification.api"
import projectApi from "@/apis/project.api"
import ButtonComponent from "@/components/common/button-component"
import RowComponent from "@/components/common/row-component"
import TextComponent from "@/components/common/text-component"
import UserAvatar from "@/components/common/user-avatar"
import { useLocale, useTheme } from "@/hooks"
import { useSendMessageSocket } from "@/hooks/use-send-message-socket"
import {
    DepartmentDetails,
    NotificationProps,
    NOTIFICATIONS,
    PhaseDetails,
    PROJECT_STATUS,
    ProjectDepartment,
    ProjectStatusChangeRequest,
    QUERY_KEYS,
    TaskDetails
} from "@/lib"
import useStore from "@/store"

const IS_UPDATE_STATUS = true

export default function Notification(notification: NotificationProps) {
    const router = useRouter()
    const { sendMessage } = useSendMessageSocket()
    const queryClient = useQueryClient()
    const { formatDistance } = useLocale()
    const { t } = useTranslation()
    const { colors } = useTheme()
    const { currentLanguage, setActionName } = useStore()
    const {
        notify_type,
        created
    } = notification
    const dataContent = notification?.data


    const { mutate: handleProjectStatusChange, isPending, isSuccess } = useMutation({
        mutationFn: async ({ type, project_id }: { type: 'approve' | 'reject', project_id: number }) => {
            if (type === 'approve') {
                return projectApi.approveProject(project_id)
            } else if (type === 'reject') {
                return projectApi.rejectProject(project_id)
            }
        },
        onSuccess: (response) => {
            sendMessage?.('PROJECT_STATUS_UPDATED', { projectId: response?.data.project_id })
            showToast('submit_success')
        },
    })

    const approveChangeStatus = (project_id: number) => {
        handleProjectStatusChange({ type: 'approve', project_id })
    }

    const rejectChangeStatus = (project_id: number) => {
        handleProjectStatusChange({ type: 'reject', project_id })
    }

    const renderIcon = () => {
        if (notify_type === NOTIFICATIONS.TASKS.DELAYED) {
            return (
                <View style={{
                    backgroundColor: colors.error,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    height: 40,
                    width: 40,
                }}>
                    <ClockAlert size={20} color="white" />
                </View>
            )
        }

        if (
            [
                NOTIFICATIONS.TASKS.START_REMINDER,
                NOTIFICATIONS.MEETINGS.REMIND_MEETING,
                NOTIFICATIONS.MEETINGS.REMIND_MEETING_END,
            ].includes(notify_type)
        ) {
            return (
                <View
                    style={{
                        backgroundColor: colors.secondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        height: 40,
                        width: 40,
                    }}>
                    <BellRing size={20} color="white" />
                </View>
            )
        }

        if (notify_type === NOTIFICATIONS.SYSTEM.CREATED || !dataContent?.sender) {
            return (
                <View
                    style={{
                        backgroundColor: colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        height: 40,
                        width: 40,
                    }}>
                    <Crown size={20} color="white" />
                </View>
            )
        }

        return <UserAvatar
            avatarUrl={dataContent.sender?.avatar}
            avatarSize={40}
            userName={dataContent?.sender?.full_name}
        />
    }


    const Status = ({ data }: { data?: ProjectStatusChangeRequest }) => {
        if (!data) return null

        const getStatus = (status: number) => {
            switch (status) {
                case PROJECT_STATUS.NOT_STARTED:
                    return <TextComponent type="caption" color='secondary'>{t("not started")}</TextComponent>
                case PROJECT_STATUS.IN_PROGRESS:
                    return <TextComponent type="caption" color='warning'>{t("in progress")}</TextComponent>
                case PROJECT_STATUS.COMPLETED:
                    return <TextComponent type="caption" color='success'>{t("completed")}</TextComponent>
                case PROJECT_STATUS.PENDING:
                    return <TextComponent type="caption" color='tertiary'>{t("pending")}</TextComponent>
                case PROJECT_STATUS.CLOSED:
                    return <TextComponent type="caption" color='primary'>{t("closed")}</TextComponent>
                default:
                    return null
            }
        }

        return (
            <TextComponent type="caption" style={{ textTransform: "lowercase" }}>
                {t("from")} {getStatus(data.old_status)} {t("to")} {getStatus(data.new_status)}
            </TextComponent>
        )
    }

    const Content = () => {
        const senderName = dataContent?.sender?.full_name || ""
        const projectName = dataContent?.project?.name || ""
        const taskName = dataContent?.task?.name || ""
        const departmentName = dataContent?.project_department?.name || ""
        const fileCount = dataContent?.file_quantity || 1
        const dependentTaskName = dataContent?.dependent_task?.name || ""
        const phaseName = dataContent?.phase?.name || ""
        const groupName = dataContent?.group?.name || ""
        const reportName = dataContent?.report?.name || ""
        const startTime = dataContent?.overtime?.start_time.slice(0, 5) || ""
        const endTime = dataContent?.overtime?.end_time.slice(0, 5) || ""
        const leaveDate = dataContent?.leave_request?.leave_date || ""
        const workDate = dataContent?.date || ""

        const languageKey =
            currentLanguage === "zh-TW"
                ? "scn"
                : currentLanguage === "en"
                    ? "en"
                    : "vi"

        const Bold = ({ children }: { children: string }) => (
            <TextComponent type="caption" fontWeight="semibold" color={'onBackground'}>{children}</TextComponent>
        )

        if (notify_type === NOTIFICATIONS.SYSTEM.CREATED) {
            return (
                <TextComponent type="title2">
                    {dataContent?.message?.[languageKey] ?? "system notification"}
                </TextComponent>
            )
        }

        const commonRender = (segments: (string | JSX.Element)[], isUpdateStatus?: boolean) => (
            <View style={{
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                maxWidth: '90%'
            }}>
                <TextComponent type="label">
                    {segments.map((s, i) => (
                        <React.Fragment key={i}>{s}</React.Fragment>
                    ))}
                </TextComponent>
                {isUpdateStatus && !notification?.is_read && (
                    <RowComponent gap={5} style={{ marginVertical: 8 }}>
                        <ButtonComponent
                            textProps={{ text: 'reject' }}
                            backgroundColor='error'
                            onPress={() => rejectChangeStatus(dataContent.project?.id || -1)}
                            style={{ flex: 1 }}
                            disabled={isPending || isSuccess}
                        />
                        <ButtonComponent
                            textProps={{ text: 'approve' }}
                            onPress={() => approveChangeStatus(dataContent.project?.id || -1)}
                            style={{ flex: 1 }}
                            disabled={isPending || isSuccess}
                        />
                    </RowComponent>
                )}
            </View>
        )

        const senderNameEl = <Bold>{senderName}</Bold>
        const projectEl = <Bold>{projectName}</Bold>
        const taskEl = <Bold>{taskName}</Bold>
        const departmentNameEl = <Bold>{departmentName}</Bold>
        const dependentTaskEl = <Bold>{dependentTaskName}</Bold>
        const phaseNameEl = <Bold>{phaseName}</Bold>
        const groupNameEl = <Bold>{groupName}</Bold>
        const reportNameEl = <Bold>{reportName}</Bold>
        const startTimeEl = <Bold>{startTime}</Bold>
        const endTimeEl = <Bold>{endTime}</Bold>
        const leaveDateEl = <Bold>{leaveDate}</Bold>
        const workDateEl = <Bold>{workDate}</Bold>

        if (
            [
                NOTIFICATIONS.TASKS.RESPONSIBLE_CREATED,
                NOTIFICATIONS.TASKS.ACCOUNTABLE_CREATED,
                NOTIFICATIONS.TASKS.CONSULTED_CREATED,
                NOTIFICATIONS.TASKS.INFORMED_CREATED,
            ].includes(notify_type)
        ) {
            const roleMap: Record<string, string> = {
                [NOTIFICATIONS.TASKS.RESPONSIBLE_CREATED]: "Responsible",
                [NOTIFICATIONS.TASKS.ACCOUNTABLE_CREATED]: "Accountable",
                [NOTIFICATIONS.TASKS.CONSULTED_CREATED]: "Consulted",
                [NOTIFICATIONS.TASKS.INFORMED_CREATED]: "Informed",
            }

            const role = <Bold>{roleMap[notify_type]}</Bold>

            return (
                <View style={{ flexWrap: "wrap", flexDirection: "row", maxWidth: "90%" }}>
                    <TextComponent type="caption">{senderNameEl}</TextComponent>
                    <TextComponent type="caption"> {t("added you as")} </TextComponent>
                    <TextComponent type="caption">{role}</TextComponent>
                    <TextComponent type="caption"> {t("of the task")} </TextComponent>
                    <TextComponent type="caption">{taskEl}</TextComponent>
                    <TextComponent type="caption"> {t("on the project")} </TextComponent>
                    <TextComponent type="caption">{projectEl}</TextComponent>
                </View>
            )
        }

        // PROJECTS
        switch (notify_type) {
            case NOTIFICATIONS.PROJECTS.CREATED:
            case NOTIFICATIONS.PROJECTS.DUPLICATED:
            case NOTIFICATIONS.PROJECTS.UPDATED:
            case NOTIFICATIONS.PROJECTS.CLOSED:
            case NOTIFICATIONS.PROJECTS.REOPENED:
            case NOTIFICATIONS.PROJECTS.TRASHED:
            case NOTIFICATIONS.PROJECTS.DELETED:
            case NOTIFICATIONS.PROJECTS.RESTORED:
            case NOTIFICATIONS.PROJECTS.STATUS_UPDATED:
            case NOTIFICATIONS.PROJECTS.LEADER_CREATED:
            case NOTIFICATIONS.PROJECTS.LEADER_DELETED:
            case NOTIFICATIONS.PROJECTS.DEPARTMENT_LEADER_CREATED:
            case NOTIFICATIONS.PROJECTS.DEPARTMENT_LEADER_DELETED:
            case NOTIFICATIONS.PROJECTS.PHASE_LEADER_CREATED:
            case NOTIFICATIONS.PROJECTS.PHASE_LEADER_DELETED: {
                const actionMap: Record<string, string> = {
                    [NOTIFICATIONS.PROJECTS.CREATED]: t("created a new project"),
                    [NOTIFICATIONS.PROJECTS.DUPLICATED]: t("duplicated the project"),
                    [NOTIFICATIONS.PROJECTS.UPDATED]: t("updated the project"),
                    [NOTIFICATIONS.PROJECTS.CLOSED]: t("closed the project"),
                    [NOTIFICATIONS.PROJECTS.REOPENED]: t("reopened the project"),
                    [NOTIFICATIONS.PROJECTS.TRASHED]: t("deleted the project"),
                    [NOTIFICATIONS.PROJECTS.DELETED]: t("permanently deleted the project"),
                    [NOTIFICATIONS.PROJECTS.RESTORED]: t("restored the project"),
                    [NOTIFICATIONS.PROJECTS.STATUS_UPDATED]: t("updated the status of project"),
                    [NOTIFICATIONS.PROJECTS.LEADER_CREATED]: t("added you as the leader of project"),
                    [NOTIFICATIONS.PROJECTS.LEADER_DELETED]: t("removed you as the leader of project"),
                    [NOTIFICATIONS.PROJECTS.DEPARTMENT_LEADER_CREATED]: t("added you as department leader on the project"),
                    [NOTIFICATIONS.PROJECTS.DEPARTMENT_LEADER_DELETED]: t("removed you as department leader on the project"),
                    [NOTIFICATIONS.PROJECTS.PHASE_LEADER_CREATED]: t("added you as phase leader on the project"),
                    [NOTIFICATIONS.PROJECTS.PHASE_LEADER_DELETED]: t("removed you as phase leader on the project"),
                }

                const actionName = actionMap[notify_type] || ""
                return commonRender([senderNameEl, " ", actionName, " ", projectEl])
            }

            case NOTIFICATIONS.PROJECTS.STATUS_UPDATED_REQUEST:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("requested your approval to change the status"),
                    // eslint-disable-next-line react/jsx-key
                    <Status data={notification.data.request_project_change_status} />,
                    " ",
                    t("of project"),
                    " ",
                    projectEl,
                ], IS_UPDATE_STATUS)

            case NOTIFICATIONS.PROJECTS.ADD_DEPARTMENT:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("added a new department"),
                    " ",
                    departmentNameEl,
                    " ",
                    t("to the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.PROJECTS.FILE_UPLOADED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("uploaded file to the project", { count: fileCount }),
                    " ",
                    projectEl,
                ])

            // TASKS
            case NOTIFICATIONS.TASKS.CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("added the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.TASKS.DELETED:
                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t("has been deleted by"),
                    " ",
                    senderNameEl,
                ])

            case NOTIFICATIONS.TASKS.STARTED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("started the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                    " ",
                    t("you can update the progress")
                ])

            case NOTIFICATIONS.TASKS.COMPLETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("completed the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                    " ",
                    t("you can start your task"),
                    " ",
                    dependentTaskEl
                ])


            case NOTIFICATIONS.TASKS.DELAYED: {
                const reason = dataContent.task?.reason_delay
                    ? t("please complete it as soon as possible")
                    : t("please provide the reason for the delay")

                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                    " ",
                    t("is overdue"),
                    ", ",
                    reason,
                ])
            }

            case NOTIFICATIONS.TASKS.TRASHED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("deleted the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.TASKS.START_REMINDER:
                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                    " ",
                    t("is planned to start today"),
                ])

            case NOTIFICATIONS.TASKS.LEADER_CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("added you as task leader on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.TASKS.LEADER_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you as the leader of a task on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.TASKS.ASSIGNEE_CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("assigned you to the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.TASKS.ASSIGNEE_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you from the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.TASKS.CONSULTED_CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("added you as consulted for the task"),
                    " ",
                    taskEl,
                ])

            case NOTIFICATIONS.TASKS.RESPONSIBLE_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you as responsible from the task"),
                    " ",
                    taskEl,
                ])

            case NOTIFICATIONS.TASKS.ACCOUNTABLE_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you as accountable from the task"),
                    " ",
                    taskEl,
                ])

            case NOTIFICATIONS.TASKS.INFORMED_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you as informed from the task"),
                    " ",
                    taskEl,
                ])

            case NOTIFICATIONS.TASKS.CONSULTED_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you as consulted from the task"),
                    " ",
                    taskEl,
                ])

            case NOTIFICATIONS.TASKS.UPDATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("updated the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.TASKS.STARTED_LEADER:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("started task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                    " ",
                    t("you can follow the progress"),
                ])

            case NOTIFICATIONS.TASKS.COMPLETED_WORKER:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("completed task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.TASKS.DELAYED_LEADER:
                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t("on the project"),
                    " ",
                    projectEl,
                    " ",
                    t("is overdue. Kindly review the task"),
                    " ",
                    taskEl,
                ])

            case NOTIFICATIONS.TASKS.DELAYED_DEPEND:
                return commonRender([
                    t("task"),
                    " ",
                    dependentTaskEl,
                    " ",
                    t("cannot start on time because its dependent task is delayed. please check your notifications"),
                ])
            case NOTIFICATIONS.TASKS.REQUEST:
                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t('in project'),
                    " ",
                    projectEl,
                    " ",
                    t("has been submitted for your review"),
                ])
            case NOTIFICATIONS.TASKS.REJECTED:
                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t('in project'),
                    " ",
                    projectEl,
                    " ",
                    t('has been rejected by'),
                    " ",
                    senderNameEl,
                    " ",
                    t("please review the feedback and make the necessary updates"),
                ])
            case NOTIFICATIONS.TASKS.PROGRESS:
                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t('in project'),
                    " ",
                    projectEl,
                    " ",
                    t('has been updated status'),
                ])
            case NOTIFICATIONS.TASKS.PROGRESS_DEPEND:
                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t('has been updated'),
                    ". ",
                    t("task"),
                    " ",
                    dependentTaskEl,
                    " ",
                    t('cannot be started until task'),
                    " ",
                    taskEl,
                    " ",
                    t("is completed"),
                ])
            case NOTIFICATIONS.TASKS.REJECTED_FOLLOW:
                return commonRender([
                    t("task"),
                    " ",
                    taskEl,
                    " ",
                    t('in project'),
                    " ",
                    projectEl,
                    " ",
                    t('has been rejected by'),
                    " ",
                    senderNameEl,
                ])

            // PROJECTS GUEST
            case NOTIFICATIONS.PROJECTS.GUEST_CREATED:
            case NOTIFICATIONS.PROJECTS.DEPARTMENT_GUEST_CREATED:
            case NOTIFICATIONS.PROJECTS.PHASE_GUEST_CREATED:
            case NOTIFICATIONS.PROJECTS.TASK_GUEST_CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("added you as guest on the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.PROJECTS.GUEST_DELETED:
            case NOTIFICATIONS.PROJECTS.DEPARTMENT_GUEST_DELETED:
            case NOTIFICATIONS.PROJECTS.PHASE_GUEST_DELETED:
            case NOTIFICATIONS.PROJECTS.TASK_GUEST_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you as guest from the project"),
                    " ",
                    projectEl,
                ])


            // COMMENTS    
            case NOTIFICATIONS.COMMENTS.CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("added a new comment to the project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.COMMENTS.MENTIONED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("mentioned you in a comment on the project"),
                    " ",
                    projectEl,
                ])

            // MEETINGS    
            case NOTIFICATIONS.MEETINGS.INVITED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("invited you to join a meeting"),
                ])

            case NOTIFICATIONS.MEETINGS.REMOVE_INVITED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you from the meeting"),
                ])

            case NOTIFICATIONS.MEETINGS.CONFIRMED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("confirmed attendance for the meeting"),
                ])

            case NOTIFICATIONS.MEETINGS.UNCONFIRMED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("declined attendance for the meeting"),
                ])

            case NOTIFICATIONS.MEETINGS.UPDATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("updated the meeting details"),
                ])

            case NOTIFICATIONS.MEETINGS.DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("canceled the meeting"),
                ])

            case NOTIFICATIONS.MEETINGS.REMIND_MEETING:
                return commonRender([
                    t("You have a scheduled meeting today"),
                ])

            case NOTIFICATIONS.MEETINGS.REMIND_MEETING_END:
                return commonRender([
                    t("reminder: the meeting is about to end"),
                ])

            // PHASES
            case NOTIFICATIONS.PHASE.CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has created a new phase"),
                    " ",
                    phaseNameEl,
                    " ",
                    t("in project department"),
                    " ",
                    departmentNameEl,
                ])

            case NOTIFICATIONS.PHASE.UPDATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has updated a phase"),
                    " ",
                    phaseNameEl,
                    " ",
                    t("in project department"),
                    " ",
                    departmentNameEl,
                ])

            case NOTIFICATIONS.PHASE.DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has deleted phase"),
                    " ",
                    phaseNameEl,
                    " ",
                    t("from project department"),
                    " ",
                    departmentNameEl,
                ])

            // DEPARTMENTS
            case NOTIFICATIONS.DEPARTMENT.UPDATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has updated department"),
                    " ",
                    departmentNameEl,
                    " ",
                    t("in project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.DEPARTMENT.DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has deleted department"),
                    " ",
                    departmentNameEl,
                    " ",
                    t("from project"),
                    " ",
                    projectEl,
                ])

            case NOTIFICATIONS.DEPARTMENT.RESTORED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has restored department"),
                    " ",
                    departmentNameEl,
                    " ",
                    t("in project"),
                    " ",
                    projectEl,
                ])

            // GROUPS
            case NOTIFICATIONS.GROUPS.LEADER_CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("added you as leader of group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.GROUPS.LEADER_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you as leader of group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.GROUPS.USER_CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("added you as user of group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.GROUPS.USER_DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("removed you as user of group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.GROUPS.UPDATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("updated a group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.GROUPS.DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has deleted group"),
                    " ",
                    groupNameEl,
                ])

            // DAILY REPORTS
            case NOTIFICATIONS.DAILY_REPORTS.CREATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has created report"),
                    " ",
                    reportNameEl,
                    " ",
                    t("in group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.DAILY_REPORTS.UPDATED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has updated report"),
                    " ",
                    reportNameEl,
                    " ",
                    t("in group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.DAILY_REPORTS.DELETED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has deleted report"),
                    " ",
                    reportNameEl,
                    " ",
                    t("in group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.DAILY_REPORTS.UPDATED_STATUS:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("has updated status of report"),
                    " ",
                    reportNameEl,
                    " ",
                    t("in group"),
                    " ",
                    groupNameEl,
                ])

            case NOTIFICATIONS.ACCOUNTS.APPROVED:
                return commonRender([
                    senderNameEl,
                    " ",
                    t("requested a new account approval"),
                ])

            // OVERTIME
            case NOTIFICATIONS.OVERTIME.CREATED:
                return commonRender([
                    t("you have an overtime report from"),
                    " ",
                    senderNameEl,
                    " ",
                    t("in group"),
                    " ",
                    groupNameEl,
                ])
            case NOTIFICATIONS.OVERTIME.APPROVED:
                return commonRender([
                    t("your overtime report for the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on project"),
                    projectEl,
                    t("from"),
                    " ",
                    startTimeEl,
                    " ",
                    t("to"),
                    " ",
                    endTimeEl,
                    " ",
                    t("has been approved")
                ])

            case NOTIFICATIONS.OVERTIME.REJECTED:
                return commonRender([
                    t("your overtime report for the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on projec"),
                    " ",
                    projectEl,
                    t("from"),
                    " ",
                    startTimeEl,
                    " ",
                    t("to"),
                    " ",
                    endTimeEl,
                    " ",
                    t("has been rejected"),
                    ". ",
                    t("please review the details")
                ])

            case NOTIFICATIONS.OVERTIME.ADMIN_UPDATED:
                return commonRender([
                    t("the overtime report for the task"),
                    " ",
                    taskEl,
                    " ",
                    t("on project"),
                    " ",
                    projectEl,
                    " ",
                    t("has been updated"),
                    " ",
                    t("please review the details")
                ])

            // LEAVE REQUEST
            case NOTIFICATIONS.LEAVE_REQUEST.CREATED:
                return commonRender([
                    t("you have a leave request from"),
                    " ",
                    senderNameEl,
                ])

            case NOTIFICATIONS.LEAVE_REQUEST.APPROVED:
                return commonRender([
                    t("your leave request for"),
                    " ",
                    leaveDateEl,
                    " ",
                    t("has been approved"),
                ])

            case NOTIFICATIONS.LEAVE_REQUEST.REJECTED:
                return commonRender([
                    t("your leave request for"),
                    " ",
                    leaveDateEl,
                    " ",
                    t("has been rejected"),
                    ". ",
                    t("please review the details"),
                ])

            case NOTIFICATIONS.LEAVE_REQUEST.ADMIN_UPDATED:
                return commonRender([
                    t("the leave request for"),
                    " ",
                    leaveDateEl,
                    " ",
                    t("has been updated"),
                    ". ",
                    t("please review the details"),
                ])

            case NOTIFICATIONS.WORK_TIME.INCORRECT:
                return commonRender([
                    t("your work time report for"),
                    " ",
                    workDateEl,
                    " ",
                    t("is incorrect"),
                    ". ",
                    t("please review and update it immediately"),
                ])

            default:
                return <TextComponent text="you have a new notification" />
        }
    }

    const { mutate: markAsRead, isPending: isMarkingAsRead } = useMutation({
        mutationFn: () => notificationApi.markAsRead(notification.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.IMPORTANT] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
        },
    })

    const handleClick = () => {
        if (NOTIFICATIONS.PROJECTS.STATUS_UPDATED_REQUEST !== notify_type)
            markAsRead()

        if (
            [
                NOTIFICATIONS.SYSTEM.CREATED,
                NOTIFICATIONS.PROJECTS.TRASHED,
                NOTIFICATIONS.PROJECTS.DELETED,
                NOTIFICATIONS.PROJECTS.LEADER_DELETED,
                NOTIFICATIONS.TASKS.LEADER_DELETED,
                NOTIFICATIONS.TASKS.ASSIGNEE_DELETED,
                NOTIFICATIONS.PHASE.DELETED,
                NOTIFICATIONS.DEPARTMENT.DELETED,
            ].includes(notify_type)
        )
            return

        if ([NOTIFICATIONS.ACCOUNTS.APPROVED].includes(notify_type)) {
            router.push('/my-approvals')
            return
        }

        if (NOTIFICATIONS.PROJECTS.FILE_UPLOADED === notify_type) {
            return
        }

        if (
            [
                NOTIFICATIONS.TASKS.COMPLETED,
                NOTIFICATIONS.TASKS.DELAYED_DEPEND,
                NOTIFICATIONS.TASKS.REJECTED,
                NOTIFICATIONS.TASKS.CREATED,
                NOTIFICATIONS.TASKS.STARTED,
                NOTIFICATIONS.TASKS.DELAYED,
                NOTIFICATIONS.TASKS.TRASHED,
                NOTIFICATIONS.TASKS.START_REMINDER,
                NOTIFICATIONS.TASKS.UPDATED,
                NOTIFICATIONS.TASKS.STARTED_LEADER,
                NOTIFICATIONS.TASKS.COMPLETED_WORKER,
                NOTIFICATIONS.TASKS.DELAYED_LEADER,
                NOTIFICATIONS.TASKS.RESPONSIBLE_CREATED,
                NOTIFICATIONS.TASKS.ACCOUNTABLE_CREATED,
                NOTIFICATIONS.TASKS.CONSULTED_CREATED,
                NOTIFICATIONS.TASKS.INFORMED_CREATED,
            ].includes(notify_type)
        ) {
            const currentPhaseId = dataContent.task?.phase.id
            if (currentPhaseId) {
                router.push({
                    pathname: '/phases/[id]',
                    params: { id: currentPhaseId.toString() },
                })
            }
        }

        if (
            [
                NOTIFICATIONS.MEETINGS.INVITED,
                NOTIFICATIONS.MEETINGS.CONFIRMED,
                NOTIFICATIONS.MEETINGS.UNCONFIRMED,
                NOTIFICATIONS.MEETINGS.UPDATED,
                NOTIFICATIONS.MEETINGS.DELETED,
                NOTIFICATIONS.MEETINGS.REMIND_MEETING,
                NOTIFICATIONS.MEETINGS.REMIND_MEETING_END,
            ].includes(notify_type)
        ) {
            const meetingId = dataContent.meeting?.id
            const meetingName = dataContent.meeting?.title
            if (meetingId) {
                router.push({
                    pathname: '/meetings/[id]',
                    params: {
                        id: meetingId.toString(),
                        name: meetingName || ''
                    },
                })
            }
        }

        if (
            [
                NOTIFICATIONS.COMMENTS.CREATED,
                NOTIFICATIONS.COMMENTS.MENTIONED,
            ].includes(notify_type)
        ) {
            const contentClass = dataContent.comment?.content_class
            const contentObject = dataContent.comment?.content_object
            const project = dataContent.project
            let objectId: number | undefined = undefined
            let currentPhaseId: number | undefined = undefined
            let departmentId: number | undefined = undefined

            switch (contentClass) {
                case "projectdepartment":
                    objectId = (contentObject as DepartmentDetails).project_department_id
                    currentPhaseId = objectId
                    router.replace({
                        pathname: '/project',
                        params: {
                            objectId: objectId.toString(),
                            contentClass: 'projectdepartment'
                        },
                    })
                    setActionName('projectStore', {
                        id: project?.id?.toString() || '',
                        name: project?.name || '',
                    })
                    return

                case "phase":
                    objectId = (contentObject as PhaseDetails).id
                    departmentId = (contentObject as { project_department: ProjectDepartment } & PhaseDetails).project_department.id
                    currentPhaseId = objectId
                    router.replace({
                        pathname: '/project',
                        params: {
                            objectId: objectId.toString(),
                            contentClass: 'phase',
                            departmentId: departmentId.toString(),
                        },
                    })
                    setActionName('projectStore', {
                        id: project?.id?.toString() || '',
                        name: project?.name || '',
                    })
                    return

                case "task":
                    objectId = (contentObject as TaskDetails).id
                    currentPhaseId = (
                        contentObject as TaskDetails & { phase: { id: number } }
                    ).phase.id
                    router.replace({
                        pathname: '/phases/[id]',
                        params: {
                            id: currentPhaseId.toString(),
                            task_id: objectId.toString(),
                        },
                    })
                    return

                default:
                    break
            }
        }

        if (
            [
                NOTIFICATIONS.TASKS.RESPONSIBLE_DELETED,
                NOTIFICATIONS.TASKS.ACCOUNTABLE_DELETED,
                NOTIFICATIONS.TASKS.CONSULTED_DELETED,
                NOTIFICATIONS.TASKS.INFORMED_DELETED,
                NOTIFICATIONS.TASKS.DELETED,
            ].includes(notify_type)
        ) {
            return
        }

        if (
            [
                NOTIFICATIONS.MEETINGS.DELETED,
                NOTIFICATIONS.MEETINGS.REMOVE_INVITED,
            ].includes(notify_type)
        ) {
            return
        }
        if (
            [
                NOTIFICATIONS.GROUPS.DELETED,
                NOTIFICATIONS.DAILY_REPORTS.DELETED,
            ].includes(notify_type)
        ) {
            return
        }

        if (
            [
                NOTIFICATIONS.DAILY_REPORTS.CREATED,
                NOTIFICATIONS.DAILY_REPORTS.UPDATED,
                NOTIFICATIONS.DAILY_REPORTS.UPDATED_STATUS,
            ].includes(notify_type)
        ) {
            return
        }
        if (
            [
                NOTIFICATIONS.GROUPS.LEADER_CREATED,
                NOTIFICATIONS.GROUPS.LEADER_DELETED,
                NOTIFICATIONS.GROUPS.USER_CREATED,
                NOTIFICATIONS.GROUPS.USER_DELETED,
                NOTIFICATIONS.GROUPS.UPDATED,
            ].includes(notify_type)
        ) {
            return
        }
    }

    return (
        <RowComponent
            justify="space-between"
            disabled={isMarkingAsRead}
            onPress={handleClick}
        >
            <RowComponent gap={10} style={{ flexShrink: 1 }}>
                {renderIcon()}
                <View>
                    <Content />
                    <TextComponent
                        text={formatDistance(created)}
                        type="caption"
                        size={9}
                    />
                </View>
            </RowComponent>
            {!notification.is_read &&
                (isMarkingAsRead ?
                    <ActivityIndicator size="small" color="#7F64F4" />
                    :
                    <View style={{
                        width: 7,
                        height: 7,
                        backgroundColor: '#7F64F4',
                        borderRadius: 7
                    }} />
                )
            }
        </RowComponent>
    )
}