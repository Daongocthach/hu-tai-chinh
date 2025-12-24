
import CardContainer from '@/components/common/card-container'
import RowComponent from '@/components/common/row-component'

import LabelContent from '@/components/common/label-content'
import TextComponent from '@/components/common/text-component'
import UserDetail from '@/components/common/user-detail'
import { useLocale } from '@/hooks/use-locale'
import { PROJECT_HISTORY_MAP, ProjectHistory } from '@/lib'
import DifferencesRenderer from './differences-renderer'

export default function HistoryCard(history: ProjectHistory) {
    const { formatDistance } = useLocale()
    const {
        history_date,
        history_type,
        history_user,
        class_name,
        history_object,
        history_change_reason,
        id,
        differences,
    } = history

    if (!history) return null

    return (
        <CardContainer gap={10}>
            <RowComponent gap={5} justify='space-between'>
                {history_user && <UserDetail user={history_user} />}
                <TextComponent
                    text={formatDistance(history_date)}
                    type='caption'
                    size={10}
                />
            </RowComponent>
            <LabelContent
                labelProps={{ text: PROJECT_HISTORY_MAP[history_type]?.label }}
                contentProps={{ text: class_name + history_object.name }}
            />
            <DifferencesRenderer differences={differences} />
        </CardContainer>
    )
}
