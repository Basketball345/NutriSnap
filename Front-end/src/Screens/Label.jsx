import { StyleSheet, Text, View, SafeAreaView, Pressable } from 'react-native'
import { useEffect, useRef, useState } from "react"
import { Camera, CameraView } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator';


const Label = ({route, navigation}) => {
    let cameraRef= useRef(null); 
    const[hasCameraPermission, setHasCameraPermissions] = useState(null);
    const { user } = route.params 

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermissions(cameraPermission.status == 'granted')
        })();
    }, [])

    if(!hasCameraPermission) {
        return (
            <Text>
                Requesting Permissions
            </Text>
        )
    } else if(!hasCameraPermission) {
        return (
        <Text>
            Good
        </Text>
        )
    } 
       
    const resizeImage = async (uri)  => {
        try {
          const response = await ImageManipulator.manipulateAsync( uri, 
                [{ resize: { width: 800, height: 800 } }], { "base64": true, format: ImageManipulator.SaveFormat.JPEG });

          return response.base64;
        } catch (error) {
          return undefined;
        }
    };

    let takePic = async() => {
        let options = {
            quality: 1,
            base64: true,
            exif: false,
            format: 'jpeg'
        }
        if(cameraRef.current) {
            let newPhoto = await cameraRef.current.takePictureAsync(options)
            let img_base64 = newPhoto.uri
            img_base64 = await resizeImage(img_base64)
            navigation.navigate("LabelInput", {user, img_base64, navigation})
        } 
    }

    return (
        <SafeAreaView style={{flex: 1, height: 0, backgroundColor: 'black'}}>
            <View  style={{flex: 0.1, backgroundColor: 'black', alignItems: 'center'}}/>
            <CameraView style={styles.camera} ref={cameraRef}/>
            <View style={{flex: 0.1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center'}}>
                <Pressable style={styles.buttoncam} onPress={takePic}/>
            </View>
        </SafeAreaView>
    )
}

export default Label

const styles = StyleSheet.create({
    camera: {
        flex: 0.8,
    },
    buttoncam: {
        backgroundColor: "white",
        width: 90,
        height: 60,
        justifyContent:'center',
        alignItems: 'center',
        borderRadius: 50,
    }
})

