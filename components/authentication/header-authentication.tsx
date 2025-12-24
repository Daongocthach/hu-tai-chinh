import { useRouter } from "expo-router"

import ButtonComponent from "@/components/common/button-component"
import ChangeLanguageDropdown from "@/components/common/change-language-dropdown"
import RowComponent from "@/components/common/row-component"
import TextComponent from "../common/text-component"
import ChangeCompanyLogo from "./change-company-logo"

export default function HeaderAuthentication({
    isLogin,
    title
}: {
    isLogin?: boolean,
    title?: string
}) {
    const router = useRouter()

    return (
        <RowComponent justify='space-between' style={{ paddingVertical: 10 }}>
            {isLogin ?
                <ChangeCompanyLogo />
                :
                <RowComponent gap={10} style={{ flexShrink: 1 }}>
                    <ButtonComponent
                        onPress={() => router.back()}
                        iconProps={{ name: 'ChevronLeft', size: 30 }}
                        backgroundColor='primary'
                        buttonStyle={{
                            padding: 5,
                            borderRadius: 100,
                        }}
                    />

                    {title &&
                        <TextComponent
                            numberOfLines={1}
                            style={{ flexShrink: 1 }}
                            text={title}
                            type='title'
                        />
                    }
                </RowComponent>
            }
            <ChangeLanguageDropdown viewStyle={{ alignSelf: 'flex-end' }} />
        </RowComponent>
    )
}