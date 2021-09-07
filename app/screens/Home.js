import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {Button, Block, Text, Input, theme} from 'galio-framework';
import {getData} from '../components/fetch.request';
import {Icon, Product} from '../components/';
import Recommend from '../components/Recommend';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
import products from '../constants/products';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: null,
      currentRecommend: 0,
      totalRecommend: 0,
    };
  }
  renderSearch = () => {
    const {navigation} = this.props;
    const iconCamera = (
      <Icon
        size={16}
        color={theme.COLORS.MUTED}
        name="zoom-in"
        family="material"
      />
    );

    return (
      <Input
        right
        color="black"
        style={styles.search}
        iconContent={iconCamera}
        placeholder="What are you looking for?"
        onFocus={() => navigation.navigate('Pro')}
      />
    );
  };

  renderTabs = () => {
    const {navigation} = this.props;

    return (
      <Block row style={styles.tabs}>
        <Button
          shadowless
          style={[styles.tab, styles.divider]}
          onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{paddingRight: 8}} />
            <Text size={16} style={styles.tabTitle}>
              Categories
            </Text>
          </Block>
        </Button>
        <Button
          shadowless
          style={styles.tab}
          onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon
              size={16}
              name="camera-18"
              family="GalioExtra"
              style={{paddingRight: 8}}
            />
            <Text size={16} style={styles.tabTitle}>
              Best Deals
            </Text>
          </Block>
        </Button>
      </Block>
    );
  };
  onSwipe = (gestureName, gestureState) => {
    const {currentRecommend, totalRecommend} = this.state;

    switch (gestureName) {
      case 'SWIPE_LEFT':
        if (currentRecommend >= totalRecommend - 1) {
          return this.setState({currentRecommend: 0});
        }
        this.setState({currentRecommend: currentRecommend + 1});
    }
    console.log(currentRecommend, ' ', totalRecommend);
  };
  getProfileData = async token => {
    try {
      const response = await getData('/api/user/getprofile', token);
      await AsyncStorage.setItem('profileData', JSON.stringify(response));
    } catch (error) {
      console.log('Home Page Error=> ', error);
    }
  };
  componentDidMount = async () => {
    console.log('*******  component did mount *******************');
    const token = await AsyncStorage.getItem('token');
    this.getProfileData(token);
    this.getRecommendProducts(token);
  };
  getRecommendProducts = async token => {
    const trimester = [1, 2, 3];
    const randomElement =
      trimester[Math.floor(Math.random() * trimester.length)];
    const url = `/api/user/getproducts?tremister=${trimester[0]}`;
    console.log('url=>', url);
    const response = await getData(url, token);
    console.log('pro=', response);
    this.setState({
      recommendProduct: response,
      totalRecommend: response.length,
    });
  };
  renderProducts = () => {
    const {currentRecommend, recommendProduct, totalRecommend} = this.state;
    return (
      <ScrollView
        style={{ backgroundColor: "#f0c2dd" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          {/* <Product product={products[0]} horizontal /> */}
          <Block flex row>
            <Product
              to={'QuizGame'}
              product={products[0]}
              style={{marginRight: theme.SIZES.BASE}}
            />
            <Product to={'Medical'} product={products[1]} />
          </Block>
          <Block flex row>
            <Product
              to={'Diet Plan'}
              product={products[2]}
              style={{marginRight: theme.SIZES.BASE}}
            />
            <Product to="Voucher" product={products[3]} />
          </Block>
          <Product to="Workout" product={products[4]} />

          {recommendProduct && recommendProduct[currentRecommend] && (
            <React.Fragment>
              <Text bold={true} muted={true}>
                Recommend Products
              </Text>
              <GestureRecognizer
                onSwipe={(direction, state) => this.onSwipe(direction, state)}>
                <Recommend product={recommendProduct[currentRecommend]} />
              </GestureRecognizer>
            </React.Fragment>
          )}
          {/* <Product product={products[4]} horizontal /> */}
          {/* <Product product={products[4]} full /> */}
        </Block>
      </ScrollView>
    );
  };

  displayRecommendedProducts = () => {
    const recommendProduct = this.state.recommendProduct;
    if (!recommendProduct) {
      return;
    }
    console.log(recommendProduct);
    return (
      <React.Fragment>
        {recommendProduct.map((obj, index) => (
          <Block
            key={index}
            // row={horizontal}
            card
            flex
            style={[styles.product, styles.shadow]}>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate(routeTo, {product: product})}>
              <Block flex style={[styles.imageContainer, styles.shadow]}>
                <Image
                  source={{uri: obj.url}}
                  key={`viewed-${index}`}
                  resizeMode="cover"
                  style={styles.thumb}
                />
              </Block>
            </TouchableWithoutFeedback>
          </Block>
        ))}
      </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Block flex center style={styles.home}>
          {this.renderProducts()}
        </Block>
        {/* {this.displayRecommendedProducts()} */}
      </React.Fragment>
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
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
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
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: 250,
    // width: thumbMeasure,
    height: 150,
  },
});
