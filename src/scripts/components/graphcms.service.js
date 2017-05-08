// GraphCMS Endpoint
var endpoint = 'https://api.graphcms.com/simple/v1/dagscms';

export default class GetCMSData {
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  // Service for getting data from GraphCMS
  graphCMSQuery(query) {

    var vars = {};
    var data = JSON.stringify({
      query,
      vars
    });
    var promise = this.$http.post(endpoint, data),
      deferObject = deferObject || this.$q.defer();
    promise.then(
      function (answer) {
        deferObject.resolve(answer);
      },
      function (reason) {
        deferObject.reject(reason);
      });

    return deferObject.promise;
  }
}

GetCMSData.$inject = ['$http', '$q'];
