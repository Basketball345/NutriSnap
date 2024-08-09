import React, { useEffect, useState } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebasConfig";

import Tabs from "@/src/Components/Tabs";
import Login from "@/src/Screens/Login";


export default function Index() {
  {/*This useState variable can either be of type Auth::User, or null*/}
  const [user, setUser] = useState(null) 

  {/*useEffect will run when the component is first mounted. From there, the onAuthStateChanged function will
    be listening for changes until the component unmounts*/}
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });

    {/*Used to prevent memory leaks after the component unmounts*/}
    return () => unsubscribe();
  }, []);

  return (

    <NavigationContainer independent={true}>
      {user ? <Tabs user={user}/> : <Login/>}
    </NavigationContainer>

  )
}
