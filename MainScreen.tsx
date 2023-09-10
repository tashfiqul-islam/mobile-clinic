import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from '@react-navigation/native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import * as Font from 'expo-font';
import Footer from './Footer';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1069AD', // Define your primary color here
  },
};

const SplashScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
      });

      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Return null while fonts are loading
  }

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#1069AD" barStyle="light-content" />
        <View style={styles.header}>
          <Animatable.Image
            animation="bounceIn"
            duration={1500}
            source={require('./assets/images/logo-2.png')}
            style={styles.logo}
            resizeMode="stretch"
          />
        </View>
        <Animatable.View
          style={[styles.footer, {backgroundColor: colors.background}]}
          animation="fadeInUpBig">
          <Text style={[styles.title, {color: colors.text}]}>
            Mobile Clinic
          </Text>
          <View style={styles.textContainer}>
            <Text style={styles.text}>... Revolutionizing </Text>
            <Text style={styles.text}>Healthcare</Text>
          </View>
          <View style={styles.button1}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <LinearGradient
                colors={['#1987D8', '#0F6FB6']}
                style={styles.signIn}>
                <Text style={styles.textSign}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.button2}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Registration')}
              style={[
                styles.signIn,
                {
                  borderColor: '#1069AD',
                  borderWidth: 1.5,
                  marginTop: 15,
                },
              ]}>
              <Text style={[styles.textSign, {color: '#1069AD'}]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
        <Footer />
      </View>
    </PaperProvider>
  );
};

export default SplashScreen;

const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1069AD',
  },
  header: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    fontFamily: 'Roboto-Bold', // Use the bold variant of Roboto
    color: '#05375a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontFamily: 'Roboto-Regular', // Use the regular variant of Roboto
    color: 'grey',
    fontSize: 12,
  },
  button1: {
    alignItems: 'center',
    marginTop: 40,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  button2: {
    alignItems: 'center',
  },
});
