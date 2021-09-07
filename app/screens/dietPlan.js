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
import {Block, Text, theme} from 'galio-framework';
// import { LinearGradient } from 'expo-linear-gradient';
import EditProfile from '../components/profile.modal';
import {Icon} from '../components';
import {Images, materialTheme} from '../constants';
import {HeaderHeight} from '../constants/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../components/fetch.request';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

export default class DietPlan extends React.Component {
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
    const token = await AsyncStorage.getItem('token');
    await this.getProfileData(token);
    this.getDietPlan(token);
  };

  // changeDay = (gestureName, gestureState) => {
  //   if()
  // };
  onSwipe(gestureName, gestureState) {
    // const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    // this.setState({gestureName: gestureName});
    console.log(gestureName);
    console.log(gestureState);
    let selectedDay = this.state.selectedDay;
    let dayList = this.state.dayList;
    let currentIndex = dayList.indexOf(selectedDay);
    console.log(currentIndex);
    switch (gestureName) {
      case 'SWIPE_LEFT':
        if (currentIndex === 0) {
          this.setState({selectedDay: dayList[6]});
        } else {
          this.setState({selectedDay: dayList[currentIndex - 1]});
        }

        break;
      case 'SWIPE_RIGHT':
        if (currentIndex === 6) {
          this.setState({selectedDay: dayList[0]});
        } else {
          this.setState({selectedDay: dayList[currentIndex + 1]});
        }
        break;
    }
  }
  getProfileData = async token => {
    const response = await getData('/api/user/getprofile', token);
    console.log('getprofile', response);
    this.setState({profileData: response});
  };

  getDietPlan = async token => {
    const trimester = this.calculateTrimester();
    const url = `/api/user/getdietplan?trimester=${trimester}`;
    const response = await getData(url, token);
    console.log('getTrimester----', response);
    this.setState({dietPlanData: response});
  };

  closeEditProfileModal = () => {
    this.getData();
    this.setState({showModal: false});
  };

  calculateTrimester = () => {
    const monthOfPregnancy = this.state.profileData.monthOfPregnancy;
    if (!monthOfPregnancy) return 0;
    if (monthOfPregnancy >= 1 && monthOfPregnancy <= 3) {
      return 1;
    }
    if (monthOfPregnancy >= 4 && monthOfPregnancy <= 6) {
      return 2;
    }
    if (monthOfPregnancy >= 7 && monthOfPregnancy <= 9) {
      return 3;
    }
  };

  getCurrentMonth = () => {
    const dateObj = new Date();
    let month = this.state.monthsName[dateObj.getUTCMonth()];

    return month;
  };
  render() {
    const {showModal, profileData, dietPlanData, selectedDay} = this.state;
    if (!dietPlanData) return null;
    return (
      <React.Fragment>
        <Block flex style={styles.profile}>
          <Block flex>
            <ImageBackground
              source={{
                uri:
                  'https://images.unsplash.com/photo-1523071454898-f9085ac34f1d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=751&q=80',
              }}
              style={styles.profileContainer}
              imageStyle={styles.profileImage}>
              <Block flex style={styles.profileDetails}>
                <Text
                  color="red"
                  bold={true}
                  size={38}
                  style={{
                    paddingBottom: 8,
                    textTransform: 'capitalize',
                    marginLeft: 30,
                  }}>
                  {'Diet Plan'}
                </Text>
                <GestureRecognizer
                  onSwipe={(direction, state) =>
                    this.onSwipe(direction, state)
                  }>
                  <Block style={styles.profileTexts}>
                    <Text
                      color="black"
                      size={28}
                      style={{paddingBottom: 8, textTransform: 'capitalize'}}>
                      {this.state.selectedDay}
                    </Text>
                    <Block row space="between">
                      <Block row>
                        {/* <Block middle style={styles.pro}>
                      <Text size={16} color="white">
                        Pro
                      </Text>
                    </Block> */}
                        <Text
                          color="black"
                          size={16}
                          muted
                          style={styles.seller}>
                          {this.getCurrentMonth()}
                        </Text>
                        <Text size={16} color={'red'}>
                          2021
                          <Icon
                            name="shape-star"
                            family="GalioExtra"
                            size={14}
                          />
                        </Text>
                      </Block>
                    </Block>
                  </Block>
                </GestureRecognizer>
                {/* <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient} /> */}
              </Block>
            </ImageBackground>
          </Block>
          <Block flex style={styles.options}>
            <Block row space="between" style={{padding: theme.SIZES.BASE}}>
              <Block middle>
                <Text bold size={12} style={{marginBottom: 8}}>
                  {this.calculateTrimester()}
                </Text>
                <Text muted size={12}>
                  Trimester
                </Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{marginBottom: 8}}>
                  {profileData.monthOfPregnancy}
                </Text>
                <Text muted size={12}>
                  month of pregnancy
                </Text>
              </Block>
            </Block>

            {/* <Block
                row
                space="between"
                style={{paddingVertical: 16, alignItems: 'baseline'}}> */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.dietDetails}>
                {Object.keys(dietPlanData[0]['daysDiet'][selectedDay]).map(
                  (key, index) => (
                    <React.Fragment key={index}>
                      <Text size={16}>{key}</Text>
                      <Text size={14} muted>
                        {dietPlanData[0]['daysDiet'][selectedDay][key]}
                      </Text>
                    </React.Fragment>
                  ),
                )}
              </View>
              {/* </Block> */}
            </ScrollView>
          </Block>
        </Block>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
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
