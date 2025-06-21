import React, { cache, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRos } from './RosContext';
import ROSLIB from 'roslib';
import FastImage from 'react-native-fast-image';
import Joystick from './JoyStick';

// Helper: Convert Uint8Array to base64 (React Native safe)
const uint8ArrayToBase64 = (bytes) => {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return global.btoa ? global.btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
};

const CameraSubComponent = () => {
  const { ros } = useRos();
  const [topic] = useState('camera/image/compressed');
  const [imageUri, setImageUri] = useState(null);
  const publisherRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!ros || !ros.isConnected) {
      console.log('ROS not connected');
      return;
    }

    const imageTopic = new ROSLIB.Topic({
      ros,
      name: topic,
      messageType: 'sensor_msgs/CompressedImage',
      queue_size: 1,
    });

    publisherRef.current = new ROSLIB.Topic({
      ros,
      name: 'cmd_vel',
      messageType: 'geometry_msgs/Twist',
      queue_size: 10,
    });

    const onMessage = (message) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < 100) return; // throttle ~10 FPS
      lastUpdateRef.current = now;

      let base64Data = null;

      if (typeof message.data === 'string') {
        base64Data = message.data;
      } else if (message.data instanceof Uint8Array || Array.isArray(message.data)) {
        const bytes = message.data instanceof Uint8Array ? message.data : new Uint8Array(message.data);
        base64Data = uint8ArrayToBase64(bytes);
      } else {
        console.warn('Unknown data type in compressed image:', typeof message.data);
        return;
      }

      setImageUri(`data:image/jpeg;base64,${base64Data}`);
    };

    imageTopic.subscribe(onMessage);

    return () => {
      imageTopic.unsubscribe();
    };
  }, [ros, topic]);

  const handleMove = ({ x, y }) => {
    if (publisherRef.current && ros?.isConnected) {
      const twist = new ROSLIB.Message({
        linear: { x: -y, y: 0.0, z: 0.0 },
        angular: { x: 0.0, y: 0.0, z: -x },
      });
      publisherRef.current.publish(twist);
    } else {
      console.log('Not connected to ROS server, no publish');
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <FastImage
          source={{ uri: imageUri, cache: FastImage.cacheControl.immutable}}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
          onError={(error) => {
            console.log('Image load error:', error);
          }}
        />
      ) : (
        <Text style={{ marginTop: 10, color: '#888' }}>Waiting for image...</Text>
      )}

      <Joystick size={150} onMove={handleMove} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 320,
    height: 240,
    borderRadius: 8,
    backgroundColor: '#000',
  },
});

export default CameraSubComponent;
