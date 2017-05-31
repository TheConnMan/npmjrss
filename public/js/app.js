var app = angular.module('app', ['angularMoment']);
app.controller('controller', function($scope, $http, $location) {

  $scope.package = $location.search().package || 'express';
  $scope.include = $location.search().include;
  $scope.exclude = $location.search().exclude;

  $scope.fetchFeed = function() {
    $scope.loading = true;
    $scope.error = false;
    $scope.url = '';
    $http({
      url: '/package/' + $scope.package,
      transformResponse: function(data) {
        return new X2JS().xml_str2json(data);
      }
    }).then(({data, status, headers, config}) => {
      if (!Array.isArray(data.rss.channel.item)) {
        data.rss.channel.item = [data.rss.channel.item];
      }
      $scope.feed = data.rss.channel;
      var queryParams = Object.keys(config.params || {}).reduce((array, key) => {
        if (config.params[key]) {
          array.push(key + '=' + config.params[key]);
        }
        return array;
      }, []);
      $scope.url = window.location.origin + config.url + (queryParams.length > 0 ? '?' + queryParams.join('&') : '');
      $scope.loading = false;
      $location.search({
        package: $scope.package
      });
    }).catch(error => {
      $scope.loading = false;
      $scope.error = true;
    });
  };

  $scope.fetchFeed();
});
