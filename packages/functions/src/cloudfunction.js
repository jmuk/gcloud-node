/*!
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*!
 * @module functions/cloudfunction
 */

'use strict';

var common = require('@google-cloud/common');
var extend = require('extend');
var is = require('is');

var FUNCTION_PATH_REGEX = /^projects\/(.+)\/locations\/(.+)\/functions\/(.+)$/i;

/*! Developer Documentation
 *
 * @param {module:functions} functions - Functions instance.
 * @param {string} name - Name of the function
 * @param {options=} options - Configuration object.
 * @param {string} options.projectId - ID of the project where the function is
 *     deployed.
 * @param {string} options.region - Region where the function is deployed.
 */
/**
 * Interact with your Cloud Function. Create a function instance with
 * {module:functions#createFunction}.
 *
 * @alias module:functions/cloudfunction
 * @constructor
 *
 * @param {string} name - Name of the function.
 * @param {object=} config
 * @param {string} config.projectId - ID of the project where the function is
 *     to be deployed.
 * @param {string} config.region - Region where the function is to be deployed.
 *
 * @example
 * var cloudfunction = functions.cloudfunction('myFunction', {
 *   projectId: 'my-awesome-project',
 *   region: 'us-central1'
 * });
 */
function CloudFunction(functions, name, config) {
  if (!functions) {
    throw new Error('A functions service object name must be provided.');
  }

  Object.defineProperty(this, 'functions', {
    value: functions
  });

  config = extend({
    projectId: this.functions.projectId,
    region: this.functions.region
  }, config || {});

  if (!is.string(name)) {
    throw new Error('A function name must be provided.');
  } else if (!is.object(config)) {
    throw new Error('A function configuration object must be provided.');
  } else if (!is.string(config.projectId)) {
    throw new Error('A project string must be provided.');
  } else if (!is.string(config.region)) {
    throw new Error('A region string must be provided.');
  }

  this.name = name;
  this.metadata = extend({}, config);
  this.metadata.name = this.functions._formatName(
    this.metadata.projectId,
    this.metadata.region,
    this.name
  );
}

/**
 * TODO
 */
CloudFunction.prototype.call = function(data, options, callback) {
  if (is.function(data)) {
    callback = data;
    data = '';
    options = {};
  } else if (is.function(options)) {
    callback = options;
    options = {};
  }

  if (!is.string(data) && !data) {
    throw new Error('A data data value must be provided.');
  } else if (!is.object(options)) {
    throw new Error('A configuration object must be provided.');
  } else {
    if (!is.string(data)) {
      data = JSON.stringify(data);
    }
  }

  this.functions.api.Functions.callFunction(
    this.metadata.name,
    data,
    options,
    function(err, response) {
      if (err) {
        callback(err, null, response);
        return;
      }
      callback(null, response, response);
    }
  );
};

/**
 * Create a Cloud Function.
 *
 * @param {object=} config - See {module:functions#createFunction}.
 * @param {function=} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this request.
 * @param {module:functions/operation} callback.operation - An operation object
 *     that can be used to check the status of the request.
 * @param {object} callback.apiResponse - Raw API response.
 *
 * @example
 * var config = {};
 *
 * cloudfunction.create(config, function(err, operation, apiResponse) {
 *   if (!err) {
 *     // The Cloud Function "create" operation was started successfully.
 *   }
 *   operation
 *     .on('complete', function(cloudfunction) {
 *       // The Cloud Function was created successfully.
 *     })
 *     .on('error', function(err) {
 *       // Failed to create the Cloud Function
 *     });
 * });
 *
 * //-
 * // If the callback is omitted, we'll return a Promise.
 * //-
 * cloudfunction.create(config)
 *   .then(function(data) {
 *     var operation = data[0];
 *     var apiResponse = data[1];
 *     return operation.promise();
 *   })
 *   .then(function(cloudfunction) {
 *     // The Cloud Function was created successfully.
 *   });
 */
CloudFunction.prototype.create = function(config, callback) {
  this.functions.createFunction(this.name, config, callback);
};

/**
 * TODO - LRO
 */
CloudFunction.prototype.delete = function(options, callback) {
  var self = this;
  if (is.function(options)) {
    callback = options;
    options = {};
  }

  options = extend(options || {}, {
    projectId: this.functions.projectId,
    region: this.functions.region
  });

  var formattedName = this.functions._formatName(
    options.projectId,
    options.region,
    this.name
  );

  this.functions.api.Functions.deleteFunction(
    formattedName,
    options,
    function(err, response) {
      if (err) {
        err.response = response;
        callback(err, response);
        return;
      }
      callback(null, response);
    }
  );
};

/**
 * Get a function if it exists.
 *
 * @param {options=} options - Configuration object.
 * @param {string} options.projectId - ID of the project where the function is
 *     deployed.
 * @param {string} options.region - Region where the function is deployed.
 * @param {function=} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this
 *     request.
 * @param {object} callback.function - Cloud Function instance.
 * @param {object} callback.apiResponse - The full API response.
 *
 * @example
 * var cloudfunction = functions.cloudfunction('myFunction');
 * cloudfunction.get(function(err, cloudfunction, apiResponse) {
 *   if (!err) {
 *     // `cloudfunction` is the Cloud Function instance
 *   }
 * });

 * //-
 * // Or, using promises:
 * //-
 *
 * cloudfunction.get()
 *   .then(function(results) {
 *     var cloudfunction = results[0];
 *     var apiResponse = results[1];
 *   });
 */
CloudFunction.prototype.get = function(options, callback) {
  var self = this;
  if (is.function(options)) {
    callback = options;
    options = {};
  }

  options = extend(options, {
    projectId: this.functions.projectId,
    region: this.functions.region
  });

  var formattedName = this.functions._formatName(
    options.projectId,
    options.region,
    this.name
  );

  this.functions.api.Functions.getFunction(
    formattedName,
    options,
    function(err, response) {
      if (err) {
        callback(err, null, response);
        return;
      }
      self.metadata = response;
      callback(null, self, response);
    });
};

/**
 * TODO - LRO
 */
CloudFunction.prototype.update = function(options, callback) {
  var self = this;
  if (is.function(options)) {
    callback = options;
    options = {};
  }

  extend(this, options, {
    projectId: this.functions.projectId,
    region: this.functions.region
  });

  var formattedName = this.functions._formatName(
    this.projectId,
    this.region,
    this.shortName
  );

  this.functions.api.Functions.updateFunction(
    formattedName,
    options,
    function(err, response) {
      if (err) {
        err.response = response;
        callback(err, response);
        return;
      }
      callback(null, response);
    });
};

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
common.util.promisifyAll(CloudFunction, {});

module.exports = CloudFunction;
