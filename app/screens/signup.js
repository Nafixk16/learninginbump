import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Block, Button, Text, theme} from 'galio-framework';
import {postData} from '../components/fetch.request';
const {height, width} = Dimensions.get('screen');
import AsyncStorage from '@react-native-async-storage/async-storage';
import materialTheme from '../constants/Theme';
import Images from '../constants/Images';
import {ScrollView} from 'react-native-gesture-handler';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: 'nafix123@gmail.com',
      password: '12345678910',
      loading: true,
      registerDetail: {
        firstName: null,
        lastName: null,
        age: null,
        email: null,
        password: null,
        monthOfPregnancy: null,
        phone: null,
      },
    };
  }

  onTextChnageHandler = (value, key) => {
    let registerDetail = this.state.registerDetail;
    if (key === 'monthOfPregnancy' || key === 'age') {
      value = Number(value);
    }
    registerDetail[key] = value;
    this.setState({registerDetail: registerDetail});
  };
  signupBtnHandler = async () => {
    const data = this.state.registerDetail;
    console.log(data);
    try {
      const res = await postData('/api/user/register', data);
      console.log('res===>', res);
      alert('Registered');
    } catch (error) {
      alert('try again');
    } finally {
      this.props.navigation.goBack();
    }
  };

  render() {
    // if (this.state.loading) return null;

    const {navigation} = this.props;
    const imgAddr =
      'https://kalyandiocese.com/wp-content/uploads/2015/07/sony-background.jpg';
    const bg2 = '';
    return (
      <React.Fragment>
        <ScrollView>
          <View style={styles.container}>
            {/* <Image</ScrollView>
            style={styles.loginLogo}
            source={require('../assets/images/logo2.png')}></Image> */}
            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Email."
                placeholderTextColor="#003f5c"
                keyboardType="email-address"
                onChangeText={value => this.onTextChnageHandler(value, 'email')}
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Password."
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={value =>
                  this.onTextChnageHandler(value, 'password')
                }
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="First Name"
                placeholderTextColor="#003f5c"
                onChangeText={value =>
                  this.onTextChnageHandler(value, 'firstName')
                }
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Last Name"
                placeholderTextColor="#003f5c"
                onChangeText={value =>
                  this.onTextChnageHandler(value, 'lastName')
                }
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Age"
                keyboardType="numeric"
                placeholderTextColor="#003f5c"
                onChangeText={value => this.onTextChnageHandler(value, 'age')}
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Month of Pregnancy"
                keyboardType="numeric"
                placeholderTextColor="#003f5c"
                onChangeText={value =>
                  this.onTextChnageHandler(value, 'monthOfPregnancy')
                }
              />
            </View>

            <View style={styles.inputView}>
              <TextInput
                style={styles.TextInput}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                placeholderTextColor="#003f5c"
                secureTextEntry={true}
                onChangeText={value => this.onTextChnageHandler(value, 'phone')}
              />
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={this.signupBtnHandler}>
              <Text style={styles.loginText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 50,
  },
  inputView: {
    backgroundColor: '#FFC0CB',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: 'beige',
  },
  image: {
    resizeMode: 'cover',
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'red',
    // justifyContent: 'center',
  },
  signup_button: {
    marginTop: 15,
    color: 'teal',
    fontWeight: '700',
  },
  loginLogo: {
    height: 105,
    width: 105,
    marginTop: -30,
    marginBottom: 10,
  },
});
