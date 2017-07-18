import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import ActivitiesGraph from './ActivitiesGraph';
import DayView from './DayView';
import ViewLoading from './ViewLoading';
import {
  ACTIVITY_TYPE_CYCLING,
  ACTIVITY_TYPE_RUNNING,
  RUNNING_METRICS,
  SECONDS_IN_DAY,
  TIME_FRAME_DAYS,
} from '../utils/consts';

const PARTIAL_GET_ACTIVITIES_URL = 'https://zomer-tech.com/stravalysis/backend/get_activities.php';
// const PARTIAL_GET_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities?per_page=200';
// const PARTIAL_GET_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities?per_page=200';

export default class ActivitiesOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: true, isLandscape: this.isLandscape()};
    this.getActivities(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.state.isLoading = true;
    this.getActivities(nextProps);
  }

  isLandscape() {
    let {height, width} = Dimensions.get('window');
    return height < width;
  }

  async getActivities(props) {
    let now = new Date();
    let dayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let after = Math.floor(dayBegin / 1000 - SECONDS_IN_DAY * (props.days - 1));
    this.state.after = after;
    let url = PARTIAL_GET_ACTIVITIES_URL + '?access_token=' + props.stravaAccessToken +
              '&substract_days=' + props.days;
    console.log(`get activities url: ${url}`);
    let response = await fetch(url);
    let activities = (await response.json()).filter(activity =>
      activity.type === props.activityType && activity[props.metric] != null);

    this.state.isLoading = false;
    this.state.activities = activities;
    this.state.selectedDay = 0;
    this.setState(this.state);
  }

  onLayout() {
    let isLandscape = this.isLandscape();
    if (isLandscape != this.state.isLandscape) {
      this.state.isLandscape = isLandscape;
      this.setState(this.state);
    }
  }

  render() {
    if (this.state.isLoading) {
      return <ViewLoading/>;
    }
    return (
      <View
        onLayout={this.onLayout.bind(this)}
        style={[styles.container, this.state.isLandscape ? styles.containerLandscape : {}]}>
        <View style={{flex: 3}}>
          <ActivitiesGraph respondingComponent={this}/>
        </View>
        <View style={{flex: 0, backgroundColor: 'blue'}}/>
      </View>
    );
  }
}

ActivitiesOverview.propTypes = {
  stravaAccessToken: PropTypes.string.isRequired,
  activityType: PropTypes.oneOf([ACTIVITY_TYPE_CYCLING, ACTIVITY_TYPE_RUNNING]).isRequired,
  metric: PropTypes.oneOf(RUNNING_METRICS).isRequired,
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
