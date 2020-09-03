var FloodDetector = (function () {
  var lz;
  if (typeof require !== 'undefined' && require != null) {
    lz = require('lz-string');
  } else if (typeof LZString !== 'undefined' && LZString != null) {
    lz = LZString;
  } else {
    console.error('Can\'t find LZString dependancy.');
  }

  var FloodDetector = {
    evaluate: function (string, _trigger) {
      var trigger = _trigger || 30;
      var size = string.length;
      var sizeCompressed = lz.compress(string).length;
      var taux = sizeCompressed / size * 100;
      if (taux > trigger) {
        return true;
      } else {
        return false;
      }
    }
  }
  return FloodDetector;
})();

if (typeof define === 'function' && define.amd) {
  define(function () {
    return FloodDetector;
  });
} else if (typeof module !== 'undefined' && module != null) {
  module.exports = FloodDetector;
}
