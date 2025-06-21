import JoyComponent from '../components/Joy'
import Icon from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import DashboardBuilder from '../components/DashBoardBuild'
import CameraSubComponent from '../components/CameraSub'
import MapSubscriber from '../components/MapSubscriber'

export default [
    {
        name:'Dashboard builder',
        component: DashboardBuilder,
        icon: ({ color, size }) => (
            <Entypo name="game-controller" color={color} size={size} />
          ),
    },
    {
        name:'ROS2 twist Joy',
        component: JoyComponent,
        icon: ({ color, size }) => (
            <Entypo name="game-controller" color={color} size={size} />
          ),
    },
    {
        name:'ROS2 twist joy, with camera',
        component: CameraSubComponent,
        icon: ({ color, size }) => (
            <Entypo name="game-controller" color={color} size={size} />
          ),
    },
    {
        name:'Map',
        component: MapSubscriber,
        icon: ({ color, size }) => (
            <Entypo name="map" color={color} size={size} />
          ),
    },
 ]