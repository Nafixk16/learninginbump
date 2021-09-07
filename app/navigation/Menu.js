import React, {useState, useEffect} from 'react';
import {
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import {useSafeArea} from 'react-native-safe-area-context';

import {Icon, Drawer as DrawerCustomItem} from '../components/';
import {Images, materialTheme} from '../constants/';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  const screens = ['Home', 'Voucher', 'Profile'];
  const [profileData, setProfileData] = useState(null);
  useEffect(async () => {
    const data = await AsyncStorage.getItem('profileData');
    console.log('gettubg sybnnc=>', data);
    setProfileData(JSON.parse(data));
  }, []);

  // async function getProfileName(key) {
  //   const data = await AsyncStorage.getItem('profileData');
  //   if (key === 'name') return data.name;
  // }
  return (
    <Block
      style={styles.container}
      forceInset={{top: 'always', horizontal: 'never'}}>
      <Block flex={0.25} style={styles.header}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Profile')}>
          <Block style={styles.profile}>
            <Image source={{uri: profile.avatar}} style={styles.avatar} />
            <Text h5 color={'white'}>
              {profileData
                ? `${profileData.firstName} ${profileData.lastName}`
                : 'Loading'}
            </Text>
          </Block>
        </TouchableWithoutFeedback>
        <Block row>
          {/* <Block middle style={styles.pro}>
            <Text size={16} color="white">
              {profile.plan}
            </Text>
          </Block> */}
          <Text size={16} color={'white'}  style={styles.seller}>
            {profileData ? profileData.email : ''}
          </Text>
          {/* <Text size={16} color={materialTheme.COLORS.WARNING}>
            {profile.rating}{' '}
            <Icon name="shape-star" family="GalioExtra" size={14} />
          </Text> */}
        </Block>
      </Block>
      <Block flex style={{paddingLeft: 7, paddingRight: 14}}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: insets.top * 0.4,
              paddingLeft: drawerPosition === 'left' ? insets.left : 0,
              paddingRight: drawerPosition === 'right' ? insets.right : 0,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
        </ScrollView>
      </Block>
      <Block flex={0.3} style={{paddingLeft: 7, paddingRight: 14}}>
        <DrawerCustomItem
          title="Log out"
          navigation={navigation}
          focused={state.index === 8 ? true : false}
        />
        {/* <DrawerCustomItem
          title="Sign Up"
          navigation={navigation}
          focused={state.index === 9 ? true : false}
        /> */}
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#E75870',
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    justifyContent: 'flex-end',
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: 16,
  },
});

export default CustomDrawerContent;
