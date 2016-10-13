/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * EDITING INSTRUCTIONS
 * This file was generated from the file
 * https://github.com/googleapis/googleapis/blob/master/google/cloud/functions/v1beta2/functions.proto,
 * and updates to that file get reflected here through a refresh process.
 * For the short term, the refresh process will only be runnable by Google
 * engineers.
 *
 * The only allowed edits are to method and file documentation. A 3-way
 * merge preserves those additions if the generated source changes.
 */
/* TODO: introduce line-wrapping so that it never exceeds the limit. */
/* jscs: disable maximumLineLength */
'use strict';

var configData = require('./cloud_functions_service_client_config');
var extend = require('extend');
var gax = require('google-gax');

var SERVICE_ADDRESS = 'cloudfunctions.googleapis.com';

var DEFAULT_SERVICE_PORT = 443;

var CODE_GEN_NAME_VERSION = 'gapic/0.1.0';

var DEFAULT_TIMEOUT = 30;

var PAGE_DESCRIPTORS = {
  listFunctions: new gax.PageDescriptor(
      'page_token',
      'next_page_token',
      'functions')
};

/**
 * The scopes needed to make gRPC calls to all of the methods defined in
 * this service.
 */
var ALL_SCOPES = [
  'https://www.googleapis.com/auth/cloud-platform'
];

/**
 * A service that application uses to manipulate triggers and functions.
 *
 * This will be created through a builder function which can be obtained by the module.
 * See the following example of how to initialize the module and how to access to the builder.
 * @see {@link cloudFunctionsServiceApi}
 *
 * @example
 * var functionsV1beta2 = require('@google-cloud/functions').v1beta2({
 *   // optional auth parameters.
 * });
 * var api = functionsV1beta2.cloudFunctionsServiceApi();
 *
 * @class
 */
function CloudFunctionsServiceApi(gaxGrpc, grpcClients, opts) {
  opts = opts || {};
  var servicePath = opts.servicePath || SERVICE_ADDRESS;
  var port = opts.port || DEFAULT_SERVICE_PORT;
  var sslCreds = opts.sslCreds || null;
  var clientConfig = opts.clientConfig || {};
  var timeout = opts.timeout || DEFAULT_TIMEOUT;
  var appName = opts.appName || 'gax';
  var appVersion = opts.appVersion || gax.version;

  var googleApiClient = [
    appName + '/' + appVersion,
    CODE_GEN_NAME_VERSION,
    'gax/' + gax.version,
    'nodejs/' + process.version].join(' ');

  var defaults = gaxGrpc.constructSettings(
      'google.cloud.functions.v1beta2.CloudFunctionsService',
      configData,
      clientConfig,
      timeout,
      PAGE_DESCRIPTORS,
      null,
      {'x-goog-api-client': googleApiClient});

  var cloudFunctionsServiceStub = gaxGrpc.createStub(
      servicePath,
      port,
      grpcClients.cloudFunctionsServiceClient.google.cloud.functions.v1beta2.CloudFunctionsService,
      {sslCreds: sslCreds});
  var cloudFunctionsServiceStubMethods = [
    'listFunctions',
    'getFunction',
    'createFunction',
    'updateFunction',
    'deleteFunction',
    'callFunction'
  ];
  cloudFunctionsServiceStubMethods.forEach(function(methodName) {
    this['_' + methodName] = gax.createApiCall(
      cloudFunctionsServiceStub.then(function(cloudFunctionsServiceStub) {
        return cloudFunctionsServiceStub[methodName].bind(cloudFunctionsServiceStub);
      }),
      defaults[methodName]);
  }.bind(this));
}

// Path templates

var LOCATION_PATH_TEMPLATE = new gax.PathTemplate(
    'projects/{project}/locations/{location}');

var FUNCTION_PATH_TEMPLATE = new gax.PathTemplate(
    'projects/{project}/locations/{location}/functions/{function}');

/**
 * Returns a fully-qualified location resource name string.
 * @param {String} project
 * @param {String} location
 * @returns {String}
 */
