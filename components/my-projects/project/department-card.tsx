import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList } from 'react-native'

import AccordionItem from '@/components/common/accordion-item'
import CardContainer from '@/components/common/card-container'
import CircularProgressRing from '@/components/common/circle-progress'
import IconComponent from '@/components/common/icon-component'
import RowComponent from '@/components/common/row-component'

import { useTheme } from '@/hooks'
import { DepartmentDetails, PhaseDetails } from '@/lib'
import CardDetail from './card-detail'

type DepartmentCardProps = {
    department: DepartmentDetails
    isExpandedDefault?: boolean
}

export default function DepartmentCard({ department, isExpandedDefault }: DepartmentCardProps) {
    const router = useRouter()
    const { colors } = useTheme()
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (isExpandedDefault && department?.phases?.length > 0) {
            setIsExpanded(true)
        }
    }, [department?.phases?.length, isExpandedDefault])

    const {
        id,
        name,
        date_start,
        date_end,
        completion_percent,
        leaders,
        viewers,
        total_delay_tasks,
        num_comments,
        phases
    } = department

    if (!id) {
        return null
    }


    const handleRoutingPhase = (phaseId: number, phaseName: string) => {
        router.push({
            pathname: '/phases/[id]',
            params: { id: phaseId, name: phaseName }
        })
    }

    return (
        <CardContainer style={{ backgroundColor: colors.cardVariant }}>
            <RowComponent
                justify='space-between'
                gap={10}
                onPress={() => department?.phases?.length > 0 ? setIsExpanded(!isExpanded) : undefined}
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
                        id={department.project_department_id}
                        name={name}
                        completionPercent={completion_percent}
                        dateStart={date_start}
                        dateEnd={date_end}
                        leaders={leaders}
                        totalDelayTasks={total_delay_tasks}
                        numComments={num_comments}
                        titleSize={16}
                        contentClass="projectdepartment"
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
                    data={phases}
                    keyExtractor={(item) => item.id.toString()}

                    renderItem={({ item }: { item: PhaseDetails }) => (
                        <RowComponent
                            justify='space-between'
                            alignItems='center'
                            gap={10}
                            style={{
                                borderTopColor: colors.outline,
                                borderTopWidth: 1,
                                paddingVertical: 15,
                            }}
                            onPress={() => handleRoutingPhase(item.id, item.name)}
                        >
                            <RowComponent
                                alignItems='flex-start'
                                justify='flex-start'
                                gap={10}
                                style={{ flexShrink: 1 }}
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
                                    totalDelayTasks={item.total_delay_tasks}
                                    numComments={item.num_comments}
                                    titleSize={14}
                                    showTextPercent
                                    contentClass="phase"
                                    leaders={item.leaders}
                                />
                            </RowComponent>

                            <IconComponent
                                name='ChevronRight'
                                size={24}
                                color='icon'
                            />
                        </RowComponent>
                    )}
                    contentContainerStyle={{ paddingBottom: 150 }}
                    style={{ marginTop: 10 }}
                />
            </AccordionItem>
        </CardContainer>
    )
}
