import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

class Loader extends Component {
  render() {
    return (
      <React.Fragment>
        {/* <ActivityIndicator /> */}
        <ActivityIndicator size="large" color="pink" />
        {/* <ActivityIndicator size="small" color="#0000ff" /> */}
        {/* <ActivityIndicator size="large" color="#00ff00" /> */}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default Loader;