CloudFunctionsServiceApi.prototype.locationPath = function locationPath(project, location) {
  return LOCATION_PATH_TEMPLATE.render({
    project: project,
    location: location
  });
};

/**
 * Parses the locationName from a location resource.
 * @param {String} locationName
 *   A fully-qualified path representing a location resources.
 * @returns {String} - A string representing the project.
 */
CloudFunctionsServiceApi.prototype.matchProjectFromLocationName =
    function matchProjectFromLocationName(locationName) {
  return LOCATION_PATH_TEMPLATE.match(locationName).project;
};

/**
 * Parses the locationName from a location resource.
 * @param {String} locationName
 *   A fully-qualified path representing a location resources.
 * @returns {String} - A string representing the location.
 */
CloudFunctionsServiceApi.prototype.matchLocationFromLocationName =
    function matchLocationFromLocationName(locationName) {
  return LOCATION_PATH_TEMPLATE.match(locationName).location;
};

/**
 * Returns a fully-qualified function resource name string.
 * @param {String} project
 * @param {String} location
 * @param {String} function
 * @returns {String}
 */
CloudFunctionsServiceApi.prototype.functionPath = function functionPath(project, location, function_) {
  return FUNCTION_PATH_TEMPLATE.render({
    project: project,
    location: location,
    function: function_
  });
};

/**
 * Parses the functionName from a function resource.
 * @param {String} functionName
 *   A fully-qualified path representing a function resources.
 * @returns {String} - A string representing the project.
 */
CloudFunctionsServiceApi.prototype.matchProjectFromFunctionName =
    function matchProjectFromFunctionName(functionName) {
  return FUNCTION_PATH_TEMPLATE.match(functionName).project;
};

/**
 * Parses the functionName from a function resource.
 * @param {String} functionName
 *   A fully-qualified path representing a function resources.
 * @returns {String} - A string representing the location.
 */
CloudFunctionsServiceApi.prototype.matchLocationFromFunctionName =
    function matchLocationFromFunctionName(functionName) {
  return FUNCTION_PATH_TEMPLATE.match(functionName).location;
};

/**
 * Parses the functionName from a function resource.
 * @param {String} functionName
 *   A fully-qualified path representing a function resources.
 * @returns {String} - A string representing the function.
 */
CloudFunctionsServiceApi.prototype.matchFunctionFromFunctionName =
    function matchFunctionFromFunctionName(functionName) {
  return FUNCTION_PATH_TEMPLATE.match(functionName).function;
};

// Service calls

/**
 * Returns a list of functions that belong to the requested project.
 *
 * @param {string} location
 *   The project and location from which the function should be listed,
 *   specified in the format: projects/[PROJECT]/locations/[LOCATION]
 *   If you want to list functions in all locations, use '-' in place of a
 *   location.
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 *
 *   In addition, options may contain the following optional parameters.
 * @param {number=} options.pageSize
 *   The maximum number of resources contained in the underlying API
 *   response. If page streaming is performed per-resource, this
 *   parameter does not affect the return value. If page streaming is
 *   performed per-page, this determines the maximum number of
 *   resources in a page.
 *
 * @param {function(?Error, ?Object, ?string)=} callback
 *   When specified, the results are not streamed but this callback
 *   will be called with the response object representing [ListFunctionsResponse]{@link ListFunctionsResponse}.
 *   The third item will be set if the response contains the token for the further results
 *   and can be reused to `pageToken` field in the options in the next request.
 * @returns {Stream|gax.EventEmitter}
 *   An object stream which emits an object representing
 *   [CloudFunction]{@link CloudFunction} on 'data' event.
 *   When the callback is specified or streaming is suppressed through options,
 *   it will return an event emitter to handle the call status and the callback
 *   will be called with the response object.
 *
 * @example
 *
 * var api = functionsV1beta2.cloudFunctionsServiceApi();
 * var formattedLocation = api.locationPath("[PROJECT]", "[LOCATION]");
 * // Iterate over all elements.
 * api.listFunctions(formattedLocation).on('data', function(element) {
 *     // doThingsWith(element)
 * });
 *
 * // Or obtain the paged response through the callback.
 * function callback(err, response, nextPageToken) {
 *     if (err) {
 *         console.error(err);
 *         return;
 *     }
 *     // doThingsWith(response)
 *     if (nextPageToken) {
 *         // fetch the next page.
 *         api.listFunctions(formattedLocation, {pageToken: nextPageToken}, callback);
 *     }
 * }
 * api.listFunctions(formattedLocation, {flattenPages: false}, callback);
 */
