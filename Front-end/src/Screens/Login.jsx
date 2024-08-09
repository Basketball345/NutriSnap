import {Dimensions, Image, View, Text, StyleSheet, TextInput, ActivityIndicator, Pressable} from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '@/FirebasConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true)
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
            console.log(response)
        } catch (error) {
            console.log(error)
            alert("Your email and password could not be found. Please try again")
        } finally {
            setLoading(false)
        }
    }

    const signUp = async () => {
        setLoading(true)
        try {
            {/*User will be signed in automatically after creating account*/}
            const response = await createUserWithEmailAndPassword(auth, email, password)
            console.log(response)
            alert("Account created successfully!");
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
    
                <Image source ={require('../../assets/Veggie.jpg')} style={styles.image}/>
                <View style={styles.overlayTextWrapper}>
                    <Text style={styles.overlayText}>NutriSnap</Text>
                </View>
                    <View style={{marginTop: windowHeight*0.08, paddingBottom: 20}}>
                        <TextInput value = {email} placeholderTextColor='black' style={styles.input} placeholder="Please enter your email address..." autoCapitalize="none"
                        onChangeText={(text) => setEmail(text)}/>
                    </View>
                    <View style={{paddingBottom: 20}}>
                        <TextInput secureTextEntry={true} placeholderTextColor='black' value = {password} style={styles.input} placeholder="Please enter your password..." autoCapitalize="none"
                        onChangeText={(text) => setPassword(text)}/>
                    </View>
                    {loading ? <ActivityIndicator/> : 
                    <View >
                        <View style={{alignItems: 'center', paddingTop: 5, paddingBottom: 10}}>
                            <Pressable style={styles.button} onPress={signIn}> 
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize:16}}> 
                                    Log In
                                </Text>
                            </Pressable> 
                        </View>

                        <View style={{alignItems: 'center'}}>
                            <Pressable style={styles.button} onPress={signUp}>
                                <Text style={{color: 'white', fontWeight: 'bold', fontSize:16}}>
                                    Sign Up
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    }
        </SafeAreaView>
    )
}

export default Login

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