import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TextInput,
} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import {Tooltip} from 'react-native-elements';

// import { LinearGradient } from 'expo-linear-gradient';
import EditProfile from '../components/profile.modal';
import {Icon} from '../components';
import {Images, materialTheme} from '../constants';
import {HeaderHeight} from '../constants/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getData} from '../components/fetch.request';
const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

export default class Profile extends React.Component {
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
    };
  }
  componentDidMount = async () => {
    const token = await AsyncStorage.getItem('token');
    await this.getData(token);
    this.getRecommendProducts(token);
  };

  getRecommendProducts = async token => {
    const trimester = [1, 2, 3];
    const randomElement =
      trimester[Math.floor(Math.random() * trimester.length)];
    const url = `/api/user/getproducts?tremister=${trimester[0]}`;
    console.log(token);
    console.log('url=>', url);
    const response = await getData(url, token);
    console.log('pro=', response);
    this.setState({recommendProduct: response});
  };

  getData = async token => {
    const response = await getData('/api/user/getprofile', token);
    console.log('getprofile', response);
    this.setState({profileData: response});
  };

  closeEditProfileModal = () => {
    this.getData();
    this.setState({showModal: false});
  };

  render() {
    const {showModal, profileData, recommendProduct} = this.state;
    if (!recommendProduct) return null;
    return (
      <React.Fragment>
        <Block flex style={styles.profile}>
          <Block flex>
            <ImageBackground
              source={{
                uri:
                  'https://i.ibb.co/vh8DrYt/pregnancy-3d-icon-yellow-background-3d-symbols-pregnancy-people-icons-1.jpg',
              }}
              style={styles.profileContainer}
              imageStyle={styles.profileImage}>
              <Block flex style={styles.profileDetails}>
                <Block style={styles.profileTexts}>
                  <Text color="white" size={28} style={{paddingBottom: 8}}>
                    {profileData.firstName + ' ' + profileData.lastName}
                  </Text>
                  <Block row space="between">
                    <Block row>
                      {/* <Block middle style={styles.pro}>
                      <Text size={16} color="white">
                        Pro
                      </Text>
                    </Block> */}
                      <Text color="white" size={16} muted style={styles.seller}>
                        Be healthy Be careful
                      </Text>
                      <Text size={16} color={materialTheme.COLORS.WARNING}>
                        <Icon name="shape-star" family="GalioExtra" size={14} />
                      </Text>
                    </Block>
                    <Block>
                      {/* <Text color={theme.COLORS.MUTED} size={16}>
                        <Icon
                          name="map-marker"
                          family="font-awesome"
                          color={theme.COLORS.MUTED}
                          size={16}
                        />
                        Los Angeles, CA
                      </Text> */}
                    </Block>
                  </Block>
                </Block>
                {/* <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={styles.gradient} /> */}
              </Block>
            </ImageBackground>
          </Block>
          <Block flex style={styles.options}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Block row space="between" style={{padding: theme.SIZES.BASE}}>
                <Block middle>
                  <Text bold size={12} style={{marginBottom: 8}}>
                    {(profileData.vouchers && profileData.vouchers.length) || 0}
                  </Text>
                  <Text muted size={12}>
                    Voucher
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
                <Block middle>
                  <Text bold size={12} style={{marginBottom: 8}}>
                    {profileData.age}
                  </Text>
                  <Text muted size={12}>
                    Age
                  </Text>
                </Block>
              </Block>
              {/* <Block>
              <TextInput
                style={styles.input}
                onChangeText={this.onChangeFieldValue}
                value={'nafix'}
                placeholder="useless placeholder"
                keyboardType="numeric"
              />
            </Block> */}
              <Block
                row
                space="between"
                style={{paddingVertical: 16, alignItems: 'baseline'}}>
                <Text size={16}></Text>
                <Text
                  size={12}
                  color={theme.COLORS.PRIMARY}
                  onPress={() => this.setState({showModal: true})}>
                  Edit Profile
                </Text>
              </Block>
              <Block
                row
                space="between"
                style={{paddingVertical: 16, alignItems: 'baseline'}}>
                <Text size={16}>Recommended Products</Text>
                {/* <Text
                  size={12}
                  color={theme.COLORS.PRIMARY}
                  onPress={() => this.props.navigation.navigate('Home')}>
                  View All
                </Text> */}
              </Block>
              <Block style={{paddingBottom: -HeaderHeight * 2}}>
                <Block row space="between" style={{flexWrap: 'wrap'}}>
                  {recommendProduct.map((obj, imgIndex) => (
                    <Tooltip
                      // backgroundColor="white"
                      key={imgIndex}
                      height={80}
                      width={200}
                      popover={
                        <Block flex>
                          <Text color="white">{`Name: ${obj.productName}`}</Text>
                          <Text color="white">{`Detail: ${obj.description}`}</Text>
                        </Block>
                      }>
                      <Image
                        source={{uri: obj.url}}
                        key={`viewed-${imgIndex}`}
                        resizeMode="cover"
                        style={styles.thumb}
                      />
                    </Tooltip>
                  ))}
                </Block>
              </Block>
            </ScrollView>
          </Block>
        </Block>
        <EditProfile
          showModal={this.state.showModal}
          closeEditProfileModal={this.closeEditProfileModal}
          onChangeFieldValue={this.onChangeFieldValue}
          profileData={this.state.profileData}
        />
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
