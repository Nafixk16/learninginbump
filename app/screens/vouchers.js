import React from 'react';
import { StyleSheet, Dimensions, ScrollView, View } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon } from '../components/';
import VoucherItem from '../components/VoucherItem';
import { getData } from '../components/fetch.request';
const { width } = Dimensions.get('screen');
// import vouchers from '../constants/vouchers';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Vouchers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vouchers: null,
      isUpdate: true
    };
  }
  renderSearch = () => {
    const { navigation } = this.props;
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

  componentDidMount = async () => {
    this.props.navigation.addListener("focus", async () => {
      console.log("voucher moubnted")
      const profileData = JSON.parse(await AsyncStorage.getItem('profileData'));
      const token = await AsyncStorage.getItem('token');
      console.log(profileData, "<====> profile data")
      this.getAllVouchers(profileData.email, token);
      this.setState({ profileData: profileData });
      console.log(profileData.vouchers);
    });
  };

  componentWillUnmount() {
  }

  getAllVouchers = async (email, token) => {
    const url = `/api/user/getuservochers?email=${email}`;
    console.log('url', url);
    const vouchers = await getData(url, token);
    this.setState({ vouchers: vouchers });
    console.log('coucher===>', vouchers);
  };

  renderTabs = () => {
    const { navigation } = this.props;

    return (
      <Block row style={styles.tabs}>
        <Button
          shadowless
          style={[styles.tab, styles.divider]}
          onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="grid" family="feather" style={{ paddingRight: 8 }} />
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
              style={{ paddingRight: 8 }}
            />
            <Text size={16} style={styles.tabTitle}>
              Best Deals
            </Text>
          </Block>
        </Button>
      </Block>
    );
  };

  renderProducts = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.products}>
        <Block flex>
          {/* <Product product={products[4]} /> */}
          <VoucherItem product={vouchers[0]} horizontal />
          {/* <VoucherItem product={vouchers[1]} horizontal />
          <VoucherItem product={vouchers[2]} horizontal /> */}

          {/* <Product product={products[4]} full /> */}
        </Block>
      </ScrollView>
    );
  };

  render() {
    const { vouchers } = this.state;
    if (!vouchers || (vouchers && vouchers.length === 0)) {
      return (
        <View>
          <Text>No Vouchers</Text>
        </View>
      );
    }
    return (
      <Block flex center style={styles.home}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.products}>
          <Block flex>
            {vouchers.map((value, index) => (
              <React.Fragment key={index}>
                <VoucherItem product={value} horizontal />
              </React.Fragment>
            ))}
          </Block>
        </ScrollView>
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
