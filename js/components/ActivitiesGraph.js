import React, { Component } from 'react';
import {
  ART,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import Button from 'react-native-button';
import PropTypes from 'prop-types';
import { scaleTime, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import {
  ACTIVITY_TYPE_CYCLING,
  ACTIVITY_TYPE_RUNNING,
  MAP_METRIC_LABEL,
} from '../utils/consts';

const {
  Group,
  Shape,
  Surface,
} = ART;

export default class ActivitiesGraph extends Component {
  state = {
    height: 100,
    width: 100,
  };

  getShape(scaleX, scaleY) {
    return line()
      .x(d => scaleX(this.xAccessor(d)))
      .y(d => scaleY(this.yAccessor(d)));
  }

  getScaleX() {
    return scaleLinear()
      .domain([0, this.props.respondingComponent.props.days - 1]).nice()
      .range([this.state.width * 0.05, this.state.width * 0.95]);
  }

  getScaleY() {
    let values = this.props.respondingComponent.state.activitiesByDay.map(this.yAccessor.bind(this));
    return scaleLinear()
      .domain([0, Math.max(...values)]).nice()
      .range([this.state.height * 0.95, this.state.height * 0.05]);
  }

  xAccessor(activitiesInDay) {
    return activitiesInDay[0];
  }

  yAccessor(activitiesInDay) {
    var sum = 0;
    for (var i = 0; i < activitiesInDay[1].length; i++) {
      sum += activitiesInDay[1][i][this.props.respondingComponent.props.metric];
    }
    return sum;
  }

  onLayout(event) {
    let height = event.nativeEvent.layout.height;
    let width = event.nativeEvent.layout.width; 
    if (this.state.height !== height || this.state.width !== width) {
      this.setState({height, width});
    }
  }

  onStartShouldSetResponder(event) {
    return true;
  }

  onMoveShouldSetResponder(event) {
    return true;
  }

  onResponderMove(event) {
    let scaleX = this.getScaleX();
    let locationX = event.nativeEvent.locationX;
    let minDiff = Infinity;
    let idxMin = -1;
    let respondingComponent = this.props.respondingComponent;
    let activitiesByDay = respondingComponent.state.activitiesByDay;
    for (i = 0; i < activitiesByDay.length; i++) {
      let diff = Math.abs(locationX - scaleX(this.xAccessor(activitiesByDay[i])));
      if (diff < minDiff) {
        minDiff = diff;
        idxMin = i;
      }
    }
    if (respondingComponent.state.selectedDay != idxMin) {
      respondingComponent.state.selectedDay = idxMin;
      respondingComponent.setState(respondingComponent.state);
    }
  }

  render() {
    console.log('render ActivitiesGraph');
    let scaleX = this.getScaleX();
    let scaleY = this.getScaleY();
    let shape = this.getShape(scaleX, scaleY);
    let respondingComponent = this.props.respondingComponent;
    let day = respondingComponent.state.activitiesByDay[respondingComponent.state.selectedDay];
    let verticalLine = line().x(d => scaleX(d[0])).y(d => scaleY(d[1]))(
      [[respondingComponent.state.selectedDay, 0], [respondingComponent.state.selectedDay, 100000000]]);

    return (
      <View style={styles.container}
            onLayout ={this.onLayout.bind(this)}
            onStartShouldSetResponder={this.onStartShouldSetResponder}
            onMoveShouldSetResponder={this.onMoveShouldSetResponder}
            onResponderMove={this.onResponderMove.bind(this)}>
        <Surface height={this.state.height} width={this.state.width}>
            <Shape 
              d={shape(respondingComponent.state.activitiesByDay)}
              stroke='black'
              strokeWidth={1}/>
            <Shape 
              d={shape([day, day])}
              stroke='blue'
              strokeWidth={5}/>
            <Shape 
              d={verticalLine}
              stroke='red'
              strokeWidth={1}/>
        </Surface>
      </View>
    );
  }
}

ActivitiesGraph.propTypes = {
  respondingComponent: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  logoutContainer: {
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  selectButtonContainer: {
    backgroundColor: 'cornsilk',
    marginLeft: 3,
  },
  logoutButtonContainer: {
    backgroundColor: 'cornflowerblue',
    marginRight: 3
  },
  button: {
    padding: 3,
    fontSize: 8,
  },
  logoutButton: {
    color: 'black',
    fontSize: 12,
  },
  transparent: {
    opacity: 0.5,
  },
  chart: {
    width: 200,
    height: 200,
  },
});
