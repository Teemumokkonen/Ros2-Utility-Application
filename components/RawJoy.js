import React, { useImperativeHandle, useRef, useEffect, useState, forwardRef } from 'react';
import ROSLIB from 'roslib';
import { useRos } from './RosContext';

const RawJoyComponent = forwardRef((props, ref) => {
  const { ros } = useRos();
  const publisherRef = useRef(null);
  const [axes, setAxes] = useState([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0]);
  const [buttons, setButtons] = useState(new Array(13).fill(0));

  useEffect(() => {
    if (ros) {
      publisherRef.current = new ROSLIB.Topic({
        ros,
        name: '/joy',
        messageType: 'sensor_msgs/msg/Joy',
        queue_size: 1,
      });
    }

    return () => {
      if (publisherRef.current) {
        publisherRef.current.unadvertise();
        publisherRef.current = null;
      }
    };
  }, [ros]);

  useImperativeHandle(ref, () => ({
    handleJoy: (item, slot, value) => {
      const updatedAxes = [...axes];
      const updatedButtons = Array(13).fill(0);
      if (item === 'joystick') {
        
        updatedAxes[slot.x] = -value.x;
        updatedAxes[slot.y] = -value.y;
        setAxes(updatedAxes);
        console.log("Updating joystick");
      }

      if (item === 'button') {
        updatedButtons[slot] = value;
        setButtons(updatedButtons);

      }
        publish(axes, updatedButtons);
    }
  }));

  const publish = (axesToSend, buttonsToSend) => {
    console.log("sending");
    if (publisherRef.current && ros?.isConnected) {
      const msg = new ROSLIB.Message({
        header: {
          stamp: { sec: 0, nanosec: 0 }, 
          frame_id: 'joy',
        },
        axes: axesToSend,
        buttons: buttonsToSend,
      });
      publisherRef.current.publish(msg);
    } else {
      console.warn('ROS not connected, cannot publish Joy message.');
    }
  };

  return null;
});

export default RawJoyComponent;
