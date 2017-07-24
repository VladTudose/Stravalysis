import React, { Component } from 'react';
import { Platform, PickerIOS, StyleSheet, Text, View } from 'react-native';
import RCTNetworking from 'RCTNetworking';
import Button from 'react-native-button';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import ConnectPage from './ConnectPage';
import ActivitiesOverview from './components/ActivitiesOverview';
import StatsMenu from './components/StatsMenu';
import ViewLoading from './components/ViewLoading';
import PickerAndroid from 'react-native-picker-android';

import {
  ACTIVITY_TYPE_CYCLING,
  METRIC_DISTANCE,
  METRIC_ELEVATION,
  CYCLING_METRICS,
  RUNNING_METRICS,
  MAP_METRIC_LABEL,
  TIME_FRAME_DAYS,
} from './utils/consts';

// const STRAVA_URL = 'https://www.strava.com';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;

export default class StatsPage extends Component {
  state = {
    isLoading: false,
    isLoggedOut: false,
    metric: METRIC_DISTANCE,
    days: 90,
    activityType: ACTIVITY_TYPE_CYCLING,
  };

  async logout() {
    this.setState({isLoading: true});
    await stravaAccessTokenStorage.remove();
    RCTNetworking.clearCookies((cleared) => {
      this.setState({isLoggedOut: true});
    });
  }

  render() {
    if (this.state.isLoggedOut) {
      return <ConnectPage/>;
    }
    if (this.state.isLoading) {
      return <ViewLoading/>;
    }

    let metrics = this.state.activityType === ACTIVITY_TYPE_CYCLING ? CYCLING_METRICS : RUNNING_METRICS;
    let metricPickerItems = [];
    metrics.forEach((metric) => metricPickerItems.push(
      <Picker.Item label={MAP_METRIC_LABEL[metric]} value={metric} key={metric}/>));
    let timeFramePickerItems = [];
    TIME_FRAME_DAYS.forEach((days) => timeFramePickerItems.push(
      <Picker.Item label={`${days} days`} value={days} key={days}/>));

    return (
      <View style={styles.container}>
        <StatsMenu respondingComponent={this}/>
        <ActivitiesOverview
          stravaAccessToken={this.props.stravaAccessToken}
          activityType={this.state.activityType}
          metric={this.state.metric}
          days={this.state.days}/>

        <Modal style={styles.modal} position='center' ref='metricModal'>
          <Picker
            style={styles.metricPicker}
            selectedValue={this.state.metric}
            onValueChange={(itemValue, _) => this.setState({metric: itemValue})}>
            {metricPickerItems}
          </Picker>
          <Button onPress={() => this.refs.metricModal.close()}>
            Ok
          </Button>
        </Modal>
        <Modal style={styles.modal} position='center' ref='timeFrameModal'>
          <Picker
            style={styles.timeFramePicker}
            selectedValue={this.state.days}
            onValueChange={(itemValue, _) => this.setState({days: itemValue})}>
            {timeFramePickerItems}
          </Picker>
          <Button onPress={() => this.refs.timeFrameModal.close()}>
            Ok
          </Button>
        </Modal>
      </View>
    );
  }
}

StatsPage.propTypes = {
  stravaAccessToken: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: 300,
  },
  metricPicker: {
    width: 250,
  },
  timeFramePicker: {
    width: 90,
  },
});
