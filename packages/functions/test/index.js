/**
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
var extend = require('extend');
var proxyquire = require('proxyquire');
var util = require('@google-cloud/common').util;

var fakeUtil = extend(true, {}, util);

var fakeV1Beta2Override;
function fakeV1Beta2() {
  if (fakeV1Beta2Override) {
    return fakeV1Beta2Override.apply(null, arguments);
  }

  return {
    cloudFunctionsServiceApi: util.noop
  };
}

describe('Functions', function() {
  var Functions;
  var functions;

  var OPTIONS = {};

  before(function() {
    Functions = proxyquire('../src/index.js', {
      '@google-cloud/common': {
        util: fakeUtil
      },
      './v1beta2': fakeV1Beta2
    });
  });

  beforeEach(function() {
    fakeV1Beta2Override = null;
    functions = new Functions(OPTIONS);
  });

  describe('instantiation', function() {
    it('should normalize the arguments', function() {
      var options = {
        projectId: 'project-id',
        credentials: 'credentials',
        email: 'email',
        keyFilename: 'keyFile'
      };

      var normalizeArguments = fakeUtil.normalizeArguments;
      var normalizeArgumentsCalled = false;
      var fakeContext = {};

      fakeUtil.normalizeArguments = function(context, options_) {
        normalizeArgumentsCalled = true;
        assert.strictEqual(context, fakeContext);
        assert.strictEqual(options, options_);
        return options_;
      };

      Functions.call(fakeContext, options);
      assert(normalizeArgumentsCalled);

      fakeUtil.normalizeArguments = normalizeArguments;
    });

    it('should create a gax api client', function() {
      var expectedFunctionsService = {};

      fakeV1Beta2Override = function(options) {
        assert.strictEqual(options, OPTIONS);

        return {
          cloudFunctionsServiceApi: function(options) {
            assert.strictEqual(options, OPTIONS);
            return expectedFunctionsService;
          }
        };
      };

      var functions = new Functions(OPTIONS);

      assert.deepEqual(functions.api, {
        Functions: expectedFunctionsService
      });
    });
  });
});
