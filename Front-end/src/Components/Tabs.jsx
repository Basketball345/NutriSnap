import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Dimensions } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import ImageStack from './ImageStack'
import LabelStack from './LabelStack'
import HomeStack from './HomeStack'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createBottomTabNavigator() 

const Tabs = ({user}) => {
    return (
        <Tab.Navigator 
        screenOptions={{
            tabBarActiveTintColor: 'black', 
            tabBarInactiveTintColor: 'grey',
            headerStyle: {
                backgroundColor: 'black'
            },
            tabBarStyle: {
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 5,
                shadowOpacity: 1.0,
                height: windowHeight*0.1,
                marginBottom:-windowHeight*0.04,
                backgroundColor: 'white'
            }
        }}>
            <Tab.Screen name = {'Home'} component = {HomeStack} initialParams={{user: user}} options = {{headerShown: false, tabBarIcon: ({ focused }) => 
                <FontAwesome name="home" size={34} color={focused ? 'black' : 'grey'}/>}}/>
            <Tab.Screen name = {'Food'} component = {ImageStack} initialParams={{user: user}} options = {{headerShown: false, tabBarIcon: ({ focused }) => 
                <FontAwesome6 name="bowl-food" size={28} color={focused ? 'black' : 'grey'} />}}/>
            <Tab.Screen name = {'Label'} component = {LabelStack} initialParams={{user: user}} options = {{headerShown: false,tabBarIcon: ({ focused }) => 
                <Entypo name="magnifying-glass" size={30} color={focused ? 'black' : 'grey'} />}}/>     
        </Tab.Navigator>
    )
}

export default Tabs