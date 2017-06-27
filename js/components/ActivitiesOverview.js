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
  CYCLING_METRICS,
  TIME_FRAME_DAYS,
} from '../utils/consts';

const SECONDS_IN_DAY = 86400;
const PARTIAL_GET_STRAVA_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities';

export default class ActivitiesOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: true, isLandscape: this.isLandscape()};
    this.getActivitiesByDay();
  }

  componentWillReceiveProps() {
    this.state.isLoading = true;
    this.getActivitiesByDay();
  }

  isLandscape() {
    let {height, width} = Dimensions.get('window');
    return height < width;
  }

  async getActivitiesByDay() {
    let after = Math.floor(new Date() / 1000 - SECONDS_IN_DAY * this.props.days);
    let url = PARTIAL_GET_STRAVA_ACTIVITIES_URL +
      `?access_token=${this.props.stravaAccessToken}&after=${after}`;
    let response = await fetch(url);
    let activities = (await response.json()).filter(activity =>
      activity.type === this.props.activityType && activity[this.props.metric] != null);
    let activitiesByDay = [];
    for (var i = 0; i < this.props.days; i++) {
      activitiesByDay.push([i, []]);
    }
    activities.forEach((activity) => {
      let dayIndex = Math.floor((new Date(activity.start_date) / 1000 - after) / SECONDS_IN_DAY);
      activitiesByDay[dayIndex][1].push(activity);
    });

    this.state.isLoading = false;
    this.state.activitiesByDay = activitiesByDay;
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
    console.log('render ActivitiesOverview');
    if (this.state.isLoading) {
      return <ViewLoading/>;
    }
    return (
      <View
        onLayout={this.onLayout.bind(this)}
        style={[styles.container, this.state.isLandscape ? styles.containerLandscape : {}]}>
        <ActivitiesGraph respondingComponent={this}/>
        <DayView respondingComponent={this}/>
      </View>
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
