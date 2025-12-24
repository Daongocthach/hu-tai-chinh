import ColumnComponent from "@/components/common/column-component"
import IconComponent from "@/components/common/icon-component"
import RowComponent from "@/components/common/row-component"
import TextComponent from "@/components/common/text-component"
import { Differences } from "@/lib"
import { Minus } from "lucide-react-native"
import moment from "moment"
import React from "react"
import { useTranslation } from "react-i18next"
import { View } from "react-native"

export default function DifferencesRenderer({ differences }: { differences: Differences }) {
    const { t } = useTranslation()

    const renderValue = (value: string | number | boolean | null) => {
        if (value === null) return <Minus size={16} color="#999" />

        if (typeof value === "boolean") return value ? "Yes" : "No"

        if (typeof value === "number") return value.toString()

        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
            return moment(value).format("YYYY-MM-DD HH:mm:ss")
        }

        const statusMap: Record<string, string> = {
            Completed: t("completed"),
            "In Progress": t("in progress"),
            Closed: t("closed"),
            "Not Started": t("not started"),
            Pending: t("pending"),
            Internal: t("internal"),
            Approved: t("approved"),
            Rejected: t("rejected"),
        }

        return statusMap[value] || value
    }

    const getFieldLabel = (key: string) => {
        const labels: Record<string, string> = {
            name: t("name"),
            date_start: t("date start"),
            date_end: t("date end"),
            status: t("status"),
            priority: t("priority"),
            manager: t("manager"),
            customer: t("customer"),
            actual_date_start: t("actual date start"),
            actual_date_end: t("actual date end"),
            delay_date: t("delay date"),
            task_type: t("task type"),
            is_delay: t("is delayed"),
            completion_percent: t("completion"),
            position: t("position"),
        }

        return labels[key] || key
    }

    return (
        <View>
            {Object.entries(differences).map(([key, tuple]) => {
                if (!tuple) return null
                const [oldValue, newValue] = tuple

                return (
                    <ColumnComponent key={key}>
                        <RowComponent gap={10}>
                            <IconComponent name="ChevronsRight" size={12} />
                            <TextComponent type="title2" size={13} text={getFieldLabel(key) + ': '} />
                        </RowComponent>
                        <RowComponent gap={10} style={{ marginLeft: 22, marginBottom: 8 }}>
                            <TextComponent type="caption" color='error'>
                                {renderValue(oldValue)}
                            </TextComponent>
                            <IconComponent name="MoveRight" size={12} />
                            <TextComponent type="caption" color='success'>
                                {renderValue(newValue)}
                            </TextComponent>
                        </RowComponent>
                    </ColumnComponent>
                )
            })}
        </View>
    )
}
