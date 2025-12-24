import { ImageSourcePropType, ViewProps } from "react-native"

import ImageComponent from "@/components/common/image-component"
import TextComponent from "@/components/common/text-component"
import ColumnComponent from "../common/column-component"

interface OverviewProps extends ViewProps {
    imageSource?: ImageSourcePropType
    title?: string
    caption?: string
}

export default function Overview({ imageSource, title, caption }: OverviewProps) {
    return (
        <ColumnComponent gap={10}>
            {imageSource &&
                <ImageComponent
                    source={imageSource}
                    alt="login banner"
                    style={{ width: '100%', height: 180 }}
                    resizeMode="contain"
                />
            }
            {title &&
                <TextComponent
                    text={title}
                    textAlign='center'
                    type='title'
                />
            }
            {caption &&
                <TextComponent
                    text={caption}
                    type="label"
                    textAlign='center'
                />
            }
        </ColumnComponent>
    )
}