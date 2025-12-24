import { View } from 'react-native'

import CameraCapture from '@/components/camera/camera-capture'
import CameraScan from '@/components/camera/camera-scan'
import ModalComponent from '@/components/common/modal-component'
import { FileProps, windowHeight, windowWidth } from '@/lib'

type CustomCameraModalProps =
  | {
    visible: boolean
    isScanQR: true
    onClose: () => void
    onReadCode: (code: string) => void
  }
  | {
    visible: boolean
    isScanQR?: false
    onClose: () => void
    onCapture: (file: FileProps) => void
  }

export default function CameraModal(props: CustomCameraModalProps) {
  const { visible, isScanQR, onClose } = props

  const handleResult = (result: FileProps | string) => {
    if (isScanQR) {
      props.onReadCode(result as string)
    } else {
      props.onCapture(result as FileProps)
    }
  }

  return (
    <ModalComponent visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#000", width: "100%", height: "100%", minWidth: windowWidth, minHeight: windowHeight }}>
        {isScanQR ? (
          <View style={{ flex: 1 }}>
            <CameraScan onCapture={handleResult} onClose={onClose} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <CameraCapture
              onCapture={handleResult}
              onClose={onClose}
            />
          </View>
        )}
      </View>
    </ModalComponent>
  )
}
