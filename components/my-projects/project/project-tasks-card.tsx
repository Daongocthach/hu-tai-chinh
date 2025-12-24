import { useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList } from 'react-native'

import AccordionItem from '@/components/common/accordion-item'
import CardContainer from '@/components/common/card-container'
import CircularProgressRing from '@/components/common/circle-progress'
import IconComponent from '@/components/common/icon-component'
import RowComponent from '@/components/common/row-component'

import { useTheme } from '@/hooks'
import { ProjectTasksCardProps, TASK_STATUS_MAP, TaskDetails } from '@/lib'
import useStore from '@/store'
import CardDetail from './card-detail'


export default function ProjectTasksCard(projectTasks: ProjectTasksCardProps) {
    const { setActionName } = useStore()
    const router = useRouter()
    const { colors } = useTheme()
    const [isExpanded, setIsExpanded] = useState(false)

    const {
        id,
        name,
        date_start,
        date_end,
        completion_percent,
        total_delay_tasks,
        tasks,
    } = projectTasks

    if (!id) {
        return null
    }

    const handleRoutingProject = () => {
        router.push('/project')
        setActionName('projectStore', {
            id: id?.toString(),
            name: name,
        })
    }

    return (
        <CardContainer style={{ backgroundColor: colors.cardVariant }} gap={10}>
            <RowComponent
                justify='space-between'
                gap={10}
                onPress={() => tasks?.length > 0 ? setIsExpanded(!isExpanded) : undefined}
            >
                <RowComponent
                    alignItems='center'
                    justify='flex-start'
                    gap={10}
                    style={{ flexShrink: 1 }}
                >
                    <CircularProgressRing
                        value={completion_percent}
                        size={70}
                        strokeWidth={7}
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
                        totalDelayTasks={total_delay_tasks}
                        titleSize={14}
                        contentClass="projectdepartment"
                        handleLink={handleRoutingProject}
                    />
                </RowComponent>

                <IconComponent
                    name='ChevronRight'
                    size={24}
                    color={isExpanded ? 'primary' : 'icon'}
                    style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
                />
            </RowComponent>
            <AccordionItem isExpanded={isExpanded} viewKey={'phases'}>
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }: { item: TaskDetails }) => (
                        <RowComponent
                            alignItems='center'
                            gap={10}
                            style={{
                                borderTopColor: colors.outline,
                                borderTopWidth: 1,
                                paddingVertical: 15,
                            }}
                        >
                            <IconComponent
                                name='CornerDownRight'
                                size={16}
                                color='primary'
                                style={{ alignSelf: 'center' }}
                            />
                            <CardDetail
                                id={item.id}
                                name={item.name}
                                completionPercent={item.completion_percent}
                                dateStart={item.date_start}
                                dateEnd={item.date_end}
                                titleSize={13}
                                numComments={item.num_comments}
                                status={item.status}
                                statusMap={TASK_STATUS_MAP}
                                isTask
                                showTextPercent
                                contentClass="task"
                                handleLink={handleRoutingProject}
                                isTaskDelayed={item.delay}
                                totalWorkingHours={item.total_times}
                                users={item.users}
                                usersFollow={item.user_follow}
                                isProjectTask
                            />
                        </RowComponent>
                    )}
                    contentContainerStyle={{ paddingBottom: 150 }}
                />
            </AccordionItem>
        </CardContainer>
    )
}
