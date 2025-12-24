import { User } from '@/lib'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ChipComponent from './chip-component'
import RowComponent from './row-component'
import TextComponent from './text-component'

interface MeetingUserListProps {
    label?: string
    users?: User[]
    color?: string
}

export default function UsersTagged({ label, users, color }: MeetingUserListProps) {
    const { t } = useTranslation()

    if (!Array.isArray(users) || users.length === 0) return null

    return (
        <RowComponent gap={5} wrap alignItems="center">
            {label &&
                <TextComponent
                    text={t(label) + ': '}
                    type='label'
                />
            }
            {users.map(user => (
                <ChipComponent
                    key={user?.id}
                    textProps={{ 
                        text: user?.full_name || '',
                    }}
                />
            ))}
        </RowComponent>
    )
}