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
 * @module functions/operation
 */

'use strict';

var common = require('@google-cloud/common');
var events = require('events');
var modelo = require('modelo');

/**
 * An Operation object allows you to interact with APIs that take longer to
 * process things.
 *
 * @constructor
 * @alias module:functions/operation
 *
 * @param {object} parent - The parent object. This should be configured to use
 * the longrunning.operation service.
 * @param {string} name - The operation name.
 */
function Operation(parent, name) {
  this.name = name;
  this.parent = parent;

  events.EventEmitter.call(this);

  this.completeListeners = 0;
  this.hasActiveListeners = false;

  this.listenForEvents_();
}

modelo.inherits(Operation, events.EventEmitter);

/**
 * Cancel the operation.
 *
 * @param {function=} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this
 *     request.
 * @param {object} callback.apiResponse - The full API response.
 */
Operation.prototype.cancel = function(callback) {
  var reqOpts = {
    name: this.name
  };

  this.parent.api.Operations.cancelOperation(reqOpts, callback);
};

/**
 * Delete the operation.
 *
 * @param {function=} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this
 *     request.
 * @param {object} callback.apiResponse - The full API response.
 */
Operation.prototype.delete = function(callback) {
  var reqOpts = {
    name: this.name
  };

  this.parent.api.Operations.deleteOperation(reqOpts, callback);
};

/**
 * Get the operation.
 *
 * @param {function=} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this
 *     request.
 * @param {object} callback.apiResponse - The full API response.
 */
Operation.prototype.get = function(callback) {
  var reqOpts = {
    name: this.name
  };

  this.parent.api.Operations.getOperation(reqOpts, callback);
};

/**
 * Wraps the `complete` and `error` events in a Promise.
 *
 * @return {promise}
 */
Operation.prototype.promise = function() {
  var self = this;

  return new this.parent.Promise(function(resolve, reject) {
    self
      .on('error', reject)
      .on('complete', function(metadata) {
        resolve([metadata]);
      });
  });
};

/**
 * Begin listening for events on the operation. This method keeps track of how
 * many "complete" listeners are registered and removed, making sure polling is
 * handled automatically.
 *
 * As long as there is one active "complete" listener, the connection is open.
 * When there are no more listeners, the polling stops.
 *
 * @private
 */
Operation.prototype.listenForEvents_ = function() {
  var self = this;

  this.on('newListener', function(event) {
    if (event === 'complete') {
      self.completeListeners++;

      if (!self.hasActiveListeners) {
        self.hasActiveListeners = true;
        self.startPolling_();
      }
    }
  });

  this.on('removeListener', function(event) {
    if (event === 'complete' && --self.completeListeners === 0) {
      self.hasActiveListeners = false;
    }
  });
};

/**
 * Poll `getMetadata` to check the operation's status. This runs a loop to ping
 * the API on an interval.
 *
 * Note: This method is automatically called once a "complete" event handler is
 * registered on the operation.
 *
 * @private
 */
Operation.prototype.startPolling_ = function() {
  var self = this;

  if (!this.hasActiveListeners) {
    return;
  }

  this.get(function(err, resp) {
    if (err || resp.error) {
      self.emit(
        'error',
        err || common.GrpcService.decorateStatus_(resp.result)
      );
      return;
    }

    if (!resp.done) {
      setTimeout(self.startPolling_.bind(self), 500);
      return;
    }

    self.emit('complete', resp);
  });
};

/*! Developer Documentation
 *
 * All async methods (except for streams) will return a Promise in the event
 * that a callback is omitted.
 */
common.util.promisifyAll(Operation, {});

module.exports = Operation;
