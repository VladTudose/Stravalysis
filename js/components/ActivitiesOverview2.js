import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Webview,
} from 'react-native';
import PropTypes from 'prop-types';
import ActivitiesGraph from './ActivitiesGraph';
import DayView from './DayView';
import ViewLoading from './ViewLoading';
import {
  ACTIVITY_TYPE_CYCLING,
  ACTIVITY_TYPE_RUNNING,
  CYCLING_METRICS,
  SECONDS_IN_DAY,
  TIME_FRAME_DAYS,
} from '../utils/consts';

const PARTIAL_GET_STRAVA_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities?per_page=200';
const html = `<html>
<header><title>This is title</title></header>
<body>
Hello world
</body>
</html>`;

export default class ActivitiesOverview2 extends Component {
  render() {
    return (
      <Webview source={html}/>
    );
  }
}

ActivitiesOverview.propTypes = {
  stravaAccessToken: PropTypes.string.isRequired,
  activityType: PropTypes.oneOf([ACTIVITY_TYPE_CYCLING, ACTIVITY_TYPE_RUNNING]).isRequired,
  metric: PropTypes.oneOf(CYCLING_METRICS).isRequired,
  days: PropTypes.oneOf(TIME_FRAME_DAYS).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLandscape: {
    flexDirection: 'row',
  },
});
