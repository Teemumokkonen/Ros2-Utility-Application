import { useEffect } from 'react';
import { useRos } from './RosContext';
import ROSLIB from 'roslib';
import { useState } from 'react';
import { View } from 'lucide-react-native';
import OccupancyGridCanvas from './OccypancyGridCanva';
import { SafeAreaView } from 'react-native-safe-area-context';

const MapSubscriber = () => {
    const { ros } = useRos();
    const [topic] = useState('map');
    const [grid, setGrid] = useState(null);


    useEffect(() => {
        if (!ros || !ros.isConnected) {
            console.log('Ros not connected');
            return;
        }

        const mapTopic = new ROSLIB.Topic({
            ros,
            name: topic,
            messageType: 'nav_msgs/OccupancyGrid',
            queue_size: 1,
        });

        const onMessage = (message) => {
            console.log(message.info.width)
            console.log(message.info.height)
            setGrid({
                width: message.info.width,
                height: message.info.height,
                data: message.data
            });
        };

        mapTopic.subscribe(onMessage);

        return () => {
            mapTopic.unsubscribe();
        };
    }, [ros, topic]);

    return (
        <SafeAreaView>
            <OccupancyGridCanvas grid={grid}></OccupancyGridCanvas>
        </SafeAreaView>
    );

};

export default MapSubscriber;