import React from 'react';
import { View, StatusBar, useColorScheme, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { RosProvider } from './components/RosContext'; // JS file but imported fine in TSX
import RosConnection from './components/RosConnection'; // JS file
import DrawerItems from './constants/DrawerItems';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function createStack(Component: React.FC<any>, injectedProps = {}): React.FC<any> {
  return ({ navigation }: any) => (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <Text style={{ fontSize: 18, fontWeight: 'bold' }}>ROS2 phone application</Text>,
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
            <AntDesign name="bars" color="#000" size={30} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Connection')} style={{ marginRight: 15 }}>
            <Image source={require('./assets/avant.png')} style={{ width: 40, height: 40, resizeMode: 'contain' }} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="Screen" children={(props) => <Component {...props} {...injectedProps} />} />
    </Stack.Navigator>
  );
}

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#fff',
  };

  return (

    <RosProvider>
      <View style={[backgroundStyle, { flex: 1 }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              headerShown: false,
              drawerActiveTintColor: '#e91e63',
              drawerItemStyle: { marginVertical: 10 },
            }}
          >
            <Drawer.Screen
              key={0}
              name="Connection"
              component={createStack(RosConnection)}
              options={{
                drawerIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="connection" color={color} size={size} />
                ),
                title: 'Connection',
              }}
            />
            {DrawerItems.map((drawer, index) => (
              <Drawer.Screen
                key={index}
                name={drawer.name}
                component={createStack(drawer.component)}
                options={{
                  drawerIcon: drawer.icon,
                  title: drawer.name,
                }}
              />
            ))}
          </Drawer.Navigator>
        </NavigationContainer>
      </View>
    </RosProvider>
  );
};


export default App;
