import React from 'react'
import { useState} from "react"
import { SafeAreaView } from 'react-native-safe-area-context';
import {Dimensions, View, Text, StyleSheet, TextInput, Pressable} from 'react-native'

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

const LabelInput = ({route, navigation}) => {

    const [meal, setMeal] = useState("")
    const [serving, setServing ] = useState("")
    const [servingsize, setServingsize] = useState("")

    const { user } = route.params 
    const { img_base64 } = route.params

    const next = () => {
        const result = parseFloat(serving) / parseFloat(servingsize); 
        navigation.navigate("LabelAnalysis", {user, img_base64, meal, result, navigation})
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{marginTop: windowHeight*0.08, paddingBottom: 20}}> 
                <TextInput value = {meal} placeholderTextColor='black' style={styles.input} placeholder="What are you eating?" autoCapitalize="none"
                        onChangeText={(text) => setMeal(text)}/>
            </View>
            <View style={{paddingBottom: 20}}>
                <TextInput value = {serving} placeholderTextColor='black' style={styles.input} placeholder="How many servings are you having?" autoCapitalize="none"
                        onChangeText={(text) => setServing(text)}/>
            </View>
            <View style={{paddingBottom: 20}}>
                <TextInput value = {servingsize} placeholderTextColor='black' style={styles.input} placeholder="What is the serving size of the meal?" autoCapitalize="none"
                        onChangeText={(text) => setServingsize(text)}/>
            </View>
            <View style={{alignItems: 'center', paddingTop: 5, paddingBottom: 10}}>
                <Pressable style={styles.button} onPress={next}>
                    <Text>
                        Continue
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: windowHeight* 0.08,
        borderColor: 'black'
    },
    input: {
        height: windowHeight * 0.07,
        width: windowWidth * 0.9,
        borderRadius: 20,
        borderWidth: 4,
        color: 'black',
        borderColor: 'black',
        paddingLeft: 25,
        backgroundColor: 'white'
    },
    image: {
        marginTop: -windowHeight*0.33,
        width: windowWidth*1.1,  
        height: windowWidth*1.1, 
        borderRadius: (windowWidth * 1.1) / 3, 
        opacity: 1,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * 0.65,
        height: windowHeight * 0.055,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 0,
        borderColor: 'black',
        backgroundColor: '#6E2B23',
    },
    overlayTextWrapper: {
        top: -windowHeight*0.23,
        alignItems: 'center',
    },
    overlayText: {
        position: 'absolute',
        color: 'white',
        fontSize: 80,
        fontWeight: 'bold',
        textShadowColor:'black',
        textShadowRadius:15,
      },

})

export default LabelInput