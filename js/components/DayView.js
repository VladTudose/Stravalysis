import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import PropTypes from 'prop-types';
import {
  ACTIVITY_TYPE_CYCLING,
  ACTIVITY_TYPE_RUNNING,
  MAP_METRIC_LABEL,
} from '../utils/consts';

export default class DayView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Day view for day index {this.props.respondingComponent.state.selectedDay}</Text>
      </View>
    );
  }
}

DayView.propTypes = {
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
  }
});
