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
 * @module functions
 */

'use strict';

var archiver = require('archiver');
var common = require('@google-cloud/common');
var eventsIntercept = require('events-intercept');
var extend = require('extend');
var fs = require('fs');
var is = require('is');
var lro = require('google-gax').lro;
var Storage = require('@google-cloud/storage');
var uuid = require('node-uuid');
var v1beta2 = require('./v1beta2');

/**
 * @type {module:functions/cloudfunction}
 * @private
 */
var CloudFunction = require('./cloudfunction.js');

/**
 * @type {module:functions/operation}
 * @private
 */
var Operation = require('./operation.js');

lro.ALL_SCOPES.push('https://www.googleapis.com/auth/cloud-platform');

/**
 * <p class="notice">
 *   **This is a Alpha release of Google Cloud Functions.** This API is
 *   not covered by any SLA or deprecation policy and may be subject to
 *   backward-incompatible changes.
 * </p>
 *
 * [Google Cloud Functions](https://cloud.google.com/functions/docs) provides a
 * a lightweight, event-based, asynchronous compute solution that allows you to
 * create small, single-purpose functions that respond to cloud events without
 * the need to manage a server or a runtime environment.
 *
 * @constructor
 * @alias module:functions
 *
 * @resource [Google Cloud Functions Documentation]{@link https://cloud.google.com/functions/docs}
 *
 * @param {object} options - [Configuration object](#/docs).
 * @param {string} options.projectId - ID of the project where the function is
 *     to be deployed.
 * @param {string} options.region - Region where the function is to be deployed.
 */
function Functions(options) {
  if (!(this instanceof Functions)) {
    options = common.util.normalizeArguments(this, options);
    return new Functions(options);
  }
  this.projectId = options.projectId || process.env.GCLOUD_PROJECT;
  this.region = options.region || 'us-central1';
  this.Promise = options.promise || Promise;

  var storageConfig = {};
  if (options.projectId) {
    storageConfig.projectId = options.projectId;
    storageConfig.keyFilename = options.keyFilename;
  }
  this.storage = Storage(storageConfig);

  var operationsOptions = extend({}, options, {
    servicePath: options.servicePath || 'cloudfunctions.googleapis.com'
  });
  this.builders = {
    Functions: v1beta2(options),
    Operations: lro(operationsOptions)
  };
  this.api = {
    Functions: this.builders.Functions.cloudFunctionsServiceApi(options),
    Operations: this.builders.Operations.operationsApi(operationsOptions)
  };
}

/**
 * Format the name of a Cloud Function. A Cloud Function's full name is in the
 * format of 'projects/{projectId}/locations/{region}/functions/{name}'.
 *
 * @private
 *
 * @return {string}
 */
Functions.prototype._formatName = function(projectId, region, name) {
  // Simple check if the name is already formatted.
  if (name.indexOf('/') > -1) {
    return name;
  }
  projectId = projectId || this.projectId;
  region = region || this.region;
  return this.api.Functions.functionPath(projectId, region, name);
};

/**
 * Format a Cloud Functions location. A Cloud Functions location's full path is
 * in the format of 'projects/{projectId}/locations/{region}'.
 *
 * @private
 *
 * @return {string}
 */
Functions.prototype._formatLocation = function(projectId, region) {
  return this.api.Functions.locationPath(projectId, region);
};

/**
 * Format a gcsTrigger value. A gcsTrigger's value should be in the format of
 * 'gs://{bucketName}/'.
 *
 * @private
 *
 * @return {string}
 */
Functions.prototype._formatGcsTrigger = function(bucketName) {
  // Simple check if the name is already formatted.
  if (bucketName.indexOf('gs://') !== 0) {
    bucketName = 'gs://' + bucketName;
  }
  if (bucketName.lastIndexOf('/') !== bucketName.length -1) {
    bucketName = bucketName + '/';
  }
  return bucketName;
};

/**
 * Format a pubsubTrigger value. A pubsubTrigger's value should be in the format
 * of 'projects/{projectId}/topics/{topicName'.
 *
 * @private
 *
 * @return {string}
 */
Functions.prototype._formatPubsubTrigger = function(projectId, topicName) {
  // Simple check if the name is already formatted.
  if (topicName.indexOf('projects/') === 0) {
    return topicName;
  }
  return 'projects/' + projectId + '/topics/' + topicName;
};

/**
 * Format an httpsTrigger value. A httpsTrigger's value should be in the format
 * of 'https://{region}-{projectId}.cloudfunctions.net/{name}'.
 *
 * @private
 *
 * @return {string}
 */
Functions.prototype._formatHttpsTrigger = function(projectId, region, name) {
  return 'https://' + region + '-' + projectId + '.cloudfunctions.net/' + name;
};

/**
 * Format an httpsTrigger value. A httpsTrigger's value should be in the format
 * of 'https://{region}-{projectId}.cloudfunctions.net/{name}'.
 *
 * @private
 *
 * @return {string}
 */
