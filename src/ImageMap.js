export default {
  ImageMap(map) {
    var n,
      areas = map.getElementsByTagName("area"),
      len = areas.length,
      coords = [],
      previousWidth = 3840;
    for (n = 0; n < len; n++) {
      coords[n] = areas[n].coords.split(",");
    }
    this.resize = function () {
      var n,
        m,
        clen,
        x = document.body.clientWidth / previousWidth;
      for (n = 0; n < len; n++) {
        clen = coords[n].length;
        for (m = 0; m < clen; m++) {
          coords[n][m] *= x;
        }
        areas[n].coords = coords[n].join(",");
      }
      previousWidth = document.body.clientWidth;
      return true;
    };
  },
};
