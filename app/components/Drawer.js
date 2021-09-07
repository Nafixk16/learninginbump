import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Block, Text, theme} from 'galio-framework';

import Icon from 'react-native-vector-icons/FontAwesome';
import materialTheme from '../constants/Theme';

const proScreens = ['Woman', 'Man', 'Kids', 'New Collection', 'Sign Up'];

class DrawerItem extends React.Component {
  renderIcon = () => {
    const {title, focused} = this.props;

    switch (title) {
      case 'Home':
        return (
          <Icon
            size={16}
            name="home"
            family="GalioExtra"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Voucher':
        return (
          <Icon
            size={16}
            name="gift"
            family="ionicon"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Profile':
        return (
          <Icon
            size={16}
            name="user"
            family="entypo"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'New Collection':
        return (
          <Icon
            size={16}
            name="grid-on"
            family="material"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Profile':
        return (
          <Icon
            size={16}
            name="circle-10"
            family="GalioExtra"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Settings':
        return (
          <Icon
            size={16}
            name="gears"
            family="font-awesome"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Components':
        return (
          <Icon
            size={16}
            name="md-switch"
            family="ionicon"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Log out':
        return (
          <Icon
            size={16}
            name="sign-out"
            family="ionicon"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      default:
        return null;
    }
  };

  renderLabel = () => {
    const {title} = this.props;

    if (proScreens.includes(title)) {
      return (
        <Block middle style={styles.pro}>
          <Text size={12} color="white">
            PRO
          </Text>
        </Block>
      );
    }

    return null;
  };

  render() {
    const {focused, title, navigation} = this.props;
    const proScreen = proScreens.includes(title);
    return (
      <TouchableOpacity
        style={{height: 55, marginTop: 5}}
        onPress={() => {
          navigation.navigate(title);
        }}>
        <Block
          flex
          row
          style={[
            styles.defaultStyle,
            focused ? [styles.activeStyle, styles.shadow] : null,
          ]}>
          <Block middle flex={0.1} style={{marginRight: 28}}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={18}
              color={
                focused
                  ? 'white'
                  : proScreen
                  ? materialTheme.COLORS.MUTED
                  : 'black'
              }>
              {title}
            </Text>
            {this.renderLabel()}
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

export default DrawerItem;

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: '#E75870',
    borderRadius: 4,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderRadius: 2,
    height: 16,
    width: 36,
  },
});
