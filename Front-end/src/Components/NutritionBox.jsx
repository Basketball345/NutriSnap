import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const NutritionBox = ({nutrient, amount}) => {
    return (
    <View style ={{padding: 4}}>

    <LinearGradient start={{x: 0, y: 1}} end={{x: 0, y: 0}} colors={['#ffffff', '#D0B9B7', '#ffffff']} style={styles.box}>
          <Text style={styles.nutrient}>{nutrient}</Text>
          <Text style={styles.amount}>{amount}</Text>
      </LinearGradient>
      </View>
    );
}

const styles = StyleSheet.create({
    box: {
      alignItems: 'center',
      justifyContent: 'center',
      width: width / 2.4, 
      height: width / 2.6, 
      borderRadius: 35,
      borderColor: 'black',
      borderWidth: 5,
      margin: 8,
    },
    nutrient: {
      color: 'black',
      fontSize: 32,
      fontWeight: 'bold',
      paddingBottom: 8,
    },
    amount: {
      color: 'black',
      fontSize: 30,
    },
  });
  
export default NutritionBox