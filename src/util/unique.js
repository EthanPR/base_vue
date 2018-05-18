function unique(arr) {

  var res = [arr[0]];

  for (var i = 1; i < arr.length; i++) {

    var repeat = false;

    for (var j = 0; j < res.length; j++) {

      if (arr[i] == res[j]) {

        repeat = true;

        break;

      }

    }

    if (!repeat) {

      res.push(arr[i]);

    }

  }

  return res;

}

export default {
  unique
}
