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

class AddMedicalModal extends Component {
  state = {
    modalVisible: false,
    addMedicalData: {
      height: '',
      weight: '',
      uper: '',
      lower: '',
      sugger: '',
    },
  };

  onChangeFieldValue = (e, key) => {
    let addMedicalData = this.state.addMedicalData;
    addMedicalData[key] = Number(e);
    this.setState({addMedicalData: addMedicalData});
  };
  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  updateRequest = async (url, data, token) => {
    try {
      url = `/api/user/${url}`;
      await postData(url, data, token, 'PUT');
    } catch (error) {
      console.log(error);
    } finally {
      this.props.closeEditProfileModal();
      this.props.getProfileData();
    }
  };
  updateMedicalHistory = async () => {
    let addMedicalData = this.state.addMedicalData;
    const token = await AsyncStorage.getItem('token');
    const id = this.props.profileData.email;
    if (addMedicalData.uper && addMedicalData.lower) {
      console.log('innnn bp aupdate');
      this.updateRequest(
        'addbloodpressure',
        {id: id, uper: addMedicalData.uper, lower: addMedicalData.lower},
        token,
      );
    }
    if (addMedicalData.sugger) {
      this.updateRequest(
        'addsugger',
        {id: id, sugger: addMedicalData.sugger},
        token,
      );
    }
    if (addMedicalData.weight) {
      this.updateRequest(
        'addWeight',
        {id: id, weight: addMedicalData.weight},
        token,
      );
    }
  };
  saveEditProfile = async () => {
    if (this.props.profileData) {
      return this.updateMedicalHistory();
    }
    let addMedicalData = this.state.addMedicalData;
    console.log(addMedicalData);
    const keys = Object.keys(this.state.addMedicalData);
    const id = this.props.profileData.email;
    if (!id) {
      return alert('Something went wrong! try again');
    }
    console.log(this.props.profileData);
    addMedicalData['id'] = id;
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (!addMedicalData[key]) {
        return alert(`${key} can't be empty`);
      }
    }

    const token = await AsyncStorage.getItem('token');
    console.log('add medical=>', addMedicalData);
    try {
      await postData(
        '/api/user/addmedicalrecord',
        addMedicalData,
        token,
        'PUT',
      );
      this.props.closeEditProfileModal();
    } catch (error) {
      this.props.closeEditProfileModal();
    }
  };

  render() {
    const {modalVisible, addMedicalData} = this.state;
    const {showModal, closeEditProfileModal, profileData} = this.props;
    const {onChangeFieldValue} = this;
    if (!showModal) return null;
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
                <Text>Add Medical</Text>
              </View>

              <Block>
                <Text style={styles.labelStyle}>Height (min=2 max=9)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'height')}
                  value={addMedicalData.heigth}
                  placeholder="Height"
                  keyboardType="numeric"
                />
              </Block>

              <Block>
                <Text style={styles.labelStyle}>Weight (min=30 max=200)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'weight')}
                  value={addMedicalData.weight}
                  placeholder="Weight"
                  keyboardType="numeric"
                />
              </Block>

              <Block>
                <Text style={styles.labelStyle}>BP High (min=0 max=300)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'uper')}
                  value={addMedicalData.uper}
                  placeholder="BP High"
                  keyboardType="numeric"
                />
              </Block>

              <Block>
                <Text style={styles.labelStyle}>BP Low (min=0 max=300)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'lower')}
                  value={addMedicalData.lower}
                  placeholder="BP low"
                  keyboardType="numeric"
                />
              </Block>

              <Block>
                <Text style={styles.labelStyle}>Sugar (min=0 max=400)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={e => onChangeFieldValue(e, 'sugger')}
                  value={addMedicalData.sugger}
                  placeholder="Sugar"
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

export default AddMedicalModal;
