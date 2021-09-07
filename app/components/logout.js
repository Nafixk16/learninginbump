import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LoginPanel extends React.Component {
  componentDidMount = async () => {};

  logoutHandler = async () => {
    console.log('sssssssssssssssssssss');
    const r = await AsyncStorage.removeItem('token');
    console.log(r);
    this.props.navigation.navigate('Onboarding');
  };
  render() {
    this.logoutHandler();
    return null;
  }
}
