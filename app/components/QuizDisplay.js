import React from 'react';
import {withNavigation} from '@react-navigation/compat';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {CheckBox, Icon} from 'react-native-elements';
import {Block, Text, theme, Radio} from 'galio-framework';
// import CheckBox from '@react-native-community/checkbox';
import materialTheme from '../constants/Theme';
import {getData, postData} from './fetch.request';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('screen');

class QuizDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAnswer: {},
    };
  }

  selectAnswerHandler = (e, questionNo, optionNo) => {
    let selectedAnswer = this.state.selectedAnswer;
    selectedAnswer[questionNo] = optionNo;
    console.log(selectedAnswer, ' ', optionNo, '  ', questionNo);
    this.setState({selectedAnswer: selectedAnswer});
  };

  isAnswerSelected = (questionNo, optionNo) => {
    let selectedAnswer = this.state.selectedAnswer;
    if (selectedAnswer.hasOwnProperty(questionNo)) {
      if (selectedAnswer[questionNo] === optionNo) {
        console.log('=================');
        return true;
      }
    }
    console.log('********************');
    return false;
  };

  submitQuizHandler = async () => {
    let rightAnswerCount = 0;
    const selectedAnswer = this.state.selectedAnswer;
    const selectedAnswerKey = Object.keys(this.state.selectedAnswer);
    const quizList = this.props.quizList;
    const isAllAnsered =
      Object.values(selectedAnswer).length === quizList.length ? true : false;
    if (!isAllAnsered) {
      return alert('Please answer every MCQs');
    }

    selectedAnswerKey.forEach((value, index) => {
      let quizListRightAnswer = quizList[value].options.indexOf(
        quizList[value].rightAnswer,
      );
      console.log(quizListRightAnswer, ' == ', selectedAnswer[value]);

      if (quizListRightAnswer !== selectedAnswer[value]) {
        rightAnswerCount += 1;
      }
    });
    alert(
      `You answered ${rightAnswerCount} question correct\n check voucher section!`,
    );
    const profileData = JSON.parse(await AsyncStorage.getItem('profileData'));
    const token = await AsyncStorage.getItem('token');
    const url = `/api/user/getvoucher?score=${rightAnswerCount * 10}&id=${
      profileData.email
    }`;
    try {
      const response = await getData(url, token);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({selectedAnswer: {}});
    }
  };
  render() {
    const {
      navigation,
      horizontal,
      full,
      style,
      priceColor,
      imageStyle,
      quizList,
    } = this.props;
    const imageStyles = [
      styles.image,
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle,
    ];
    const {selectedAnswer} = this.state;
    if (!quizList) return <Text>No Quiz..</Text>;
    console.log('quizlist==>', quizList);
    return (
      <React.Fragment>
        {quizList.map((key, index) => (
          <Block
            key={index}
            row={horizontal || false}
            card
            flex
            style={[styles.product, styles.shadow, style]}>
            <TouchableWithoutFeedback>
              <Block style={[styles.imageContainer, styles.shadow]}>
                <Text bold={true}>{`Question# ${index + 1}`}</Text>
              </Block>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback>
              <Block space="between" style={styles.productDescription}>
                <Text size={14} style={styles.productTitle}>
                  {key.description}
                </Text>
                {key.options.map((value, index2) => (
                  <React.Fragment key={index2}>
                    <CheckBox
                      key={`${index2}${index}`}
                      title={value}
                      checkedIcon={
                        <Image
                          style={styles.uncheckedAndCheckedIcon}
                          source={{
                            uri:
                              'https://www.vhv.rs/dpng/d/6-68893_check-icon-svg-hd-png-download.png',
                          }}
                        />
                      }
                      uncheckedIcon={
                        <Image
                          style={styles.uncheckedAndCheckedIcon}
                          source={{
                            uri:
                              'https://static.thenounproject.com/png/739877-200.png',
                          }}
                        />
                      }
                      onPress={e => this.selectAnswerHandler(e, index, index2)}
                      checked={selectedAnswer[index] == index2 ? true : false}
                    />
                  </React.Fragment>
                ))}
              </Block>
            </TouchableWithoutFeedback>
          </Block>
        ))}
        <Block row space="between">
          <Pressable style={[styles.button, styles.buttonClose]}>
            <Text style={styles.textStyle}>clear</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonSave]}
            onPress={() => this.submitQuizHandler()}>
            <Text style={styles.textStyle}>Submit</Text>
          </Pressable>
        </Block>
      </React.Fragment>
    );
  }
}

export default withNavigation(QuizDisplay);

const styles = StyleSheet.create({
  radioSelect: {
    padding: 10,
  },
  uncheckedAndCheckedIcon: {
    height: 15,
    width: 15,
  },
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    margin: 10,
    color: 'white',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonSave: {
    backgroundColor: '#FF69B4',
    margin: 10,
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  questionTitle: {
    fontWeight: 'bold',
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
    paddingLeft: 9,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    // marginTop: -16,
  },
  horizontalImage: {
    height: 115,
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});
