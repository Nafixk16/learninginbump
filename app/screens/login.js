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
import PageLoader from '../components/page_loader';

export default class LoginPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: true,
    };
  }

  componentDidMount = async () => {
    if (await this.isUserLoginAlready()) {
      // this.props.navigation.reset({
      //   index: 0,
      //   routes: [{name: 'App'}],
      // });
      console.log('in is user login');
      this.props.navigation.navigate('App');
      return null;
    }
    this.setState({loading: false});
  };
  passwordHandler = value => {
    this.setState({password: value});
  };

  emaildHandler = value => {
    this.setState({email: value});
  };

  loginBtnHandler = async () => {
    if (!this.state.email || !this.state.password) {
      return alert('Enter email or password');
    }
    this.setState({loading: true});
    const data = {
      password: this.state.password,
      email: this.state.email,
    };
    try {
      const res = await postData('/api/user/login', data);

      if (res && res.accessToken) {
        console.log('res===>', res.accessToken);
        await AsyncStorage.setItem('token', res.accessToken);
        this.props.navigation.push('App');
      }
    } catch (error) {
      this.setState({loading: false});
    }
  };

  isUserLoginAlready = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('in login cheking==>', token);
    if (!token) {
      return false;
    }
    return true;
  };
  render() {
    if (this.state.loading) return null;

    const {navigation} = this.props;
    const imgAddr =
      'https://kalyandiocese.com/wp-content/uploads/2015/07/sony-background.jpg';
    const bg2 = '';
    const {loading} = this.state;
    return (
      <React.Fragment>
        <View style={styles.container}>
          <Image
            style={styles.loginLogo}
            source={{uri: 'https://i.ibb.co/KVLdRgC/logo3.png'}}></Image>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Email."
              placeholderTextColor="#003f5c"
              onChangeText={value => this.emaildHandler(value)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Password."
              placeholderTextColor="#003f5c"
              secureTextEntry={true}
              onChangeText={value => this.passwordHandler(value)}
            />
          </View>
          <TouchableOpacity>
            {loading && <PageLoader />}
            {/* <Text style={styles.forgot_button}>Forgot Password?</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this.loginBtnHandler}
            disabled={loading ? true : false}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.push('Sign Up')}>
            <Text style={styles.signup_button}>
              Don't have an account Signup?
            </Text>
          </TouchableOpacity>
        </View>
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
