import IconLabel from '@/components/common/icon-label'
import RowComponent, { RowComponentBaseProps } from '@/components/common/row-component'

interface RoomServicesProps {
    isWifi?: boolean
    isProjector?: boolean
    isTelevision?: boolean
    isWhiteboard?: boolean
    capacity?: number
    isOnlyIcon?: boolean
    rowProps?: RowComponentBaseProps
}

export default function RoomServices({
    isWifi = false,
    isProjector = false,
    isTelevision = false,
    isWhiteboard = false,
    isOnlyIcon = false,
    rowProps
}: RoomServicesProps) {
    const facilities: {
        condition: boolean
        iconName: "Wifi" | "Projector" | "Tv" | "Clipboard"
        label: string
    }[] = [
            { condition: isWifi, iconName: 'Wifi', label: 'wifi' },
            { condition: isProjector, iconName: 'Projector', label: 'projector' },
            { condition: isTelevision, iconName: 'Tv', label: 'tv' },
            { condition: isWhiteboard, iconName: 'Clipboard', label: 'whiteboard' }
        ]
    return (
        <RowComponent {...rowProps} gap={10} wrap>
            {facilities.map((facility) => (
                facility.condition && (
                    <IconLabel
                        key={facility.iconName}
                        iconProps={{
                            name: facility.iconName,
                            size: 16,
                            color: 'primary',
                        }}
                        textProps={{
                            color: 'primary',
                            type: 'caption',
                        }}
                        label={isOnlyIcon ? '' : facility.label}
                    />
                )
            ))}
        </RowComponent>
    )
}
