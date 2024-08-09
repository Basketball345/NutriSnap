import React, { useState, useCallback } from 'react'
import { Text, View, StyleSheet,ScrollView, ImageBackground, Dimensions, ActivityIndicator, Pressable } from 'react-native'
import { FIREBASE_AUTH } from "@/FirebasConfig";
import { SafeAreaView } from 'react-native-safe-area-context';
import NutritionBox from '../Components/NutritionBox';
import { useFocusEffect } from '@react-navigation/native';
import { REACT_APP_EC2_URL } from "@env"

const { width, height } = Dimensions.get('window');

const Home = ({route}) => {

    const [userEmail, setUserEmail] = useState(false)
    const [data, setData] = useState(null)

    const { user } = route.params;

    const ec2 = REACT_APP_EC2_URL

    if(!userEmail) {
      
      const ec2Endpoint = `${ec2}/user`
      const userEndpoint = ec2Endpoint + "?user_email=" + user.email
      fetch(userEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
            } else {
                return response.json()
            }
        })   
        .then(response => {
            console.log("DONE SIGNING INTO DATABASE")
            setUserEmail(true)
        })
        .catch(error => {
          console.error("Error signing into database:", error);
        });
    }

    const [showModal, setShowModal] = useState(false)

    const [loading, setLoading ] = useState(true)
    const [selectedOptions, setSelectedOptions] = useState({calories: true, protein: true, fat: true, carbs: true, sugar: true, fiber: true})

    useFocusEffect(
      useCallback(() => {
        setLoading(true)
      const dataEndpoint = `${ec2}/getData`

      const options = {
        username: user.email,
        requested: ["calories", "protein", "carbs", "fat", "sugar", "sugar", "fiber"]
      }

      console.log(dataEndpoint)

      fetch(dataEndpoint, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(options)})
        .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
          } else {
              return response.json()
          }
        })
        .then(response =>{
          console.log(response)
          setData(response)
          setLoading(false)
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        })
      }, [])
    );

    const toggleNutrient = (index) => {
      nutrients[index].show = !nutrients[index].show;
      setShowModal(false);
    };

    const capitalizeFirstLetter = (string) => {
      if (typeof string !== 'string' || string.length === 0) return string;
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    if(!loading) {
        return (    
            <ScrollView pagingEnabled showsVerticalScrollIndicator={true} style ={{flex: 1}}>
              <ImageBackground source ={require('../../assets/Board.png')} resizeMode="cover" style={styles.mainContainer}>
                  <View style = {{flex: 1, width: '100%'}}>
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.header}>Daily Progress</Text>
                      </View>
                      <View style={styles.container}>
                        {Object.entries(data.nutrientData.Day).map(([key, value], index) => (
                          <NutritionBox key={index} nutrient={capitalizeFirstLetter(key)} amount={value} />
                        ))}
                    </View>
                  </View>
                  <View style = {{flex: 1}}>
                    <View style={{alignItems: 'center'}}>
                      <Text style={styles.header}>Weekly Progress</Text>
                    </View>
                    <View style={styles.container}>
                      {Object.entries(data.nutrientData.Week).map(([key, value], index) => (
                      <NutritionBox key={index} nutrient={capitalizeFirstLetter(key)} amount={value} />
                      ))}
                    </View>
                  </View>
                  <View style = {{flex: 1}}>
                    <View style={{alignItems: 'center'}}>
                      <Text style={styles.header}>Monthly Progress</Text>
                    </View>
                    <View style={styles.container}>
                      {Object.entries(data.nutrientData.Month).map(([key, value], index) => (
                          <NutritionBox key={index} nutrient={capitalizeFirstLetter(key)} amount={value} />
                      ))}
                    </View>
                  </View>
              </ImageBackground>
              <View style={styles.settingsPage}>
                  <Text style={styles.settingsHeader}>Settings</Text>
                <View style={styles.settingsOption}>
                  <Text style={styles.settingsLabel}>Email: </Text>
                  <Text style={styles.settingsValue}>{user.email}</Text>
                </View>
                <View style={styles.settingsOption}>
                  <Pressable style={styles.button} onPress={() => FIREBASE_AUTH.signOut()}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize:16}}>
                        Sign out
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
            )
    } else {
      return (
        <SafeAreaView style={styles.container}>
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <ActivityIndicator size="large" color='#6E2B23'/>
            </View>
        </SafeAreaView>
      )   
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
        height: '100%'
      },
      header: {
        marginTop: 0.05 * height,
        justifyContent: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 0.09 * height,
      },
      settingsPage: {
        flex: 1,
        width: '100%',
        height: height, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      settingsHeader: {
        fontSize: 40,
        marginBottom: 20,
        color: 'black',
      },
      settingsOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      settingsLabel: {
        fontSize: 20,
        marginLeft: 10,
      },
      settingsValue: {
        fontSize: 18,
        color: 'grey',
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.65,
        height: height * 0.065,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 0,
        borderColor: 'black',
        backgroundColor: '#6E2B23',
    },
    });
    

export default Home;