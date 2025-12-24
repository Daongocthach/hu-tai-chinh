
import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import RowComponent from '@/components/common/row-component'

import UserDetail from '@/components/common/user-detail'
import { PROJECT_PERMISSION_LEVEL_MAP, ProjectMember } from '@/lib'

export default function MemberCard(member: ProjectMember) {
    const { position } = member
    if (!position) return null

    return (
        <CardContainer>
            <RowComponent gap={5} justify='space-between'>
                <UserDetail user={member} />
                {position &&
                    <ChipComponent
                        textProps={{
                            text: PROJECT_PERMISSION_LEVEL_MAP?.[position]?.label,
                            color: PROJECT_PERMISSION_LEVEL_MAP?.[position]?.color,
                            numberOfLines: 1,
                        }}
                        rowProps={{
                            backgroundColor: PROJECT_PERMISSION_LEVEL_MAP?.[position]?.containerColor,
                        }}
                    />
                }
            </RowComponent>
        </CardContainer>
    )
}
