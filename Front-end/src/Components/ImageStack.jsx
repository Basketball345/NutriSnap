import { createStackNavigator } from '@react-navigation/stack';
import Image from '../Screens/Image';
import ImageAnalysis from '../Screens/ImageAnalysis';
import { User } from "firebase/auth";

const Stack = createStackNavigator()

const ImageStack = ({route}) => {
    const {user} = route.params
    
    return (
        <Stack.Navigator initialRouteName='Image'>
            <Stack.Screen name = "Image" initialParams={{ user }} component ={Image} options={{headerShown: false}}/>
            <Stack.Screen name = "ImageAnalysis" component = {ImageAnalysis} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default ImageStack