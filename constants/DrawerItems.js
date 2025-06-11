import JoyComponent from '../components/Joy'
import Icon from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import DashboardBuilder from '../components/DashBoardBuild'

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
        name:'Map',
        component: JoyComponent,
        icon: ({ color, size }) => (
            <Entypo name="map" color={color} size={size} />
          ),
    },
 ]