import TextComponent from '@/components/common/text-component'
import { User } from '@/lib'
import { useMemo } from 'react'

export default function HighlightTaggedWords({
    comment,
    users,
}: {
    comment: string
    users: User[]
}) {
    const safeComment = comment || ""

    const userNames = users
        .map((u) => u.full_name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")

    const legacyRegex = new RegExp(`@(${userNames}|All)`, "gi")

    const newMentionRegex = /\{@\}\[([^\]]+)\]\(([^)]+)\)/g

    const combinedRegex = new RegExp(
        `${newMentionRegex.source}|${legacyRegex.source}`,
        "gi"
    )

    const parts = useMemo(() => {
        const result: { type: "text" | "mention"; value: string }[] = []
        let lastIndex = 0

        safeComment.replace(
            combinedRegex,
            (match, name1, id1, legacyName, offset) => {
                if (offset > lastIndex) {
                    result.push({
                        type: "text",
                        value: safeComment.substring(lastIndex, offset),
                    })
                }

                if (name1) {
                    result.push({
                        type: "mention",
                        value: `@${name1}`,
                    })
                }
                else if (legacyName) {
                    result.push({
                        type: "mention",
                        value: `@${legacyName}`,
                    })
                }

                lastIndex = offset + match.length
                return match
            }
        )

        if (lastIndex < safeComment.length) {
            result.push({
                type: "text",
                value: safeComment.substring(lastIndex),
            })
        }

        return result
    }, [combinedRegex, safeComment])

    return (
        <TextComponent type="body">
            {parts.map((part, index) =>
                part.type === "mention" ? (
                    <TextComponent key={index} color="primary" fontWeight="bold">
                        {part.value}
                    </TextComponent>
                ) : (
                    <TextComponent key={index}>
                        {part.value}
                    </TextComponent>
                )
            )}
        </TextComponent>
    )
}
