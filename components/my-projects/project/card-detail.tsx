
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { showToast } from '@/alerts'
import tasksApi from '@/apis/task.api'
import ButtonComponent from '@/components/common/button-component'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import Members from '@/components/common/members'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import { CommentContentClass, QUERY_KEYS, StatusConfigMap, TASK_STATUS, User } from '@/lib'
import useStore from '@/store'

type CardDetailProps = {
    id: number
    name: string
    completionPercent: number
    dateStart: string | null
    dateEnd: string | null
    totalDelayTasks?: number
    numComments?: number
    isTask?: boolean
    status?: number
    statusMap?: StatusConfigMap
    titleSize: number
    showTextPercent?: boolean
    contentClass: CommentContentClass
    isTaskDelayed?: boolean
    totalWorkingHours?: number
    leaders?: User[]
    users?: User[]
    usersFollow?: User[]
    isProjectTask?: boolean
    handleLink?: () => void
}

export default function CardDetail({
    id,
    name,
    completionPercent,
    dateStart,
    dateEnd,
    totalDelayTasks,
    numComments,
    isTask,
    status,
    statusMap,
    titleSize = 16,
    showTextPercent,
    contentClass,
    isTaskDelayed,
    totalWorkingHours,
    leaders = [],
    users = [],
    usersFollow = [],
    isProjectTask,
    handleLink,
}: CardDetailProps) {
    const { userData } = useStore()
    const queryClient = useQueryClient()
    const router = useRouter()
    const { t } = useTranslation()

    const convertDateStart = dateStart ? format(new Date(dateStart), 'MM-dd-yyyy') : 'N/A'
    const convertDateEnd = dateEnd ? format(new Date(dateEnd), 'MM-dd-yyyy') : 'N/A'
    const isFollowed = !!usersFollow?.some(user => user.id === userData?.id)

    const { mutate: followTask, isPending: isFollowing } = useMutation({
        mutationFn: () => tasksApi.followTask(id),
        onSuccess: () => {
            showToast('update_success')
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_TASKS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] })
        },
    })

    const { mutate: unFollowTask, isPending: isUnFollowing } = useMutation({
        mutationFn: () => tasksApi.unFollowTask(id),
        onSuccess: () => {
            showToast('update_success')
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_TASKS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] })
        },
    })

    const handleRoutingComments = () => {
        router.push({
            pathname: '/comment-modal',
            params: {
                objectId: id.toString(),
                contentClass: contentClass
            }
        })
    }

    const handleRoutingOvertime = () => {
        router.push({
            pathname: '/create-edit-timesheet',
            params: {
                task_id: id.toString(),
                task_name: name
            }
        })
    }

    return (
        <ColumnComponent gap={10} style={{ flexGrow: 1, flexShrink: 1, overflow: 'hidden', paddingVertical: 2 }}>
            <RowComponent gap={10} justify='space-between'>
                {statusMap && status &&
                    <ChipComponent
                        textProps={{
                            text: statusMap?.[status]?.label,
                            color: statusMap?.[status]?.color,
                            numberOfLines: 1,
                        }}
                        rowProps={{
                            backgroundColor: statusMap?.[status]?.containerColor,
                        }}
                    />
                }
                <RowComponent gap={10}>
                    {isTaskDelayed && (
                        <ButtonComponent
                            isIconOnly
                            iconProps={{ name: 'CircleAlert', size: titleSize * 1.2, color: 'error' }}
                            textProps={{
                                text: 'overdue',
                                size: titleSize * 0.85,
                                color: 'error'
                            }}
                        />
                    )}
                    {totalWorkingHours !== undefined && totalWorkingHours !== null &&
                        <ButtonComponent
                            disabled={status !== TASK_STATUS.IN_PROGRESS}
                            iconProps={{
                                name: 'Timer',
                                size: titleSize * 1.2,
                                color: status === TASK_STATUS.IN_PROGRESS ? 'secondary' : 'icon',
                                style: { marginRight: 4 }
                            }}
                            textProps={{
                                text: t('hours') + ': ' + totalWorkingHours,
                                size: titleSize * 0.85
                            }}
                            isIconOnly
                            onPress={handleRoutingOvertime}
                        />
                    }
                </RowComponent>
            </RowComponent>
            <ColumnComponent gap={5}>
                <TextComponent
                    text={name + ' ' + (isProjectTask ? '(' + completionPercent + '%' + ')' : '')}
                    fontWeight='semibold'
                    size={titleSize}
                />
                <RowComponent gap={5} wrap alignItems='flex-start'>
                    <RowComponent>
                        <TextComponent
                            type='caption'
                            size={titleSize * 0.85}
                        >
                            {t('from') + ': '}
                        </TextComponent>
                        <TextComponent
                            type='caption'
                            size={titleSize * 0.85}
                            fontWeight='medium'
                            text={convertDateStart}
                            color='text'
                        />
                    </RowComponent>
                    <RowComponent>
                        <TextComponent
                            type='caption'
                            size={titleSize * 0.85}
                        >
                            {t('to') + ': '}
                        </TextComponent>
                        <TextComponent
                            type='caption'
                            fontWeight='medium'
                            text={convertDateEnd}
                            color='text'
                            size={titleSize * 0.85}
                        />
                    </RowComponent>
                </RowComponent>
            </ColumnComponent>

            <RowComponent gap={15}>
                {isProjectTask ? null :
                    (contentClass === 'task' && (leaders.length > 0 || users.length > 0)) ?
                        <Members
                            managers={leaders}
                            managersLabel={'leaders'}
                            members={users}
                            membersLabel={'assigned users'}
                            hideCrown
                        /> : (contentClass === 'projectdepartment' && leaders?.length > 0) ?
                            <Members
                                managers={leaders}
                                managersLabel={'leaders'}
                                maxManagersLength={3}
                                hideCrown
                            /> : (contentClass === 'phase' && leaders?.length > 0) ?
                                <Members
                                    managers={leaders}
                                    managersLabel={'members'}
                                    maxManagersLength={3}
                                    hideCrown
                                /> : null
                }
                {totalDelayTasks !== undefined && totalDelayTasks !== null && (
                    <ButtonComponent
                        iconProps={{ name: 'ClockAlert', size: titleSize * 1.2, color: 'error' }}
                        textProps={{
                            text: String(totalDelayTasks),
                            size: titleSize * 0.85,
                            color: 'error'
                        }}
                        isIconOnly
                    />
                )}
                {handleLink &&
                    <ButtonComponent
                        iconProps={{ name: 'ExternalLink', size: titleSize * 1.2 }}
                        isIconOnly
                        onPress={handleLink}
                    />
                }
                {numComments === 0 ? (
                    <ButtonComponent
                        iconProps={{ name: 'MessageSquarePlus', size: titleSize * 1.2 }}
                        isIconOnly
                        onPress={handleRoutingComments}
                    />
                ) : numComments && numComments > 0 ? (
                    <ButtonComponent
                        iconProps={{ name: 'MessagesSquare', size: titleSize * 1.2 }}
                        textProps={{ text: String(numComments), size: titleSize * 0.85 }}
                        isIconOnly
                        onPress={handleRoutingComments}
                    />
                ) : null}
                {isTask &&
                    <ButtonComponent
                        iconProps={{
                            name: 'Star',
                            size: titleSize * 1.2,
                            color: isFollowed ? 'warning' : 'icon'
                        }}
                        isIconOnly
                        onPress={() => isFollowed ? unFollowTask() : followTask()}
                        loading={isFollowing || isUnFollowing}
                    />
                }

            </RowComponent>
        </ColumnComponent>
    )
}