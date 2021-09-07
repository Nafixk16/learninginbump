import React, {Component} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
} from 'react-native';
import {Block} from 'galio-framework';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {postData, promisePost} from './fetch.request';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileModal extends Component {
  state = {
    modalVisible: false,
    editUserProfileData: {
      firstName: null,
      lastName: null,
      age: null,
      monthOfPregnancy: null,
      email: null,
      phone: null,
    },
  };

  onChangeFieldValue = (e, key) => {
    let editUserProfileData = this.state.editUserProfileData;
    if (key === 'age' || key === 'monthOfPregnancy') {
      e = Number(e);
    }
    editUserProfileData[key] = e;
    this.setState({editUserProfileData});
  };
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  saveEditProfile = async () => {
    let profileData = this.props.profileData;
    let editUserProfileData = this.state.editUserProfileData;
    const keys = Object.keys(this.state.editUserProfileData);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (editUserProfileData[key] === null) {
        editUserProfileData[key] = profileData[key];
      }
    }

    const token = await AsyncStorage.getItem('token');
    try {
      await postData(
        '/api/user/updateProfile',
        editUserProfileData,
        token,
        'PUT',
      );
    } catch (error) {
      this.props.closeEditProfileModal();
    }

    // console.log('res==>', res);
  };
  render() {
    const {modalVisible, editUserProfileData} = this.state;
    const {showModal, closeEditProfileModal, profileData} = this.props;
    const {onChangeFieldValue} = this;
    if (!showModal || !profileData) return null;
    console.log(profileData.age);

    return (
      <React.Fragment>
        {/* <View style={styles.centeredView}> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            this.setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.headerTitle}>
                <Text>Edit Profile</Text>
              </View>

              <Block>
                <Text style={styles.labelStyle}>First Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'firstName')}
                  value={editUserProfileData.firstName}
                  placeholder="First Name"
                  // keyboardType="numeric"
                />
              </Block>

              <Block>
                <Text style={styles.labelStyle}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'lastName')}
                  value={editUserProfileData.lastName}
                  placeholder="last Name"
                  // keyboardType="numeric"
                />
              </Block>

              <Block>
                <Text style={styles.labelStyle}>Age</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'age')}
                  value={
                    editUserProfileData.age
                      ? String(editUserProfileData.age)
                      : ''
                  }
                  placeholder="Age"
                  keyboardType="numeric"
                />
              </Block>

              <Block>
                <Text style={styles.labelStyle}>Month of Pregnancy</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'monthOfPregnancy')}
                  value={
                    editUserProfileData.monthOfPregnancy
                      ? String(editUserProfileData.monthOfPregnancy)
                      : ''
                  }
                  placeholder="Month of Pregnancy"
                  keyboardType="numeric"
                />
              </Block>

              <Block row space="between">
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => closeEditProfileModal()}>
                  <Text style={styles.textStyle}>close</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonSave]}
                  onPress={() => this.saveEditProfile()}>
                  <Text style={styles.textStyle}>save</Text>
                </Pressable>
              </Block>
            </View>
          </View>
        </Modal>
        {/* <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => this.setModalVisible(true)}>
          <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable> */}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  headerTitle: {
    marginBottom: 15,
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    zIndex: 1,
  },
  labelStyle: {
    fontSize: 10,
    marginLeft: 13,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    color: 'black',
    borderRadius: 10,
    paddingLeft: 5,
    width: 200,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonSave: {
    backgroundColor: '#FF69B4',
    margin: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ProfileModal;
