import React, {useState} from 'react';
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
import {Images, materialTheme} from '../constants';
import {Block, Text, theme, Button} from 'galio-framework';
import {HeaderHeight} from '../constants/utils';
const {width, height} = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
import {SpeedDial} from 'react-native-elements';
import {ListItem, Avatar, Icon} from 'react-native-elements';

function MedicalSpeedDial(props) {
  // Declare a new state variable, which we'll call "count"
  const [expanded, setExpanded] = useState(null);
  const keyList = {
    bloodPressure: ' Blood Pressure',
    sugger: 'Sugar',
    weight: 'Weight',
  };
  // if (!open) return null;

  const medicalRecords = props.profileData && props.profileData.medicalRecords;
  if (!medicalRecords) return null;

  console.log('props==>', props.profileData);

  function whichToDisplay(i, keyField) {
    if (keyField === 'bloodPressure') {
      return displayBP(i, keyField);
    } else {
      return displayOther(i, keyField);
    }
  }

  function displayOther(i, keyField) {
    let date = '';
    if (!medicalRecords[keyField][i]) {
      return null;
    }
    return (
      <Block>
        <Text bold={true} color="black" size={16} muted style={styles.seller}>
          {String(new Date(medicalRecords[keyField][i].timeStamp))}
        </Text>
        <Text size={16} color={'#159999'}>
          {`Value:     ${medicalRecords[keyField][i].value}`}
        </Text>
      </Block>
    );
  }
  function displayBP(i, index) {
    let keyField = 'bloodPressure';
    return (
      <Block>
        <Text bold={true} color="black" size={16} muted style={styles.seller}>
          {String(new Date(medicalRecords[keyField][i].timeStamp))}
        </Text>
        <Text size={16} color={'#159999'}>
          {`BP High:     ${medicalRecords[keyField][i].uper}`}
        </Text>
        <Text size={16} color={'#159999'}>
          {`BP Low:     ${medicalRecords[keyField][i].lower}`}
        </Text>
      </Block>
    );
  }
  return (
    <React.Fragment>
      <Block row space="between" style={{padding: theme.SIZES.BASE}}>
        <Block middle>
          <Text bold size={12} style={{marginBottom: 8}}>
            {'Height'}
          </Text>
          <Text muted size={12}>
            {medicalRecords.height}
          </Text>
        </Block>
        <Block middle>
          <Text bold size={12} style={{marginBottom: 8}}>
            {'Month of Pregnancy'}
          </Text>
          <Text muted size={12}>
            {props.profileData.monthOfPregnancy}
          </Text>
        </Block>
      </Block>
      {Object.keys(keyList).map((key, index) => (
        <ListItem.Accordion
          key={index}
          content={
            <>
              {/* <Icon name="place" size={30} /> */}
              <ListItem.Content>
                <ListItem.Title style={{fontSize: 20, fontWeight: '500'}}>
                  {keyList[key]}
                </ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={key === expanded ? true : false}
          onPress={
            key === expanded ? () => setExpanded(null) : () => setExpanded(key)
          }>
          {medicalRecords[key].map((l, i) => (
            <ListItem key={i} bottomDivider>
              {/* <Avatar title={"Blood Pressure"} source={{uri: l.avatar_url}} /> */}
              <ListItem.Content>{whichToDisplay(i, key)}</ListItem.Content>
            </ListItem>
          ))}
        </ListItem.Accordion>
      ))}
    </React.Fragment>
  );
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

export default MedicalSpeedDial;
