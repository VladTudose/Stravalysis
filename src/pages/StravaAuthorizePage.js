import React, { Component } from 'react';
import { WebView, KeyboardAvoidingView } from 'react-native';
import parse from 'url-parse';
import StatsPage from './StatsPage';
import ViewLoading from '../components/ViewLoading'
import stravaAccessTokenStorage from '../utils/stravaAccessTokenStorage';

const STRAVALYSIS_STRAVA_CLIENT_ID = 18173;
const STRAVALYSIS_STRAVA_CLIENT_SECRET = '532a8341866f0855a49bd72de029c4e74f4f2b7b';
const REDIRECT_URI = 'http://zomer-tech.com/strava_authorize_redirect';

const STRAVA_AUTHORIZE_URL = 'https://www.strava.com/oauth/authorize?response_type=code' +
                             `&client_id=${STRAVALYSIS_STRAVA_CLIENT_ID}` +
                             `&redirect_uri=${REDIRECT_URI}`;

const PARTIAL_STRAVA_GET_ACCESS_TOKEN_URL = 'https://www.strava.com/oauth/token' +
                                            `?client_id=${STRAVALYSIS_STRAVA_CLIENT_ID}` +
                                            `&client_secret=${STRAVALYSIS_STRAVA_CLIENT_SECRET}` +
                                            '&code=';

export default class StravaAuthorizePage extends Component {
  state = {isLoading: false};

  onNavigationStateChange(event) {
    let url = parse(event.url, true);
    if (url.href.startsWith(REDIRECT_URI)) {
      this.setState({isLoading: true});
      this.getStravaAccessToken(url.query.code);
    }
  }

  async getStravaAccessToken(code) {
    let response = await fetch(PARTIAL_STRAVA_GET_ACCESS_TOKEN_URL + code, {
      method: 'POST'
    });
    let stravaAccessToken = (await response.json()).access_token;
    this.setState({stravaAccessToken});
    await stravaAccessTokenStorage.set(stravaAccessToken);
    console.log('Strava access token saved to store: ' + stravaAccessToken);
  }

  render() {
    let stravaAccessToken = this.state.stravaAccessToken;
    if (stravaAccessToken != null) {
      return <StatsPage stravaAccessToken={stravaAccessToken}/>;
    }
    return (this.state.isLoading ?
      <ViewLoading/> :
      <KeyboardAvoidingView style={{flex: 1}} behavior='position' contentContainerStyle={{flex: 1}}>
        <WebView
          source={{uri: STRAVA_AUTHORIZE_URL}}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}/>
      </KeyboardAvoidingView>
    );
  }
}