CloudFunctionsServiceApi.prototype.listFunctions = function listFunctions(
    location,
    options,
    callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  var req = {
    location: location
  };
  if ('pageSize' in options) {
    req.page_size = options.pageSize;
  }
  return this._listFunctions(req, options, callback);
};

/**
 * Returns a function with the given name from the requested project.
 *
 * @param {string} name
 *   The name of the function which details should be obtained.
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error, ?Object)=} callback
 *   The function which will be called with the result of the API call.
 *
 *   The second parameter to the callback is an object representing [CloudFunction]{@link CloudFunction}
 * @returns {gax.EventEmitter} - the event emitter to handle the call
 *   status.
 *
 * @example
 *
 * var api = functionsV1beta2.cloudFunctionsServiceApi();
 * var formattedName = api.functionPath("[PROJECT]", "[LOCATION]", "[FUNCTION]");
 * api.getFunction(formattedName, function(err, response) {
 *     if (err) {
 *         console.error(err);
 *         return;
 *     }
 *     // doThingsWith(response)
 * });
 */
CloudFunctionsServiceApi.prototype.getFunction = function getFunction(
    name,
    options,
    callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  var req = {
    name: name
  };
  return this._getFunction(req, options, callback);
};

/**
 * Creates a new function. If a function with the given name already exists in
 * the specified project, it will return ALREADY_EXISTS error.
 *
 * @param {string} location
 *   The project and location in which the function should be created, specified
 *   in the format: projects/[PROJECT]/locations/[LOCATION]
 * @param {Object} function_
 *   Function to be created.
 *
 *   This object should have the same structure as [CloudFunction]{@link CloudFunction}
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error, ?Object)=} callback
 *   The function which will be called with the result of the API call.
 *
 *   The second parameter to the callback is an object representing [google.longrunning.Operation]{@link external:"google.longrunning.Operation"}
 * @returns {gax.EventEmitter} - the event emitter to handle the call
 *   status.
 *
 * @example
 *
 * var api = functionsV1beta2.cloudFunctionsServiceApi();
 * var formattedLocation = api.locationPath("[PROJECT]", "[LOCATION]");
 * var function = {};
 * api.createFunction(formattedLocation, function, function(err, response) {
 *     if (err) {
 *         console.error(err);
 *         return;
 *     }
 *     // doThingsWith(response)
 * });
 */
CloudFunctionsServiceApi.prototype.createFunction = function createFunction(
    location,
    function_,
    options,
    callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  var req = {
    location: location,
    function: function_
  };
  return this._createFunction(req, options, callback);
};

/**
 * Updates existing function.
 *
 * @param {string} name
 *   The name of the function to be updated.
 * @param {Object} function_
 *   New version of the function.
 *
 *   This object should have the same structure as [CloudFunction]{@link CloudFunction}
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error, ?Object)=} callback
 *   The function which will be called with the result of the API call.
 *
 *   The second parameter to the callback is an object representing [google.longrunning.Operation]{@link external:"google.longrunning.Operation"}
 * @returns {gax.EventEmitter} - the event emitter to handle the call
 *   status.
 *
 * @example
 *
 * var api = functionsV1beta2.cloudFunctionsServiceApi();
 * var formattedName = api.functionPath("[PROJECT]", "[LOCATION]", "[FUNCTION]");
 * var function = {};
 * api.updateFunction(formattedName, function, function(err, response) {
 *     if (err) {
 *         console.error(err);
 *         return;
 *     }
 *     // doThingsWith(response)
 * });
 */
CloudFunctionsServiceApi.prototype.updateFunction = function updateFunction(
    name,
    function_,
    options,
    callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  var req = {
    name: name,
    function: function_
  };
  return this._updateFunction(req, options, callback);
};

