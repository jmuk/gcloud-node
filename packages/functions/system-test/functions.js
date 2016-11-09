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

'use strict';

var assert = require('assert');
var async = require('async');
var extend = require('extend');
var path = require('path');
var uuid = require('node-uuid');

var CloudFunction = require('../src/cloudfunction.js');
var env = require('../../../system-test/env.js');
var Functions = require('../');
var storage = require('@google-cloud/storage')(env);

var STAGE_BUCKET_NAME = 'gcloud-test-bucket-temp-' + uuid.v4();
var BUCKET_NAME = 'gcloud-test-bucket-temp-' + uuid.v4();

var HTTP_FUNC = 'hellohttp';
var GCS_FUNC = 'helloGCS';
var PUBSUB_FUNC = 'helloPubSub';
var TEST_FUNC_DIR = path.join(__dirname, './test-function');

var shortName = 'helloWorld';
var projectId = process.env.GCLOUD_TESTS_PROJECT_ID;
var region = 'us-central1';

extend(env, {
  projectId: projectId,
  region: region
});

describe('Functions', function() {
  var functions = new Functions(env);
  var stageBucket = storage.bucket(STAGE_BUCKET_NAME);
  var bucket = storage.bucket(BUCKET_NAME);
  console.log(HTTP_FUNC, GCS_FUNC, PUBSUB_FUNC);

  before(function(done) {
    async.waterfall([
      function(cb) {
        stageBucket.create(cb);
      },
      function(_bucket, _apiResponse, cb) {
        bucket.create(cb);
      }
    ], done);
  });

  after(function(done) {
    async.waterfall([
      function(cb) {
        stageBucket.deleteFiles({ force: true }, cb);
      },
      function(cb) {
        bucket.deleteFiles({ force: true }, cb);
      },
      function(cb) {
        stageBucket.delete(cb);
      },
      function(apiResponse, cb) {
        bucket.delete(cb);
      }
    ], done);
  });

  describe('cloudfunction', function() {
    it.only('should get and set name', function() {
      var cloudfunction = functions.cloudfunction(shortName, {
        projectId: projectId,
        region: region
      });

      assert.equal(cloudfunction.name, shortName);
      assert.equal(
        cloudfunction.metadata.name,
        functions.api.Functions.functionPath(
          projectId,
          region,
          shortName
        )
      );
    });
  });

  describe('createFunction', function() {
    it('creates a function', function() {
      return functions.createFunction(GCS_FUNC, {
        localDir: TEST_FUNC_DIR,
        gcsTrigger: BUCKET_NAME,
        stageBucket: STAGE_BUCKET_NAME
      })
        .then(function(results) {
          var operation = results[0];
          var apiResponse = results[1];
          assert.equal(operation.name, apiResponse.name);

          return operation.promise();
        })
        .then(function(results) {
          var cloudfunction = results[0];
          var apiResponse = results[1];
          assert.equal(cloudfunction instanceof CloudFunction, true);
          assert.equal(cloudfunction.name, GCS_FUNC);
          assert.equal(
            cloudfunction.metadata.name,
            functions.api.Functions.functionPath(
              projectId,
              region,
              GCS_FUNC
            )
          );
          assert.equal(apiResponse.done, true);
        });
    });
  });

  describe('CloudFunction', function() {
    describe('call', function() {
      it('calls a function', function() {
        var filename = 'file.txt';
        var cloudfunction = functions.cloudfunction(GCS_FUNC);
        return cloudfunction.call({ name: filename })
          .then(function(results) {
            assert.equal(results.length, 2);
            var result = results[0];
            var apiResponse = results[1];
            assert.equal(typeof result.executionId, 'string');
            assert.equal(result.result, 'File ' + filename + ' uploaded.');
            assert(!result.error);
            assert.equal(typeof apiResponse.executionId, 'string');
            assert.equal(apiResponse.result, 'File ' + filename + ' uploaded.');
            assert(!apiResponse.error);
          });
      });
    });

    describe('get', function() {
      it('gets a function', function() {
        var formattedName = functions.api.Functions.functionPath(
          projectId,
          region,
          GCS_FUNC
        );
        var cloudfunction = functions.cloudfunction(GCS_FUNC);
        return cloudfunction.get()
          .then(function(results) {
            assert.equal(results.length, 2);
            var _cloudfunction = results[0];
            var apiResponse = results[1];
            assert.strictEqual(_cloudfunction, cloudfunction);
            assert.equal(_cloudfunction.name, GCS_FUNC);
            assert.equal(_cloudfunction.metadata.name, formattedName);
            assert(_cloudfunction instanceof CloudFunction);
            assert.equal(apiResponse.name, formattedName);
          });
      });
    });
  });
});
