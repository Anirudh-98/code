import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, CameraType, useCameraPermissions } from 'expo-camera'; // Ensure correct imports
import { Ionicons } from '@expo/vector-icons';

const InfraredDetectionScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [glintDetected, setGlintDetected] = useState(false);
  const cameraRef = useRef<Camera | null>(null); // Correctly type the ref
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    if (cameraPermission) {
      setHasPermission(cameraPermission.granted);
    } else {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  const startScanning = () => {
    setIsScanning(true);
    setGlintDetected(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const detectGlint = (data: any): boolean => {
    // Placeholder for actual detection logic
    return Math.random() > 0.95; // Simulate a 5% chance of detecting a glint
  };

  const captureAndAnalyze = async () => {
    if (cameraRef.current && isScanning) {
      try {
        const frame = await cameraRef.current.takePictureAsync({ base64: true });
        const glint = detectGlint(frame.base64);
        setGlintDetected(glint);
      } catch (error) {
        console.error('Error capturing frame:', error);
      }
    }
  };

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(captureAndAnalyze, 1000);
    return () => clearInterval(interval);
  }, [isScanning]);

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera.</Text>
        <TouchableOpacity onPress={requestCameraPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={CameraType.back}>
        <View style={styles.overlay}>
          <TouchableOpacity onPress={isScanning ? stopScanning : startScanning}>
            <Ionicons name={isScanning ? 'stop-circle' : 'scan-circle'} size={32} color="white" />
          </TouchableOpacity>
          <Text>{glintDetected ? 'Glint detected!' : 'Scanning...'}</Text>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InfraredDetectionScreen;