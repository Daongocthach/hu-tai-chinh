import { BarcodeScanningResult, CameraView } from 'expo-camera'
import { useState } from "react"
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import IconComponent from "@/components/common/icon-component"
import { cleanBarcode } from "@/lib"

export default function CameraScan({ onCapture, onClose }: { onCapture: (value: string) => void, onClose: () => void }) {
    const [isScanned, setIsScanned] = useState(false)

    const handleReadCode = (scanningResult: BarcodeScanningResult) => {
        if (isScanned || !scanningResult?.data) return
        const code = cleanBarcode(scanningResult?.data)
        if (code) {
            setIsScanned(true)
            onCapture(code)
            onClose()
        }
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "datamatrix", "upc_a", "upc_e"],
                }}
                onBarcodeScanned={handleReadCode}
                ratio="16:9"
            />

            <View style={styles.focusFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconComponent name="X" size={28} color="white" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        position: "relative",
    },
    camera: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },
    focusFrame: {
        position: 'absolute',
        top: "50%",
        left: "10%",
        width: "80%",
        height: 155,
        transform: [{ translateY: -1 / 2 * 155 }],
        borderColor: 'transparent',
    },
    corner: {
        position: 'absolute',
        width: 35,
        height: 35,
        borderColor: 'white',
    },
    topLeft: {
        top: 0,
        left: 11,
        borderLeftWidth: 4,
        borderTopWidth: 4,
    },
    topRight: {
        top: 0,
        right: 11,
        borderRightWidth: 4,
        borderTopWidth: 4,
    },
    bottomLeft: {
        bottom: 0,
        left: 11,
        borderLeftWidth: 4,
        borderBottomWidth: 4,
    },
    bottomRight: {
        bottom: 0,
        right: 11,
        borderRightWidth: 4,
        borderBottomWidth: 4,
    },
})