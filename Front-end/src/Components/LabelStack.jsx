import { createStackNavigator } from '@react-navigation/stack';
import Label from '../Screens/Label';
import LabelAnalysis from '../Screens/LabelAnalysis';
import LabelInput from '../Screens/LabelInput'
import { User } from "firebase/auth";

Stack = createStackNavigator()

const LabelStack = ({route}) => {
    const { user } = route.params
    return (
        <Stack.Navigator initialRouteName='Label'>
            <Stack.Screen name = "Label" initialParams={{ user }} component ={Label} options={{headerShown: false}}/>
            <Stack.Screen name = "LabelInput" component = {LabelInput} options = {{headerShown: false}}/>
            <Stack.Screen name = "LabelAnalysis" component = {LabelAnalysis} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default LabelStack