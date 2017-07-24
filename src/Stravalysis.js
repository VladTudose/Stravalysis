import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import ConnectPage from './pages/ConnectPage';
import StatsPage from './pages/StatsPage';
import ViewLoading from './components/ViewLoading';
import stravaAccessTokenStorage from './utils/stravaAccessTokenStorage';

export default class Stravalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: true};
    this.fetchStravaAccessTokenFromStorage();
  }

  async fetchStravaAccessTokenFromStorage() {
    let stravaAccessToken = await stravaAccessTokenStorage.get();
    console.log('Strava access token fetched from storage: ' + stravaAccessToken);
    this.setState({isLoading: false, stravaAccessToken});
  }

  getComponent() {
    if (this.state.isLoading) {
      return <ViewLoading/>;
    }
    let stravaAccessToken = this.state.stravaAccessToken;
    return stravaAccessToken == null ?
      <ConnectPage/> :
      <StatsPage stravaAccessToken={stravaAccessToken}/>;
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden/>
        {this.getComponent()}
      </View>
    );
  }
}
