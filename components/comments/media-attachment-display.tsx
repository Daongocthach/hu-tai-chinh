import ICONS from '@/assets/icons'
import ColumnComponent from '@/components/common/column-component'
import ImageComponent from '@/components/common/image-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import { FileDetails } from '@/lib'
import { getFileExtension } from '@/lib/utils'
import * as WebBrowser from "expo-web-browser"
import { Dimensions } from 'react-native'


const { width: windowWidth } = Dimensions.get('window')

type ComponentProps = {
    images?: FileDetails[]
    video?: FileDetails[]
    files?: FileDetails[]
}

export default function MediaAttachmentDisplay({
    images,
    video,
    files
}: ComponentProps) {
    const handleOpenFile = (file: FileDetails) => {
        WebBrowser.openBrowserAsync(file.path);
    }

    const renderImages = () => {
        if (!images || images.length === 0) return null

        return images.map((image, index) => {
            return (
                <ImageComponent
                    key={index}
                    isShowViewer
                    uri={image.path}
                    style={{
                        width: windowWidth * 0.3,
                        height: 100,
                    }}
                    resizeMode="contain"
                />
            )
        })
    }

    const renderFiles = () => {
        if (!files || files.length === 0) return null

        return (
            <ColumnComponent>
                {files.map((file, index) => {
                    const extension = getFileExtension(file.name)
                    const iconSource = ICONS[extension.toUpperCase() as keyof typeof ICONS] || ICONS.UNKNOWN

                    return (
                        <RowComponent
                            onPress={() => handleOpenFile(file)}
                            key={index}
                            style={{ flexShrink: 1 }}
                            gap={8}
                        >
                            <ImageComponent
                                source={iconSource}
                                style={{ width: 20, height: 20 }}
                                resizeMode="contain"
                            />
                            <TextComponent
                                text={file.name}
                                numberOfLines={1}
                                type='body'
                                fontWeight='medium'
                                style={{ flexShrink: 1 }}
                                ellipsizeMode='middle'
                            />
                        </RowComponent>
                    )
                })}
            </ColumnComponent>
        )
    }

    return (
        <ColumnComponent gap={8}>
            {renderImages()}
            {renderFiles()}
        </ColumnComponent>
    )
}