import { showAlert } from '@/alerts'
import ColumnComponent from '@/components/common/column-component'
import IconComponent from '@/components/common/icon-component'
import ImageComponent from '@/components/common/image-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import { CompanyHeader } from '@/lib'
import useStore from '@/store'

type CompanyItemProps = {
    company: CompanyHeader,
    isDrawerHeader?: boolean,
}

export default function CompanyItem({
    company,
    isDrawerHeader
}: CompanyItemProps) {
    const { socketUrl, refreshToken, signOut } = useStore()

    const changeDomain = () => {
        if (!company.link) return
        showAlert("change_company", async () => {
            signOut({ refresh_token: refreshToken, company_url: company.link })
        })
    }

    return (
        <RowComponent
            justify='space-between'
            onPress={isDrawerHeader ? undefined : changeDomain}
            gap={10}
            backgroundColor={company.link === socketUrl ? "cardVariant" : "transparent"}
            style={{ padding: 8, borderRadius: 8 }}
        >
            <RowComponent gap={10} alignItems='center' style={{ flexShrink: 1 }}>
                <ImageComponent source={company.logo} style={{ width: 40, height: 40 }} />
                <ColumnComponent style={{ flexShrink: 1 }}>
                    <TextComponent
                        text={company.name}
                        type='title2'
                        fontWeight='semibold'
                        style={{ flexShrink: 1 }}
                    />
                    <TextComponent
                        text={company.description}
                        type='label'
                        fontWeight='medium'
                        style={{ flexShrink: 1 }}
                        numberOfLines={1}
                    />
                </ColumnComponent>
            </RowComponent>
            {isDrawerHeader ?
                <IconComponent name='SquareChevronRight' size={24} />
                :
                (company.link === socketUrl) ?
                    <IconComponent name='Check' size={24} color="primary" />
                    : null
            }
        </RowComponent>
    )
}