Functions.prototype._uploadLocalDir = function(name, config, callback) {
  var localDir = config.localDir;
  var stageBucket = config.stageBucket;
  var filename = config.region + '-' + name + '-' + uuid.v4() + '.zip';
  var file = this.storage.bucket(stageBucket).file(filename);

  delete config.localDir;
  delete config.stageBucket;

  if (!is.string(localDir)) {
    callback(new Error('A localDir string must be provided.'));
    return;
  } else if (!is.string(stageBucket)) {
    callback(new Error('A stageBucket string must be provided.'));
    return;
  }

  var archive = archiver.create('zip');
  var output = file.createWriteStream();
  archive.pipe(output);

  // Find a way to ignore node_modules, and make this configurable
  archive.directory(localDir, false).finalize();

  output
    .on('error', callback);

  archive
    .on('error', callback)
    .on('finish', function() {
      callback(null, 'gs://' + stageBucket + '/' + filename);
    });
};

/**
 * Create a reference to a function.
 *
 * @param {string} name - Name of the function.
 * @param {object=} options - Configuration object.
 * @return {module:functions/cloudfunction}
 *
 * @example
 * var myFunction = functions.cloudfunction('myFunction');
 */
Functions.prototype.cloudfunction = function(name, options) {
  return new CloudFunction(this, name, options);
};

/**
 * Create a Cloud Function with the given name.
 *
 * @param {string} name - Name of the function.
 * @param {object} config - Configuration object.
 * @param {string} config.projectId - ID of the project where the function is
 *     to be deployed.
 * @param {string} config.region - Region where the function is to be deployed.
 * @param {function=} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this request.
 * @param {module:functions/operation} callback.operation - An operation object
 *     that can be used to check the status of the request.
 * @param {object} callback.apiResponse - Raw API response.
 *
 * @example
 * var config = {};
 *
 * functions.createFunction(name, config, function(err, operation, apiResponse) {
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
 * functions.createFunction(name, config)
 *   .then(function(data) {
 *     var operation = data[0];
 *     var apiResponse = data[1];
 *     return operation.promise();
 *   })
 *   .then(function(data) {
 *     var cloudfunction = data[0];
 *     // The Cloud Function was created successfully.
 *   });
 */
Functions.prototype.createFunction = function(name, config, callback) {
  var self = this;

  config = extend({
    projectId: this.projectId,
    region: this.region
  }, config);

  var location = this._formatLocation(config.projectId, config.region);
  var body = extend(config, {
    name: this._formatName(config.projectId, config.region, name)
  });

  var makeRequest = function(err, gcsUrl) {
    if (err) {
      callback(err);
      return;
    }

    if (gcsUrl) {
      body.gcsUrl = gcsUrl;
    }

    if (body.gcsTrigger) {
      body.gcsTrigger = self._formatGcsTrigger(body.gcsTrigger);
    } else if (body.pubsubTrigger) {
      body.pubsubTrigger = self._formatPubsubTrigger(body.pubsubTrigger);
    } else if (body.httpsTrigger) {
      body.httpsTrigger = {
        url: self._formatHttpsTrigger(
          body.projectId,
          body.region,
          name
        )
      };
    }

    if (body.timeout) {
      body.timeout = {
        seconds: body.timeout
      };
    }

    delete body.projectId;
    delete body.region;

    self.api.Functions.createFunction(
      location,
      body,
      function(err, response) {
        if (err) {
          callback(err, null, response);
          return;
        }
        var operation = self.operation(response.name);
        operation.metadata = response;

        // Intercept the "complete" event to decode and format the results of the
        // operation for the user.
        eventsIntercept.patch(operation);
        operation.intercept('complete', function(metadata, callback) {
          var response = metadata.response;

          var cloudfunction;
          if (response) {
            var value = response.value;
            cloudfunction = self.builders.Functions.CloudFunction.decode(value);
            cloudfunction = self.cloudfunction(name, cloudfunction);
          }

          callback(null, cloudfunction, metadata);
        });

        callback(null, operation, response);
      }
    );
  };

  if (body.localDir) {
    this._uploadLocalDir(name, body, makeRequest);
  } else {
    makeRequest(null, body.gcsUrl);
  }
};

/**
 * TODO
 */
Functions.prototype.getFunctions = function(options, callback) {
  if (is.functions(options)) {
    callback = options;
    options = {};
  }

  throw new Error('Not yet implemented');
};

/**
 * TODO
 */
Functions.prototype.getFunctionsStream = function(options, callback) {
  if (is.functions(options)) {
    callback = options;
    options = {};
  }

  throw new Error('Not yet implemented');
};

/**
 * TODO
 */
Functions.prototype.getOperations = function(options, callback) {
  if (is.functions(options)) {
    callback = options;
    options = {};
  }

  throw new Error('Not yet implemented');
};

/**
 * TODO
 */
Functions.prototype.getOperationsStream = function(options, callback) {
  if (is.functions(options)) {
    callback = options;
    options = {};
  }

  throw new Error('Not yet implemented');
};

/*! Developer Documentation
 *
 * @returns {module:functions/operation}
 */
/**
 * Get a reference to an existing operation.
 *
 * @throws {Error} If a name is not provided.
 *
 * @param {string} name - The name of the operation.
 *
 * @example
 * var operation = functions.operation('68850831366825');
 */
Functions.prototype.operation = function(name) {
  if (!name) {
    throw new Error('A name must be specified for an operation.');
  }

  return new Operation(this, name);
};

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
common.util.promisifyAll(Functions, {
  exclude: ['cloudfunction', 'operation']
});

module.exports = Functions;
module.exports.v1beta2 = v1beta2;
