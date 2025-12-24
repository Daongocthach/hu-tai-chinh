import { View, ViewProps, } from 'react-native'

import { useGetColorByKey } from '@/hooks/use-get-color-by-key'
import { ThemeColorKeys } from '@/lib'
import RowComponent from './row-component'
import TextComponent, { TextComponentProps } from './text-component'

interface ChipStatusProps extends ViewProps {
    size?: number
    statusColor?: ThemeColorKeys
    textProps?: TextComponentProps
}

export default function ChipStatus(props: ChipStatusProps) {
    const { size, statusColor, textProps } = props
    const { getColorByKey } = useGetColorByKey()
    
    return (
        <RowComponent alignItems='center' gap={5}>
            <View
                style={{
                    width: size || 8,
                    height: size || 8,
                    borderRadius: (size || 8) / 2,
                    backgroundColor: getColorByKey(statusColor),
                }}
            />
            <TextComponent
                {...textProps}
            />
        </RowComponent>
    )
}