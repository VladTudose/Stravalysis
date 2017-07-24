import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import commonStyles from '../utils/commonStyles';

export default class ViewLoading extends Component {
  render() {
    return (
      <View style={commonStyles.container}>
        <ActivityIndicator size='large'/>
      </View>
    );
  }
}
