
import CardContainer from '@/components/common/card-container'
import CircularProgressRing from '@/components/common/circle-progress'
import RowComponent from '@/components/common/row-component'

import { useTheme } from '@/hooks'
import { TASK_STATUS_MAP, TaskDetails } from '@/lib'
import CardDetail from './card-detail'

export default function TaskCard(task: TaskDetails) {
    const { colors } = useTheme()


    if (!task.id) {
        return null
    }

    const {
        id,
        name,
        date_start,
        date_end,
        completion_percent,
        users,
        num_comments,
        status,
        delay,
        leaders,
        user_follow,
    } = task

    return (
        <CardContainer style={{ backgroundColor: colors.cardVariant }} gap={10}>
            <RowComponent
                alignItems='center'
                justify='flex-start'
                gap={10}
                style={{ flexShrink: 1 }}
            >
                <CircularProgressRing
                    value={completion_percent}
                    size={60}
                    strokeWidth={6}
                    isTask
                    strokeColor={colors.outlineVariant}
                    textColor={colors.onBackground}
                    hideCaption
                />
                <CardDetail
                    id={id}
                    name={name}
                    completionPercent={completion_percent}
                    dateStart={date_start}
                    dateEnd={date_end}
                    titleSize={14}
                    numComments={num_comments}
                    status={status}
                    statusMap={TASK_STATUS_MAP}
                    isTask
                    showTextPercent
                    contentClass="task"
                    isTaskDelayed={delay}
                    users={users}
                    leaders={leaders}
                    usersFollow={user_follow}
                />
            </RowComponent>
        </CardContainer>
    )
}
