import React, { Component } from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from 'react-native-button';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import {
  ACTIVITY_TYPE_CYCLING,
  ACTIVITY_TYPE_RUNNING,
  MAP_METRIC_LABEL,
  SECONDS_IN_DAY,
} from '../utils/consts';

export default class DayView extends Component {
  getTotalForDay() {
    let state = this.props.respondingComponent.state;
    let activitiesInDay = state.activitiesByDay[state.selectedDay];
    let sum = 0;
    for (let i = 0; i < activitiesInDay[1].length; i++) {
      sum += activitiesInDay[1][i][this.props.respondingComponent.props.metric];
    }
    return sum;
  }

  renderActivity({item}) {
    return (
      <Button onPress={() => Linking.openURL(`https://www.strava.com/activities/${item.id}`)}>
        {item.name}
      </Button>
    );
  }

  render() {
    let state = this.props.respondingComponent.state;
    let day = new Date((state.after + state.selectedDay * SECONDS_IN_DAY) * 1000);
    return (
      <View style={styles.container}>
        <Text>Total for {dateFormat(day, 'd mmm yyyy')}: {this.getTotalForDay()}</Text>
        <FlatList
          data={state.activitiesByDay[state.selectedDay][1]}
          keyExtractor={(activity, _) => activity.id}
          renderItem={this.renderActivity.bind(this)}/>
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
