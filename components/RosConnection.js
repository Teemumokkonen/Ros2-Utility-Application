import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import ROSLIB from 'roslib';
import { useRos } from './RosContext'; // note: named import

const RosConnection = () => {
  const [ip, setIp] = useState('192.168.100.13');
  const [port, setPort] = useState('9090');
  const [domainId, setDomainId] = useState('0');
  const [connecting, setConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const { ros, setRos } = useRos();
  const rosRef = useRef(null);

  const handleConnect = () => {
    const url = `ws://${ip}:${port}`;
    const rosInstance = new ROSLIB.Ros({ url, options: { ros_domain_id: domainId } });

    setConnecting(true);

    rosInstance.on('connection', () => {
      console.log('Connected to ROSBridge WebSocket server.');
      setConnecting(false);
      setIsConnected(true);
      setRos(rosInstance);
      rosRef.current = rosInstance;
    });

    rosInstance.on('error', (error) => {
      console.error('Error connecting:', error);
      setConnecting(false);
      Alert.alert('Connection Error', error.message);
    });

    rosInstance.on('close', () => {
      setIsConnected(false);
      setRos(null);
      rosRef.current = null;
      console.log('Connection closed.');
    });
  };

  const handleDisconnect = () => {
    if (rosRef.current) rosRef.current.close(); // triggers close event
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* your UI elements */}
        <Text style={styles.label}>ROS2 IP Address</Text>
        <TextInput style={styles.input} value={ip} onChangeText={setIp} placeholder="e.g. 192.168.1.100" />
        <Text style={styles.label}>Port</Text>
        <TextInput style={styles.input} value={port} onChangeText={setPort} keyboardType="numeric" />
        <Text style={styles.label}>Domain ID</Text>
        <TextInput style={styles.input} value={domainId} onChangeText={setDomainId} keyboardType="numeric" />
        <Button
          title={isConnected ? 'Disconnect' : connecting ? 'Connecting...' : 'Connect'}
          onPress={isConnected ? handleDisconnect : handleConnect}
          disabled={connecting}
          color={isConnected ? 'red' : 'blue'}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  label: { fontWeight: 'bold' },
});

export default RosConnection;
