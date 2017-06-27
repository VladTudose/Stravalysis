import { AsyncStorage } from 'react-native';

const STRAVA_ACCESS_TOKEN_STORAGE_KEY = 'strava_access_token';

export default stravaAccessTokenStorage = {
  async get() {
    return AsyncStorage.getItem(STRAVA_ACCESS_TOKEN_STORAGE_KEY);
  },

  async set(stravaAccessToken) {
    AsyncStorage.setItem(STRAVA_ACCESS_TOKEN_STORAGE_KEY, stravaAccessToken);
  },

  async remove() {
    AsyncStorage.removeItem(STRAVA_ACCESS_TOKEN_STORAGE_KEY);
  }
};
