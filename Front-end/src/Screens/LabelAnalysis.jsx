import { View, Text, TextInput, StyleSheet, ActivityIndicator, Dimensions, Pressable} from 'react-native'
import { useState, useEffect } from "react"
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart} from "react-native-chart-kit";

import { REACT_APP_EC2_URL, REACT_APP_FLASK_URL } from "@env"

const windowWidth = Dimensions.get("window").width
const windowHeight = Dimensions.get("window").height

class Nutrient {
    constructor(name, amount, color, legendFontColor, legendFontSize) {
      this.name = name;
      this.amount = amount;
      this.color = color;
      this.legendFontColor = legendFontColor;
      this.legendFontSize = legendFontSize;
    }
  }

const LabelAnalysis = ({ route, navigation }) => {

    const [nutrients, setNutrients] = useState()
    const [calories, setCalories] = useState()

    const { user } = route.params
    const { meal } = route.params
    const { result } = route.params

    const options = {
        username: user.email,
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        sugar: 0,
        fiber: 0,
        meal: "",
    }

    useEffect(() => {
        const { img_base64 } = route.params
        const object = {
            "Base64" : img_base64,
            "Type": 'Azure'
        }
    
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(object),
            headers: {
                'Content-Type': 'application/json',
            }
        }

        let temp = []

        fetch(REACT_APP_FLASK_URL, requestOptions) 
        .then(response => response.json()) 
        .then(response =>{
            response["Fat"] = response["Total Fat"]
            delete response["Total Fat"]
            console.log(response)

            for (const key in response) {
                if(key != "Calories") {
                    let color = ""

                    switch(key) {
                        case 'Protein':
                            color = "#800000"
                            break;
                        case 'Carbs':
                            color = "#87A96B"
                            break;
                        case 'Fat': 
                            color = "#FFD700"
                            break
                        case 'Sugar':
                            color = "#708090"
                            break
                        case 'Fiber':
                            color = "#004E7C"
                            break;
                    }

                    const nutrient = new Nutrient(key, Math.round(response[key] * result), color, color, 15 )
                    temp.push(nutrient)  
                } 
            }

            setCalories(response["Calories"].toString())
            setNutrients(temp)
        
        })
        .catch(error => {
            console.error("Error analyzing:", error);
        })
        
    }, [])

    const storeData = async () => {
        const ec2 = REACT_APP_EC2_URL
        const mealEndpoint = `${ec2}/writeMeal`

        options.meal = meal
        nutrients.forEach(item => {
            options[item.name] = item.amount
        })
        options.calories = parseInt(calories)
        
        console.log(options)

        fetch(mealEndpoint, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(options)})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}`);
                } else {
                    return response.json()
                }
            })   
            .then(response =>{
                console.log(response)
            })
            .catch(error => {
                console.error("Error storing data:", error);
            })
    }


    if(!nutrients) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <ActivityIndicator size="large" color='#ebebeb'/>
                </View>
            </SafeAreaView>
        )
    } else {
        return (
            <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: windowWidth*0.9, height: windowHeight * 0.4}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}> 
                        <Text style={{color: 'black', fontSize: 40, fontWeight: 'bold', paddingBottom: 30}}>
                            Calories:{" "}
                        </Text> 
                        <TextInput style={{color: 'black', fontSize: 40, fontWeight: 'bold', paddingBottom: 30}}
                                    onChangeText={(text) => setCalories(text)}
                                    placeholder={(calories).toString()}
                                    placeholderTextColor='black'
                                    value={calories}/>
                    </View>
                    <PieChart
                        data={nutrients}
                        width={windowWidth}
                        height={290}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(255, 255, 255, 1)`,
                        }}
                        accessor={"amount"}
                        backgroundColor={"transparent"}
                        paddingLeft={"50"}
                        center={[0, 0]} 
                        hasLegend = {true}
                        absolute
                    />
                </View>
                <View>
                    <Pressable style={styles.button} onPress={storeData}> 
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize:16}}> 
                            Looks Good!
                        </Text>
                    </Pressable> 
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6E2B23',
    },  
    chart: {
        marginVertical: 20,
        borderRadius: 28,
    },
    button: {
        marginTop: 50,
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
})

export default LabelAnalysis