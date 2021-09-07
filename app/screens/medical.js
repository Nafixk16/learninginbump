import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TextInput,
  View,
} from 'react-native';
import {Block, Text, theme, Button} from 'galio-framework';
import {SpeedDial} from 'react-native-elements';

// import { LinearGradient } from 'expo-linear-gradient';
import EditProfile from '../components/profile.modal';
import {Icon} from '../components';
import {Images, materialTheme} from '../constants';
import {HeaderHeight} from '../constants/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../components/fetch.request';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import AddMedicalModal from '../components/medical.modal';
import MedicalSpeedDial from '../components/medicalSpeedDial';

const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

export default class MedicalHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      editUserProfileData: {
        firstName: undefined,
        lastName: undefined,
        age: undefined,
        monthOfPregnancy: undefined,
      },
      profileData: {},
      dietPlanData: null,
      selectedDay: 'monday',
      dayList: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
      monthsName: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    };
  }

  componentDidMount = async () => {
    const profileData = JSON.parse(await AsyncStorage.getItem('profileData'));
    this.setState({profileData: profileData});
  };

  getProfileData = async () => {
    console.log('*******  get profile *******************');
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await getData('/api/user/getprofile', token);
      await AsyncStorage.setItem('profileData', JSON.stringify(response));
      this.setState({profileData: response});
    } catch (error) {
      console.log('Home Page Error=> ', error);
    }
  };

  addMedicalRecords = () => {};
  // changeDay = (gestureName, gestureState) => {
  //   if()
  // };
  closeEditProfileModal = () => {
    this.setState({showModal: false});
  };

  getCurrentMonth = () => {
    const dateObj = new Date();
    let month = this.state.monthsName[dateObj.getUTCMonth()];
    return month;
  };
  render() {
    const {showModal, profileData, dietPlanData, selectedDay} = this.state;

    return (
      <React.Fragment>
        <Block flex style={styles.profile}>
          <Block flex>
            <ImageBackground
              source={{
                uri:
                  'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1082&q=80',
              }}
              style={styles.profileContainer}
              imageStyle={styles.profileImage}>
              <Block flex style={styles.profileDetails}>
                <Text
                  color="#159999"
                  bold="700"
                  size={38}
                  style={{
                    paddingBottom: 8,
                    textTransform: 'capitalize',
                    marginLeft: 30,
                  }}>
                  {'Medical'}
                </Text>
                <Text
                  color="#159999"
                  bold="700"
                  size={38}
                  style={{
                    paddingBottom: 8,
                    textTransform: 'capitalize',
                    marginLeft: 30,
                  }}>
                  {'History'}
                </Text>

                <Block style={styles.profileTexts}>
                  <Text
                    color="black"
                    size={28}
                    style={{paddingBottom: 8, textTransform: 'capitalize'}}>
                    {this.state.selectedDay}
                  </Text>

                  <Button
                    shadowless
                    color="info"
                    style={[styles.button, styles.shadow]}
                    onPress={() => this.setState({showModal: true})}>
                    Add
                  </Button>

                  {/* <Block row space="between">
                    <Block row>
                      <Text color="black" size={16} muted style={styles.seller}>
                        {this.getCurrentMonth()}
                      </Text>
                      <Text size={16} color={'#159999'}>
                        2021
                        <Icon name="shape-star" family="GalioExtra" size={14} />
                      </Text>
                    </Block>
                  </Block> */}
                </Block>
              </Block>
            </ImageBackground>
          </Block>
          <Block flex style={styles.options}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <View style={styles.dietDetails}> */}
              <MedicalSpeedDial
                profileData={profileData}
                keyField={'bloodPressure'}
              />
              {/* </View> */}
            </ScrollView>
          </Block>
        </Block>

        <AddMedicalModal
          showModal={showModal}
          closeEditProfileModal={this.closeEditProfileModal}
          profileData={this.state.profileData}
          getProfileData={this.getProfileData}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    width: 89,
    marginLeft: -0,
  },
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
  },
  profileImage: {
    width: width * 1.1,
    height: 'auto',
    marginTop: 80,
  },
  profileContainer: {
    width: width,
    height: height / 2,
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  dietDetails: {
    // paddingTop: theme.SIZES.BASE * 2,
    padding: 5,
    flex: 1,
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE * 7,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure,
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
  },
});
