import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  WebView,
} from 'react-native';
import Button from 'react-native-button';
import PropTypes from 'prop-types';
import {
  ACTIVITY_TYPE_CYCLING,
  ACTIVITY_TYPE_RUNNING,
  MAP_METRIC_LABEL,
} from '../utils/consts';

const uri = 'https://facebook.github.io/react-native/docs/getting-started.html';

function patchPostMessage() {
  let originalPostMessage = window.postMessage;
  let patchedPostMessage = function(message, targetOrigin, transfer) { 
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function() { 
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };
  window.postMessage = patchedPostMessage;
};

export default class ActivitiesChart extends Component {
  isLandscape() {
    let {height, width} = Dimensions.get('window');
    return height < width;
  }

  doJsStuff(activities, days, metric) {
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    }

    function disableScroll() {
      if (window.addEventListener) window.addEventListener('DOMMouseScroll', preventDefault, false);
      window.onwheel = preventDefault;
      window.onmousewheel = document.onmousewheel = preventDefault;
      window.ontouchmove = preventDefault;
      document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
      if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }

    var ctx = document.getElementById("myChart");
    var myChart = buildChartHelper(activities, days, metric, 3);

    ctx.onclick = function (evt) {
      window.postMessage('SMC', '*');
    };

    disableScroll();
  }

  getChartHtml() {
    let respondingComponent = this.props.respondingComponent; 
    let activities = respondingComponent.state.activities;
    let days = respondingComponent.props.days;
    let metric = respondingComponent.props.metric;
    let jsCode = `(${String(this.doJsStuff)})(${JSON.stringify(activities)}, ${days}, '${metric}');`;
    return `<html>
<header>
</header>
<body>
<h1 style="display:none">${this.isLandscape()}</h1>
<div id="parentMyChart">
  <canvas id="myChart"></canvas>
</div>
</body>
<script src="https://zomer-tech.com/stravalysis/js/chart.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-route.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-cookies.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.bundle.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-sanitize.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script>${jsCode}</script>
</html>`;
  }

  respondMessage(event) {
    console.log(event.nativeEvent.data);
  }

  render() {
    return (
      <WebView
        source={{html: this.getChartHtml()}}
        onMessage={this.respondMessage}
        injectedJavaScript={`(${String(patchPostMessage)})();`}/>
    );
  }
}

ActivitiesChart.propTypes = {
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
