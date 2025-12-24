import { Image, ImageProps, StyleProp } from 'react-native'

import IMAGES from '@/assets/images'
import ColumnComponent from '@/components/common/column-component'
import MenuComponent from '@/components/common/menu-component'
import { useTheme } from '@/hooks'
import { COMPANIES } from '@/lib'
import useStore from '@/store'
import LinearTextComponent from '../common/linear-text-component'
import RowComponent from '../common/row-component'
import TextComponent from '../common/text-component'


interface Props {
    styles?: StyleProp<ImageProps>
    size?: number
    pathName?: string
    disabled?: boolean
}

export default function ChangeCompanyLogo(props: Props) {
    const { socketUrl, setActionName } = useStore()
    const { colors } = useTheme()
    const { styles, size = 33, disabled = false } = props

    const changeDomain = (domain: string) => {
        if (!domain) return
        setActionName("url", domain + "/api/v1/")
        setActionName("socketUrl", domain)
    }

    return (
        <MenuComponent
            disabled={disabled}
            menuChildren={() => (
                <ColumnComponent gap={15}>
                    {COMPANIES.map((company) => (
                        <RowComponent
                            gap={10}
                            alignItems='center'
                            key={company.name}
                            onPress={() => changeDomain(company?.link ?? '')}
                        >
                            <Image
                                source={company.logo}
                                alt={company.name}
                                style={{ width: 25, height: 25 }}
                                resizeMode="contain"
                            />
                            <TextComponent
                                text={company.name}
                                type='caption'
                                color={
                                    socketUrl === company.link
                                        ? "#68cfe4"
                                        : colors.onCardVariant
                                }
                            />
                        </RowComponent>
                    ))}
                </ColumnComponent>
            )}
        >
            <RowComponent gap={5}>
                <Image
                    source={IMAGES.LOGO}
                    alt="hutaichinh logo"
                    style={[{ width: size, height: size }, styles]}
                    resizeMode="contain"
                />
                <ColumnComponent>
                    <LinearTextComponent
                        text="fine"
                        textComponentProps={{
                            type: 'title1',
                        }}
                        fontSize={14}
                        colors={['#68cfe4', '#93d5ba', '#68cfe4']}
                    />
                    <LinearTextComponent
                        text="projects "
                        textComponentProps={{
                            type: 'title1',
                            fontWeight: 'bold',
                            style: { lineHeight: 17 },
                        }}
                        fontSize={15}
                        colors={['#68cfe4', '#93d5ba', '#68cfe4']}
                    />
                </ColumnComponent>
            </RowComponent>
        </MenuComponent>
    )
}