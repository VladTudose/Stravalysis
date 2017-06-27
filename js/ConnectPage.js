import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import StravaAuthorizePage from './StravaAuthorizePage';
import commonStyles from './utils/commonStyles';

export default class ConnectPage extends Component {
  state = {connectButtonPressed: false};

  onConnectButtonPressed() {
    this.setState({connectButtonPressed: true});
  }

  render() {
    return this.state.connectButtonPressed ?
      <StravaAuthorizePage/> :
      <View style={commonStyles.container}>
        <Button
          containerStyle={styles.connectButtonContaier}
          style={styles.connectButton}
          onPress={this.onConnectButtonPressed.bind(this)}>
          CONNECT WITH STRAVA
        </Button>
      </View>;
  }
}

const styles = StyleSheet.create({
  connectButtonContaier: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  connectButton: {
    padding: 16,
    fontSize: 20,
    backgroundColor: '#FF4920',
    color: 'white',
  },
});
