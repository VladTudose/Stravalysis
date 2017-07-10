import React, { Component } from 'react';
import {
  ART,
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

const {
  Group,
  Shape,
  Surface,
} = ART;

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

export default class ActivitiesGraph2 extends Component {
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
    var myChart = buildChartHelper(activities, days, metric);

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
<canvas id="myChart"></canvas>
</body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.6.0/Chart.bundle.min.js"></script>
<script src="https://zomer-tech.com/stravalysis/js/chart.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
<script>${jsCode}</script>
</html>`;
  }

  respondMessage(event) {
    console.log(event.nativeEvent.data);
  }

  render() {
    // console.log(`chart HTML: ${this.getChartHtml()}`);
    return (
      <WebView
        source={{html: this.getChartHtml()}}
        onMessage={this.respondMessage}
        injectedJavaScript={`(${String(patchPostMessage)})();`} />
    );
  }
}

ActivitiesGraph2.propTypes = {
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
