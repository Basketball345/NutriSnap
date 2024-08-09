import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home';
import { User } from "firebase/auth";

const Stack = createStackNavigator()

const HomeStack = ({route}) => {
    const { user } = route.params 
    return (
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name = "Home" initialParams={{ user }} component ={Home} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default HomeStack