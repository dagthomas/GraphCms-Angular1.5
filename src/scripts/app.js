// Import Angular and Angular Modules
import angular from "angular";
import uiRouter from "angular-ui-router";
import ngMaterial from "angular-material";
import ngSanitize from "angular-sanitize";

// Import our filters, services, controllers, etc..
import GetCMSData from './components/graphcms.service.js';
import TrustFilter from './components/trustedhtml.filter.js';

// Import our partials into .js
import newArticle from '../partials/new.html';
import newsSingle from '../partials/news.html';
import newsList from '../partials/newslist.html';

// Import our .css classes
import "angular-material/angular-material.css";
import "../styles/app.scss";

(function () {
  'use strict';
  angular.module("dtoApp", [ngMaterial, ngSanitize, uiRouter])
    .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$compileProvider', '$sceDelegateProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $compileProvider, $sceDelegateProvider) {

      // Set default route to /newslist
      $urlRouterProvider.otherwise("/newslist");

      // Managing states with Angular UI Router
      $stateProvider
        .state('newslist', {
          url: "/newslist",
          template: newsList, 
          controller: "GraphCMS"
        })
        .state('news', {
          url: "/news/:id/:title",
          template: newsSingle, 
          controller: "GraphCMS"
        })
        .state('new', {
          url: "/new",
          template: newArticle, 
          controller: "GraphCMS"
        });
    }])
    .controller("GraphCMS", ['$scope', 'getCMSData', '$stateParams', '$mdDialog', function ($scope, getCMSData, $stateParams, $mdDialog) {

      // Just a function to lowercase, underline the titles in the url 
      $scope.replaceTitle = function (string) {
        return string.replace(/ /g, "_").toLowerCase();
      }

      // Sending an item to the GraphCMS
      $scope.sendItem = function (item) {
        var missing = {};
        if (item.title && item.body) {
          $scope.graphCMSQuery('mutation { createNews(title:"' + item.title + '", body:"' + item.body + '") { id title body } }', 'newsCreated', 'createNews')
        } else {
          $scope.showAlert('You have to fill out all the fields', 'Error');
        }
      }
      $scope.showAlert = function (message, type) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(type)
          .textContent(message)
          .ariaLabel(type + ' dialog')
          .ok('Got it!')
        );
      };
      // Create a dynamic function for callbacks from GraphCMS
      $scope.graphCMSQuery = function (query, container, objects) {
        getCMSData.graphCMSQuery(query).then(
          function (answer) {
            $scope[container] = answer.data.data[objects];
            if (answer.data.errors) {
              $scope.showAlert(answer.data.errors[0].message, 'Error');
            }
            if (answer.data.data.createNews) {
              $scope.showAlert('Post successfully created', 'Success');
              delete $scope.article;
            }
          },
          function (reason) {
            if (reason.data.errors) {
              $scope.showAlert(reason.data.errors[0].message, 'Error');
            }
            $scope.error = reason.data.errors[0].message;
          }
        );
      }

      // Posts Query, Container (Scope name) and CMS Objects
      $scope.graphCMSQuery('{allNews { id createdAt title }}', 'news', 'allNews');

      // If there is a stateparameter called id, get specific news object
      if ($stateParams.id) {
        $scope.graphCMSQuery('{ News(id: "' + $stateParams.id + '") { id title createdAt body media { url } } }', 'singleitem', 'News');
      }
    }])
    // Load our filters, services, controllers, etc..
    .service('getCMSData', GetCMSData)
    .filter('trustFilter', TrustFilter);
})();
