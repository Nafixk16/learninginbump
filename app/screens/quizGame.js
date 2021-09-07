import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button, Block, Text, Input, theme} from 'galio-framework';
import {ButtonGroup} from 'react-native-elements';
import {Icon} from '../components/';
import QuizDisplay from '../components/QuizDisplay';
import {postData, getData} from '../components/fetch.request';
const {width} = Dimensions.get('screen');
import products from '../constants/products';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class QuizGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizList: null,
      level: 1,
      selectedIndex: 0,
    };
  }
  updateIndex = selectedIndex => {
    console.log(selectedIndex);
    this.setState({level: selectedIndex + 1, selectedIndex: selectedIndex});
    this.getQuizData();
  };
  componentDidMount = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    const url = `/api/user/getquiz?level=${this.state.level}`;
    const res = await getData(url, accessToken);
    this.setState({quizList: res});
    console.log('res of quiz get level => ', res);
  };
  getQuizData = async () => {
    const accessToken = await AsyncStorage.getItem('token');
    const url = `/api/user/getquiz?level=${this.state.level}`;
    const res = await getData(url, accessToken);
    this.setState({quizList: res});
  };
  renderProducts = () => {
    const component1 = () => <Text>Level-1</Text>;
    const component2 = () => <Text>Level-2</Text>;
    const component3 = () => <Text>Level-3</Text>;
    const buttons = [
      {element: component1},
      {element: component2},
      {element: component3},
    ];
    const {selectedIndex} = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{height: 100}}
          />
          <QuizDisplay quizList={this.state.quizList} />
          {/* <Product product={products[4]} horizontal /> */}
          {/* <Product product={products[4]} full /> */}
        </Block>
      </ScrollView>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderProducts()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.5,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300',
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
});
