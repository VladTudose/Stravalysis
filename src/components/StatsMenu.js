import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {
  ACTIVITY_TYPE_CYCLING,
  ACTIVITY_TYPE_RUNNING,
  MAP_METRIC_LABEL,
} from '../utils/consts';

const ICONS_SIZE = 50;

export default class StatsMenu extends Component {
  setActivityType(activityType) {
    let respondingComponent = this.props.respondingComponent;
    let state = respondingComponent.state;
    if (state.activityType !== activityType) {
      state.activityType = activityType;
      respondingComponent.setState(state);
    }
  }

  render() {
    let respondingComponent = this.props.respondingComponent;
    let activityType = respondingComponent.state.activityType;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Button
            containerStyle={[styles.buttonContainer, styles.selectButtonContainer]}
            style={styles.button}
            onPress={() => respondingComponent.refs.metricModal.open()}>
            {MAP_METRIC_LABEL[respondingComponent.state.metric]}
          </Button>
          <Button
            containerStyle={[styles.buttonContainer, styles.selectButtonContainer]}
            style={styles.button}
            onPress={() => respondingComponent.refs.timeFrameModal.open()}>
            {respondingComponent.state.days} days
          </Button>
        </View>
        
        <Button onPress={() => this.setActivityType(ACTIVITY_TYPE_CYCLING)}>
          <MaterialIcons
            name='directions-bike'
            size={ICONS_SIZE}
            style={activityType === ACTIVITY_TYPE_CYCLING ? {} : styles.transparent}/>
        </Button>
        <Button onPress={() => this.setActivityType(ACTIVITY_TYPE_RUNNING)}>
          <MaterialIcons
            name='directions-run'
            size={ICONS_SIZE}
            style={activityType === ACTIVITY_TYPE_RUNNING ? {} : styles.transparent}/>
        </Button>
        
        <View style={[styles.subContainer, styles.logoutContainer]}>
          <Button
            containerStyle={[styles.buttonContainer, styles.logoutButtonContainer]}
            style={[styles.button, styles.logoutButton]}
            onPress={respondingComponent.logout.bind(respondingComponent)}>
            Logout
          </Button>
        </View>
      </View>
    );
  }
}

StatsMenu.propTypes = {
  respondingComponent: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
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
    padding: 6,
    fontSize: 16,
  },
  logoutButton: {
    color: 'black',
    fontSize: 16,
  },
  transparent: {
    opacity: 0.5,
  }
});
