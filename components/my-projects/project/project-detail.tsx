import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import CircularProgressRing from '@/components/common/circle-progress'
import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'

import IconLabel from '@/components/common/icon-label'
import Members from '@/components/common/members'
import { useTheme } from '@/hooks'
import { getDistinctUsers, Project, PROJECT_PRIORITIES_MAP, PROJECT_STATUS_MAP } from '@/lib'
import useStore from '@/store'
import { useRouter } from 'expo-router'

export default function ProjectDetail({ project, isRecent }: { project: Project, isRecent?: boolean }) {
    const { setActionName } = useStore()
    const router = useRouter()
    const { t } = useTranslation()
    const { colors } = useTheme()

    if (!project) return null

    const {
        name = '',
        date_start = '',
        date_end = '',
        status = '',
        completion_percent = 0,
        priority = '',
        leaders = [],
        departments = [],
        customer,
        total_delay_tasks,
    } = project

    const handleRouting = () => {
        router.push('/project')
        setActionName('projectStore', {
            id: project?.id?.toString(),
            name: project?.name,
        })
    }

    const departmentLeaders = getDistinctUsers(
        departments.flatMap((department) => department.leaders),
    )

    return (
        <CardContainer style={{ backgroundColor: colors.primary }} onPress={isRecent ? handleRouting : undefined}>
            <RowComponent gap={15}>
                <CircularProgressRing
                    value={completion_percent}
                    size={90}
                    strokeWidth={8}
                />
                <ColumnComponent gap={15} style={{ flex: 1 }}>
                    <RowComponent justify='space-between' gap={10} wrap>
                        <RowComponent gap={5}>
                            <ChipComponent
                                textProps={{
                                    text: PROJECT_STATUS_MAP?.[status]?.label,
                                    color: PROJECT_STATUS_MAP?.[status]?.color,
                                    numberOfLines: 1,
                                }}
                                rowProps={{
                                    backgroundColor: PROJECT_STATUS_MAP?.[status]?.containerColor,
                                }}
                            />
                            <ChipComponent
                                textProps={{
                                    text: PROJECT_PRIORITIES_MAP?.[priority]?.label,
                                    color: PROJECT_PRIORITIES_MAP?.[priority]?.color,
                                    numberOfLines: 1,
                                }}
                                rowProps={{
                                    backgroundColor: PROJECT_PRIORITIES_MAP?.[priority]?.containerColor,
                                }}
                            />
                        </RowComponent>
                        {customer?.name &&
                            <TextComponent
                                text={customer.name}
                                type='label'
                                color='onPrimary'
                            />
                        }
                    </RowComponent>

                    <ColumnComponent gap={5}>
                        <TextComponent
                            text={name}
                            type="title1"
                            color='onPrimary'
                        />

                        <RowComponent gap={10}>
                            <TextComponent
                                text={t('from') + ': ' + format(new Date(date_start), 'MM-dd-yyyy')}
                                color='onPrimary'
                                type='caption'
                                fontWeight='medium'
                            />
                            <TextComponent
                                text={t('to') + ': ' + format(new Date(date_end), 'MM-dd-yyyy')}
                                color='onPrimary'
                                type='caption'
                                fontWeight='medium'
                            />
                        </RowComponent>
                    </ColumnComponent>

                    <RowComponent justify='space-between'>
                        <Members
                            managers={leaders}
                            members={departmentLeaders}
                            maxManagersLength={3}
                            maxMembersLength={2}
                        />
                        <ColumnComponent gap={10}>
                            {total_delay_tasks !== undefined && total_delay_tasks !== null && (
                                <IconLabel
                                    label={total_delay_tasks.toString()}
                                    iconProps={{
                                        name: "ClockAlert",
                                        color: "onPrimary",
                                        size: 14,
                                    }}
                                    textProps={{
                                        type: 'label',
                                        color: 'onPrimary',
                                        size: 12,
                                    }}
                                />
                            )}
                            {project?.departments?.length && (
                                <IconLabel
                                    label={project.departments.length.toString()}
                                    iconProps={{
                                        name: "Bolt",
                                        color: "onPrimary",
                                        size: 14,
                                    }}
                                    textProps={{
                                        type: 'label',
                                        color: 'onPrimary',
                                        size: 12,
                                    }}
                                />
                            )}
                        </ColumnComponent>

                    </RowComponent>
                </ColumnComponent>


            </RowComponent>
        </CardContainer>
    )
}
