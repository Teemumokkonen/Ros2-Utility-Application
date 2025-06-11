import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text } from 'react-native';
import { useRos } from './RosContext';
import Joystick from './JoyStick';
import ROSLIB from 'roslib';
import { StepBack } from 'lucide-react-native';

const JoyComponent = () => {
  const { ros } = useRos();
  const [topic, updateTopic] = useState("cmd_vel");
  const publisherRef = useRef(null);

  useEffect(() => {
    if (ros) {
      publisherRef.current = new ROSLIB.Topic({
        ros,
        name: topic,
        messageType: 'geometry_msgs/msg/Twist', // For ROS2 Foxy+ over rosbridge
        queue_size: 10,
      });
    }

    return () => {
      if (publisherRef.current) {
        publisherRef.current.unadvertise();
        publisherRef.current = null;
      }
    };
  }, [ros, topic]);

  const handleMove = ({ x, y }) => {
    if (publisherRef.current && ros?.isConnected) {
      const twist = new ROSLIB.Message({
        linear: { x: -y, y: 0.0, z: 0.0 },
        angular: { x: 0.0, y: 0.0, z: -x }, // turn with X axis, invert if needed
      });

      publisherRef.current.publish(twist);
    }

    else {
      console.log("Not connected to the ROS2 server, messages will not be published");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ROS2 topic name here: </Text>
      <TextInput
            style = {styles.input} 
            placeholder={topic}
            value={topic}
            onChangeText={updateTopic}
          />
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
    flex: 1,
  },
    input: {
    flex: 0,
    height: 60,
    width: 300,
    borderColor: '#aaa',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: '#000',
    fontSize: 24,
    textAlign: 'center'
  },
  preview: {
    fontSize: 14,
    color: 'gray',
  },
});

export default JoyComponent;
