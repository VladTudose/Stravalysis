export const ACTIVITY_TYPE_CYCLING = 'Ride';
export const ACTIVITY_TYPE_RUNNING = 'Run';

export const METRIC_DISTANCE = 'distance';
export const METRIC_MOVING_TIME = 'moving_time';
export const METRIC_ELAPSED_TIME = 'elapsed_time';
export const METRIC_ELEVATION_GAIN = 'total_elevation_gain';
export const METRIC_MAX_ELEVATION = 'elev_high';
export const METRIC_AVERAGE_SPEED = 'average_speed';
export const METRIC_MAX_SPEED = 'max_speed';
export const METRIC_AVERAGE_CADENCE = 'average_cadence';
export const METRIC_AVERAGE_TEMP = 'average_temp';
export const METRIC_AVERAGE_WATTS = 'average_watts';
export const METRIC_MAX_WATTS = 'max_watts';
export const METRIC_WEIGHTED_AVERAGE_WATTS = 'weighted_average_watts';
export const METRIC_KILOJOULES = 'kilojoules';
export const METRIC_AVERAGE_HEARTRATE = 'average_heartrate';
export const METRIC_MAX_HEARTRATE = 'max_heartrate';
export const METRIC_CALORIES = 'calories';
export const METRIC_SUFFER_SCORE = 'suffer_score';

export const RUNNING_METRICS = [
  METRIC_DISTANCE,
  METRIC_MOVING_TIME,
  METRIC_ELAPSED_TIME,
  METRIC_ELEVATION_GAIN,
  METRIC_MAX_ELEVATION,
  METRIC_AVERAGE_SPEED,
  METRIC_MAX_SPEED,
  METRIC_AVERAGE_TEMP,
  METRIC_AVERAGE_HEARTRATE,
  METRIC_MAX_HEARTRATE,
  METRIC_CALORIES,
  METRIC_SUFFER_SCORE,
];

export const CYCLING_METRICS = RUNNING_METRICS.concat([
  METRIC_AVERAGE_CADENCE,
  METRIC_AVERAGE_WATTS,
  METRIC_MAX_WATTS,
  METRIC_WEIGHTED_AVERAGE_WATTS,
  METRIC_KILOJOULES,
]);

let mapMetricLabel = {};
mapMetricLabel[METRIC_DISTANCE] = 'Distance';
mapMetricLabel[METRIC_MOVING_TIME] = 'Moving time';
mapMetricLabel[METRIC_ELAPSED_TIME] = 'Elapsed time';
mapMetricLabel[METRIC_ELEVATION_GAIN] = 'Elevation gain';
mapMetricLabel[METRIC_MAX_ELEVATION] = 'Max elevation';
mapMetricLabel[METRIC_AVERAGE_SPEED] = 'Average speed';
mapMetricLabel[METRIC_MAX_SPEED] = 'Max speed';
mapMetricLabel[METRIC_AVERAGE_CADENCE] = 'Average cadence';
mapMetricLabel[METRIC_AVERAGE_TEMP] = 'Average temperature';
mapMetricLabel[METRIC_AVERAGE_WATTS] = 'Average watts';
mapMetricLabel[METRIC_MAX_WATTS] = 'Max watts';
mapMetricLabel[METRIC_WEIGHTED_AVERAGE_WATTS] = 'Weighted average watts';
mapMetricLabel[METRIC_KILOJOULES] = 'Kilojoules';
mapMetricLabel[METRIC_AVERAGE_HEARTRATE] = 'Average heartrate';
mapMetricLabel[METRIC_MAX_HEARTRATE] = 'Max heartrate';
mapMetricLabel[METRIC_CALORIES] = 'Calories';
mapMetricLabel[METRIC_SUFFER_SCORE] = 'Suffer score';

export const MAP_METRIC_LABEL = mapMetricLabel;
export const TIME_FRAME_DAYS = [10, 20, 30, 40, 50, 60, 70, 80, 90];
