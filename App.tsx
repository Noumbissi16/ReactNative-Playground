import { StatusBar } from "expo-status-bar";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState<any>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "29004774971-r161asskgn6jhicibgqt3jvp99o9vjjp.apps.googleusercontent.com",
    // "29004774971-vtrv1kihaqaamhcjcqv7qgof5ccmg1md.apps.googleusercontent.com",
    androidClientId:
      "29004774971-dnuds44ufqd8brn658enfj6usphdgu79.apps.googleusercontent.com",
    iosClientId:
      "29004774971-afuqrs4itrhkbntk3q2grl06498n699o.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  // AuthSession.useAuthRequest({clientId:"", redirectUri:""},{authorizationEndpoint:"dss"})

  async function getUserInfo(token: any) {
    // alert("dsds");
    console.log("abs");

    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = await response.json();
      console.log(user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication?.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  };

  useEffect(() => {
    handleLogin();
  }, [response]);

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      {/* <Image source={{ uri: userInfo.picture }} width={50} height={50} /> */}

      <Button title="Login with Google" onPress={() => promptAsync()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
