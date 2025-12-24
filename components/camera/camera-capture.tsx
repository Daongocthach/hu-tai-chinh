import IconComponent from "@/components/common/icon-component"
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera'
import { useRef, useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { showAlert } from "@/alerts"
import { FileProps } from "@/lib"

type CameraProps = {
  onCapture: (file: FileProps) => void
  onClose: () => void
  mode?: 'photo' | 'video'
}

export default function CustomCamera({ onCapture, onClose, mode = 'photo' }: CameraProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [micPermission, requestMicPermission] = useMicrophonePermissions()
  const cameraRef = useRef<CameraView | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return

    if (mode === 'photo') {
      setIsCapturing(true)
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        })

        if (photo?.uri) {
          onCapture({ uri: photo.uri, name: 'photo.jpg', type: 'image/jpeg' })
        } else {
          showAlert("capture_image_failed")
        }
      } finally {
        setIsCapturing(false)
        onClose()
      }
    } else {
      if (!isRecording) {
        setIsRecording(true)
        setRecordTime(0)
        startTimer()
        try {
          const video = await cameraRef.current.recordAsync({ maxDuration: 300 })
          if (video?.uri) {
            onCapture({ uri: video.uri, name: 'video.mp4', type: 'video/mp4' })
          } else {
            showAlert("capture_image_failed")
          }
        } finally {
          stopTimer()
          setIsRecording(false)
          onClose()
        }
      } else {
        cameraRef.current.stopRecording()
      }
    }
  }

  if (!cameraPermission?.granted || (mode === 'video' && !micPermission?.granted)) {
    return <View style={styles.container} />
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        mode={mode === 'photo' ? 'picture' : 'video'}
        ratio="16:9"
      />

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <IconComponent name="X" size={28} color="onPrimary" />
      </TouchableOpacity>

      {isRecording && mode === 'video' && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(recordTime)}</Text>
        </View>
      )}

      <View style={styles.controlContainer}>
        {isCapturing ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <TouchableOpacity onPress={handleCapture}>
            <IconComponent
              name={
                mode === 'photo'
                  ? 'Aperture'
                  : isRecording
                    ? 'CircleStop'
                    : 'CircleDot'
              }
              size={55}
              color={mode === 'video' && isRecording ? "errorContainer" : 'onPrimary'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: "relative"
  },
  camera: {
    flex: 1,
    height: "100%",
    width: "100%"
  },
  closeButton: {
    position: 'absolute',
    top: 55,
    right: 20
  },
  controlContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
})
