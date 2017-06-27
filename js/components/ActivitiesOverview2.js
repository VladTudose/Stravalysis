import React, { Component } from 'react';
import {
  ART,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { connectPageStyles } from './styles';
import { getShape } from './utils';
import { scaleTime, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';

const {
  Group,
  Shape,
  Surface,
} = ART;

const PARTIAL_GET_STRAVA_ACTIVITIES_URL = 'https://www.strava.com/api/v3/athlete/activities?access_token=';

export default class ActivitiesOverview2 extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedActivityIndex: 0 };
    this.updateStyleState();
  }

  async getActivities() {
    let response = await fetch(PARTIAL_GET_STRAVA_ACTIVITIES_URL + this.props.stravaAccessToken);
    let activities = (await response.json()).filter(activity => activity.type == 'Run');
    this.setState({ isLoading: false, activities});
  }

  getShape(scaleX, scaleY) {
    return line()
      .x(d => scaleX(this.xAccessor(d)))
      .y(d => scaleY(this.yAccessor(d)));
  }

  getScaleX() {
    let dates = this.props.activities.map(this.xAccessor);
    return scaleTime()
      .domain([Math.min(...dates), Math.max(...dates)])
      .range([this.state.surfaceWidth * 0.05, this.state.surfaceWidth * 0.95]);
  }

  getScaleY() {
    let distances = this.props.activities.map(this.yAccessor);
    return scaleLinear()
      .domain([Math.min(...distances), Math.max(...distances)]).nice()
      .range([this.state.surfaceHeight * 0.95, this.state.surfaceHeight * 0.05]);
  }

  xAccessor(activity) {
    return new Date(activity.start_date_local);
  }

  yAccessor(activity) {
    return activity.distance;
  }

  updateStyleState() {
    let {height, width} = Dimensions.get('window');
    if (height > width) {
      this.state.flexDirection = 'column';
      this.state.surfaceHeight = height / 2;
      this.state.surfaceWidth = width;
    } else {
      this.state.flexDirection = 'row';
      this.state.surfaceHeight = height;
      this.state.surfaceWidth = width / 2;
    }
  }

  onLayout() {
    let oldFlexDirection = this.state.flexDirection;
    this.updateStyleState();
    if (oldFlexDirection != this.state.flexDirection) {
      this.setState(this.state);
    }
  }

  onStartShouldSetResponder(evt) {
    return true;
  }

  onMoveShouldSetResponder(evt) {
    return true;
  }

  onResponderMove(evt) {
    let scaleX = this.getScaleX();
    let locationX = evt.nativeEvent.locationX;
    let minDiff = Infinity;
    let idxMin = -1;
    for (i = 0; i < this.props.activities.length; i++) {
      let diff = Math.abs(locationX - scaleX(this.xAccessor(this.props.activities[i])));
      if (diff < minDiff) {
        minDiff = diff;
        idxMin = i;
      }
    }
    if (this.state.selectedActivityIndex != idxMin) {
      this.state.selectedActivityIndex = idxMin;
      this.setState(this.state);
    }
  }

  openLink() {
    let url = 'https://www.strava.com/activities/' +
      this.props.activities[this.state.selectedActivityIndex].id;
    Linking.openURL(url);
  }

  render() {
    let scaleX = this.getScaleX();
    let scaleY = this.getScaleY();
    let shape = this.getShape(scaleX, scaleY);
    let selectedActivity = this.props.activities[this.state.selectedActivityIndex];
    let start_date_local = selectedActivity.start_date_local;
    let distances = this.props.activities.map(this.yAccessor);
    let lowDistance = Math.min(...distances);
    let upDistance = Math.max(...distances);

    return (
      <View onLayout={this.onLayout.bind(this)}
            style={{flex: 1, flexDirection: this.state.flexDirection}} >
        <View
            style={[connectPageStyles.container, {flex: 0.5, backgroundColor: 'white'}]}
            onStartShouldSetResponder={this.onStartShouldSetResponder}
            onMoveShouldSetResponder={this.onMoveShouldSetResponder}
            onResponderMove={this.onResponderMove.bind(this)} >
          <Surface height={this.state.surfaceHeight} width={this.state.surfaceWidth} >
              <Shape 
                d={shape(this.props.activities)}
                stroke='black'
                strokeWidth={1} />
              <Shape 
                d={shape([selectedActivity, selectedActivity])}
                stroke='blue'
                strokeWidth={5} />
              <Shape 
                d={shape([{start_date_local, distance: lowDistance}, {start_date_local, distance: upDistance}])}
                // stroke='#a9a9a9'
                stroke='red'
                strokeWidth={1} />
          </Surface>
        </View>
        <View style={[connectPageStyles.container, {flex: 0.5}]}>
          <Text>{selectedActivity.name}</Text>
          <Text>{Math.round(selectedActivity.distance/100)/10} km</Text>
          <Text>{selectedActivity.start_date_local}</Text>
          <TouchableOpacity onPress={this.openLink.bind(this)}>
            <Text style={{color: 'blue', fontSize: 16}}>View activity on Strava</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