/**
 * Deletes a function with the given name from the specified project. If the
 * given function is used by some trigger, the trigger will be updated to
 * remove this function.
 *
 * @param {string} name
 *   The name of the function which should be deleted.
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error, ?Object)=} callback
 *   The function which will be called with the result of the API call.
 *
 *   The second parameter to the callback is an object representing [google.longrunning.Operation]{@link external:"google.longrunning.Operation"}
 * @returns {gax.EventEmitter} - the event emitter to handle the call
 *   status.
 *
 * @example
 *
 * var api = functionsV1beta2.cloudFunctionsServiceApi();
 * var formattedName = api.functionPath("[PROJECT]", "[LOCATION]", "[FUNCTION]");
 * api.deleteFunction(formattedName, function(err, response) {
 *     if (err) {
 *         console.error(err);
 *         return;
 *     }
 *     // doThingsWith(response)
 * });
 */
CloudFunctionsServiceApi.prototype.deleteFunction = function deleteFunction(
    name,
    options,
    callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  var req = {
    name: name
  };
  return this._deleteFunction(req, options, callback);
};

/**
 * Invokes synchronously deployed function. To be used for testing, very
 * limited traffic allowed.
 *
 * @param {string} name
 *   The name of the function to be called.
 * @param {string} data
 *   Input to be passed to the function.
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error, ?Object)=} callback
 *   The function which will be called with the result of the API call.
 *
 *   The second parameter to the callback is an object representing [CallFunctionResponse]{@link CallFunctionResponse}
 * @returns {gax.EventEmitter} - the event emitter to handle the call
 *   status.
 *
 * @example
 *
 * var api = functionsV1beta2.cloudFunctionsServiceApi();
 * var formattedName = api.functionPath("[PROJECT]", "[LOCATION]", "[FUNCTION]");
 * var data = '';
 * api.callFunction(formattedName, data, function(err, response) {
 *     if (err) {
 *         console.error(err);
 *         return;
 *     }
 *     // doThingsWith(response)
 * });
 */
CloudFunctionsServiceApi.prototype.callFunction = function callFunction(
    name,
    data,
    options,
    callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  var req = {
    name: name,
    data: data
  };
  return this._callFunction(req, options, callback);
};

function CloudFunctionsServiceApiBuilder(gaxGrpc) {
  if (!(this instanceof CloudFunctionsServiceApiBuilder)) {
    return new CloudFunctionsServiceApiBuilder(gaxGrpc);
  }

  var cloudFunctionsServiceClient = gaxGrpc.load([{
    root: require('google-proto-files')('..'),
    file: 'google/cloud/functions/v1beta2/functions.proto'
  }]);
  extend(this, cloudFunctionsServiceClient.google.cloud.functions.v1beta2);

  var grpcClients = {
    cloudFunctionsServiceClient: cloudFunctionsServiceClient
  };

  /**
   * Build a new instance of {@link CloudFunctionsServiceApi}.
   *
   * @param {Object=} opts - The optional parameters.
   * @param {String=} opts.servicePath
   *   The domain name of the API remote host.
   * @param {number=} opts.port
   *   The port on which to connect to the remote host.
   * @param {grpc.ClientCredentials=} opts.sslCreds
   *   A ClientCredentials for use with an SSL-enabled channel.
   * @param {Object=} opts.clientConfig
   *   The customized config to build the call settings. See
   *   {@link gax.constructSettings} for the format.
   * @param {number=} opts.timeout
   *   The default timeout, in seconds, for calls made through this client.
   * @param {number=} opts.appName
   *   The codename of the calling service.
   * @param {String=} opts.appVersion
   *   The version of the calling service.
   */
  this.cloudFunctionsServiceApi = function(opts) {
    return new CloudFunctionsServiceApi(gaxGrpc, grpcClients, opts);
  };
  extend(this.cloudFunctionsServiceApi, CloudFunctionsServiceApi);
}
module.exports = CloudFunctionsServiceApiBuilder;
module.exports.SERVICE_ADDRESS = SERVICE_ADDRESS;
module.exports.ALL_SCOPES = ALL_SCOPES;
