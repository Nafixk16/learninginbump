import React from 'react';
import {withNavigation} from '@react-navigation/compat';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  ScrollView,
  View,
} from 'react-native';
import {HeaderHeight} from '../constants/utils';
import {Block, Text, theme} from 'galio-framework';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import materialTheme from '../constants/Theme';
import {getData} from '../components/fetch.request';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

class WorkoutPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workoutList: [],
      profileData: {},
      trimester: 0,
      lastIndex: 1,
      currentIndex: 0,
      currentWorkout: [],
    };
  }
  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('token');
    const profileData = JSON.parse(await AsyncStorage.getItem('profileData'));
    const trimester = this.calculateTrimester(profileData.monthOfPregnancy);
    const url = `/api/user/getExercise?tremister=${trimester}`;
    try {
      const workouts = await getData(url, token);
      console.log('wok==>', workouts);
      let currentWorkout = [];
      currentWorkout.push(workouts[0]);
      this.setState({
        workoutList: workouts,
        profileData: profileData,
        trimester: trimester,
        currentWorkout: currentWorkout,
      });
    } catch (error) {
      console.log(error);
    }
  };
  calculateTrimester = monthOfPregnancy => {
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

  onSwipe(gestureName, gestureState) {
    let currentIndex = this.state.currentIndex;
    const workoutList = this.state.workoutList;
    console.log('current-=>', currentIndex);
    let currentWorkout = [];
    switch (gestureName) {
      case 'SWIPE_LEFT':
        if (!workoutList[currentIndex + 1]) {
          currentWorkout.push(workoutList[0]);
          this.setState({currentIndex: 0, currentWorkout: currentWorkout});
        } else {
          currentWorkout.push(workoutList[currentIndex + 1]);

          this.setState({
            currentIndex: currentIndex + 1,
            currentWorkout: currentWorkout,
          });
        }
        break;
      case 'SWIPE_RIGHT':
        if (!workoutList[currentIndex - 1]) {
          currentWorkout.push(workoutList[workoutList.length - 1]);
          this.setState({
            currentIndex: workoutList.length - 1,
            currentWorkout: currentWorkout,
          });
        } else {
          currentWorkout.push(workoutList[currentIndex - 1]);
          this.setState({
            currentIndex: currentIndex - 1,
            currentWorkout: currentWorkout,
          });
        }
        break;
    }
    console.log(currentWorkout);
  }
  render() {
    const {
      navigation,
      product,
      horizontal,
      full,
      style,
      priceColor,
      imageStyle,
    } = this.props;
    const imageStyles = [
      styles.image,
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle,
    ];

    const {
      workoutList,
      profileData,
      trimester,
      lastIndex,
      startIndex,
      currentIndex,
      currentWorkout,
    } = this.state;
    if (!currentWorkout || currentWorkout.length === 0) return null;

    return (
      <React.Fragment>
        <Block flex style={styles.profile}>
          <Block flex>
            <ImageBackground
              source={{
                uri:
                  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=751&q=80',
              }}
              style={styles.profileContainer}
              imageStyle={styles.profileImage}>
              <Block flex style={styles.profileDetails}>
                <Block style={styles.profileTexts}>
                  <Text
                    color="white"
                    bold={true}
                    size={38}
                    style={{paddingBottom: 8}}>
                    {'Workout Plan'}
                  </Text>
                </Block>
              </Block>
              <Block row space="between" style={{padding: theme.SIZES.BASE}}>
                <Block middle>
                  <Text bold size={15} style={{marginBottom: 8}} color="white">
                    {trimester}
                  </Text>
                  <Text muted size={12} color="white">
                    Trimester
                  </Text>
                </Block>
                <Block middle>
                  <Text bold size={15} style={{marginBottom: 8}} color="white">
                    {profileData.monthOfPregnancy}
                  </Text>
                  <Text muted size={12} color="white">
                    month of pregnancy
                  </Text>
                </Block>
              </Block>
            </ImageBackground>
          </Block>

          <Block flex style={styles.options}>
            <GestureRecognizer
              onSwipe={(direction, state) => this.onSwipe(direction, state)}>
              {/* <View style={{flex: 1}}> */}
              {currentWorkout.map((value, index) => (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View>
                    <Block
                      key={index}
                      row={horizontal}
                      card
                      flex
                      style={[styles.product, styles.shadow, style]}>
                      <TouchableWithoutFeedback>
                        <Block
                          flex
                          space="between"
                          style={styles.paginationumber}>
                          <Text size={14} style={styles.productTitle}>
                            {`${currentIndex + 1} of ${workoutList.length}`}
                          </Text>
                        </Block>
                      </TouchableWithoutFeedback>

                      <View>
                        <Image
                          style={styles.imageStyle}
                          source={{uri: value.exerciseImage}}></Image>
                      </View>
                      <TouchableWithoutFeedback>
                        <Block
                          flex
                          space="between"
                          style={styles.productDescription}>
                          <Text
                            bold={true}
                            size={14}
                            style={styles.productTitle}>
                            Duration
                          </Text>
                          <Text size={14} style={styles.productTitle}>
                            {value.duration}
                          </Text>
                        </Block>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback>
                        <Block
                          flex
                          space="between"
                          style={styles.productDescription}>
                          <Text
                            bold={true}
                            size={14}
                            style={styles.productTitle}>
                            Description
                          </Text>
                          <Text size={14} style={styles.productTitle}>
                            {value.description}
                          </Text>
                          {/* <Text size={12} muted={!priceColor} color={priceColor}>
                    klajsdkl
                  </Text> */}
                        </Block>
                      </TouchableWithoutFeedback>
                    </Block>
                  </View>
                </ScrollView>
              ))}
              {/* </View> */}
            </GestureRecognizer>
          </Block>
        </Block>
      </React.Fragment>
    );
  }
}

export default WorkoutPlan;

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 250,
  },
  imageStyle: {
    height: 170,
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  paginationumber: {
    padding: theme.SIZES.BASE / 2,
    alignItems: 'center',
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: 0,
  },
  horizontalImage: {
    height: 110,
    width: 'auto',
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    marginBottom: -HeaderHeight * 2,
    // marginBottom: 100,
  },
  profileImage: {
    width: width * 1.1,
    height: 'auto',
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
    // backgroundColor: theme.COLORS.WHITE,
    // shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
    // height: 350,
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
