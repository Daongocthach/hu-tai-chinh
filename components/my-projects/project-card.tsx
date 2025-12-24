import { format } from 'date-fns'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import IconLabel from '@/components/common/icon-label'
import Members from '@/components/common/members'
import ProgressBar from '@/components/common/progress-bar'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import { useTheme } from '@/hooks'
import { getDistinctUsers, PROJECT_PRIORITIES_MAP, PROJECT_STATUS_MAP, ProjectDetails } from '@/lib'
import useStore from '@/store'

export default function ProjectCard(project: ProjectDetails) {
    const { setActionName } = useStore()
    const router = useRouter()
    const { t } = useTranslation()
    const { colors } = useTheme()


    if (!project) return null

    const {
        id,
        name,
        priority,
        status,
        date_start,
        date_end,
        total_delay_tasks,
        departments,
        leaders,
        completion_percent,
        customer
    } = project

    const progress = completion_percent / 100
    const handleRouting = () => {
        router.push('/project')
        setActionName('projectStore', {
            id: id?.toString(),
            name: name,
        })
    }

    const departmentLeaders = getDistinctUsers(
        departments.flatMap((department) => department.leaders),
    )

    return (
        <CardContainer onPress={handleRouting}>
            <ColumnComponent gap={15}>
                <RowComponent justify='space-between'>
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
                    <RowComponent gap={15}>
                        {total_delay_tasks !== undefined && total_delay_tasks !== null && (
                            <ButtonComponent
                                iconProps={{ name: 'ClockAlert', size: 14, color: 'error' }}
                                textProps={{
                                    text: String(total_delay_tasks),
                                    size: 12,
                                    color: 'error'
                                }}
                                isIconOnly
                            />
                        )}
                        {project?.departments?.length && (
                            <ButtonComponent
                                iconProps={{ name: 'Bolt', size: 14, color: 'primary' }}
                                textProps={{
                                    text: String(project.departments.length),
                                    size: 12,
                                    color: 'primary'
                                }}
                                isIconOnly
                            />
                        )}
                    </RowComponent>
                </RowComponent>
                <ColumnComponent gap={5}>
                    <TextComponent
                        text={name}
                        type="title1"
                    />
                    <RowComponent gap={10} wrap>
                        <TextComponent
                            text={t('from') + ': ' + format(date_start, 'MM-dd-yyyy')}
                            type='label'
                        />
                        <TextComponent
                            text={t('to') + ': ' + format(date_end, 'MM-dd-yyyy')}
                            type='label'
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

                    {customer?.name &&
                        <IconLabel
                            label={customer.name}
                            iconProps={{
                                name: "FileUser",
                                color: "primary",
                                size: 14,
                            }}
                            textProps={{
                                type: 'label',
                                size: 12,
                            }}
                        />
                    }
                </RowComponent>
                <ColumnComponent gap={5}>
                    <TextComponent
                        text={t('progress') + ' (' + project?.completion_percent + '%' + ')'}
                        size={12}
                        fontWeight='medium'
                    />
                    <ProgressBar
                        progressColor={
                            progress > 0.8
                                ? colors.success
                                : progress > 0.5
                                    ? colors.primary
                                    : progress >= 0.1
                                        ? colors.warning
                                        : colors.error
                        }
                        progress={progress}
                        backgroundColor={colors.cardVariant}
                    />
                </ColumnComponent>
            </ColumnComponent>
        </CardContainer>
    )
}
