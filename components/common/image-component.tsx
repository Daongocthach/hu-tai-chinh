import { useTheme } from "@/hooks"
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ImageProps, TouchableOpacity, View } from 'react-native'
import { default as Icon, default as IconComponent } from './icon-component'
import { useImageViewerModal } from './image-viewer-modal'
import TextComponent from './text-component'

interface ImageComponentProps extends ImageProps {
  uri?: string | null
  isShowViewer?: boolean
  isOutline?: boolean
  label?: string
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center'
}

const ImageComponent = (props: ImageComponentProps) => {
  const { ImageViewerModal, open } = useImageViewerModal()
  const { colors } = useTheme()
  const {
    uri,
    source,
    isShowViewer = false,
    isOutline = false,
    label,
    style,
    resizeMode = 'cover',
    ...rest
  } = props
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleOpenViewerModal = () => {
    if (uri) open(uri)
  }

  const getImageSource = () => {
    if (uri) return { uri }
    if (source) return source
    return undefined
  }

  useEffect(() => {
    let timer: any
    if (loading) {
      timer = setTimeout(() => {
        if (!error) {
          setLoading(false)
        }
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [loading, error])

  const handleImageError = (e: any) => {
    setLoading(false)
    setError(true)
  }

  const handleImageLoadStart = () => {
    setLoading(true)
    setError(false)
  }

  const handleImageLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleImageLoadEnd = () => {
    setLoading(false)
  }

  const ErrorPlaceholder = () => (
    <View
      style={[
        {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.card,
          borderWidth: isOutline ? 1 : 0,
          borderColor: isOutline ? colors.outlineVariant : 'transparent',
          borderRadius: 8,
        },
        style,
      ]}
    >
      <Icon name="ImageOff" size={24} color="onCardDisabled" />
      <TextComponent
        text="error image"
        color="onCardDisabled"
        textAlign="center"
        style={{ marginTop: 4, fontSize: 10 }}
      />
    </View>
  )

  return (
    <View style={[{ position: 'relative' }, style]}>
      <TouchableOpacity onPress={handleOpenViewerModal} disabled={!isShowViewer || error}>
        {error ? (
          <ErrorPlaceholder />
        ) : (
          <Image
            {...rest}
            source={getImageSource()}
            style={{
              width: '100%',
              height: '100%',
              borderWidth: isOutline ? 1 : 0,
              borderColor: isOutline ? colors.outlineVariant : 'transparent',
              borderRadius: 8,
            }}
            onLoadStart={handleImageLoadStart}
            onLoad={handleImageLoad}
            onLoadEnd={handleImageLoadEnd}
            onError={handleImageError}
            resizeMode={resizeMode}
          />
        )}
        {isShowViewer && (
          <IconComponent
            name="Expand"
            size={20}
            color="onPrimary"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: -10,
              marginTop: -10,
            }}
          />
        )}
        {loading && !error && (
          <ActivityIndicator
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: -10,
              marginTop: -10,
            }}
            size="small"
            color={colors.primary}
          />
        )}
      </TouchableOpacity>

      {label && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: 'rgba(0,0,0,0.5)',
            paddingVertical: 4,
            paddingHorizontal: 8,
          }}
        >
          <TextComponent
            color="onPrimary"
            textAlign="center"
            text={label}
            numberOfLines={1}
          />
        </View>
      )}
      <ImageViewerModal />
    </View>
  )
}

export default ImageComponent