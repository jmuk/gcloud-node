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
 * https://github.com/googleapis/googleapis/blob/master/library.proto,
 * and updates to that file get reflected here through a refresh process.
 * For the short term, the refresh process will only be runnable by Google
 * engineers.
 *
 * The only allowed edits are to method and file documentation. A 3-way
 * merge preserves those additions if the generated source changes.
 */
'use strict';

var arguejs = require('arguejs');
var configData = require('./speech_client_config');
var gax = require('google-gax');

/** The default address of the service. */
var SERVICE_ADDRESS = 'speech.googleapis.com';

/** The default port of the service. */
var DEFAULT_SERVICE_PORT = 443;

var CODE_GEN_NAME_VERSION = 'gapic/0.1.0';

var DEFAULT_TIMEOUT = 30;

/**
 * The scopes needed to make gRPC calls to all of the methods defined in
 * this service.
 */
var ALL_SCOPES = [
  'https://www.googleapis.com/auth/cloud-platform'
];

/**
 * Service that implements Google Cloud Speech API.
 *
 * @class
 * @param {?Object} opts - The optional parameters.
 * @param {String} opts.servicePath
 *   The domain name of the API remote host.
 * @param {number} opts.port
 *   The port on which to connect to the remote host.
 * @param {Function} opts.getCredentials
 *   Custom function to obtain the credentials.
 * @param {grpc.ClientCredentials} opts.sslCreds
 *   A ClientCredentials for use with an SSL-enabled channel.
 * @param {Object} opts.grpc
 *   When specified, this is used as the grpc module. Otherwise
 *   the grpc package will be loaded from the dependency (typically
 *   the one within 'google-gax' will be loaded). This will be useful
 *   to share channels among multiple APIs.
 * @param {Object} opts.clientConfig
 *   The customized config to build the call settings. See
 *   {@link gax.constructSettings} for the format.
 * @param {number} opts.timeout
 *   The default timeout, in seconds, for calls made through this client.
 * @param {number} opts.appName
 *   The codename of the calling service.
 * @param {String} opts.appVersion
 *   The version of the calling service.
 */
function SpeechApi(opts) {
  opts = opts || {};
  var servicePath = opts.servicePath || SERVICE_ADDRESS;
  var port = opts.port || DEFAULT_SERVICE_PORT;
  var getCredentials = opts.getCredentials || null;
  var sslCreds = opts.sslCreds || null;
  var scopes = opts.scopes || ALL_SCOPES;
  var clientConfig = opts.clientConfig || {};
  var timeout = opts.timeout || DEFAULT_TIMEOUT;
  var appName = opts.appName || 'gax';
  var appVersion = opts.appVersion || gax.Version;

  var grpcClient = gax.loadGrpc(opts.grpc, [{
    root: require('google-proto-files')('..'),
    file: 'google/cloud/speech/v1/cloud_speech.proto'
  }]);

  var googleApiClient = [
    appName + '/' + appVersion,
    CODE_GEN_NAME_VERSION,
    'nodejs/' + process.version].join(' ');

  var defaults = gax.constructSettingsGrpc(
      'google.cloud.speech.v1.Speech',
      configData,
      clientConfig,
      timeout,
      null,
      null,
      {'x-goog-api-client': googleApiClient},
      opts.grpc);

  this.stub = gax.createStub(
      servicePath,
      port,
      this.proto.Speech,
      {'getCredentials': getCredentials,
       'grpc': opts.grpc,
       'sslCreds': sslCreds,
       'scopes': scopes});
  var methods = [
    'nonStreamingRecognize'
  ];
  methods.forEach(function(methodName) {
    this['_' + methodName] = gax.createApiCall(
        this.stub.then(function(stub) { return stub[methodName].bind(stub); }),
        defaults[methodName]);
  }.bind(this));
};
exports.SpeechApi = SpeechApi;

// Callback types

/**
 * @callback APICallback
 * @param {?Error} error - the error object if something goes wrong.
 *   Null if API succeeds.
 * @param {?T} response
 *   The response object when API succeeds.
 * @template T
 */

/**
 * @callback EmptyCallback
 * @param {?Error} error - the error object if something goes wrong.
 *   Null if API succeeds.
 */

// Service calls

/**
 * Perform non-streaming speech-recognition: receive results after all audio
 * has been sent and processed.
 *
 * @param {google.cloud.speech.v1.InitialRecognizeRequest} initialRequest
 *   The `initial_request` message provides information to the recognizer
 *   that specifies how to process the request.
 *
 *   The first `RecognizeRequest` message must contain an `initial_request`.
 *   Any subsequent `RecognizeRequest` messages must not contain an
 *   `initial_request`.
 * @param {google.cloud.speech.v1.AudioRequest} audioRequest
 *   The audio data to be recognized. For REST or `NonStreamingRecognize`, all
 *   audio data must be contained in the first (and only) `RecognizeRequest`
 *   message. For gRPC streaming `Recognize`, sequential chunks of audio data
 *   are sent in sequential `RecognizeRequest` messages.
 * @param {?gax.CallOptions} options
 *   Overrides the default settings for this call, e.g, timeout,
 *   retries, etc.
 * @param {?APICallback<google.cloud.speech.v1.NonStreamingRecognizeResponse>} callback
 *   The function which will be called with the result of the API call.
 * @returns {gax.EventEmitter} - the event emitter to handle the call
 *   status.
 * @throws an error if the RPC is aborted.
 */
SpeechApi.prototype.nonStreamingRecognize = function nonStreamingRecognize() {
  var args = arguejs({
    'initialRequest': Object,
    'audioRequest': Object,
    'options': [gax.CallOptions],
    'callback': [Function]
  }, arguments);
  var req = {
    'initial_request': args.initialRequest,
    'audio_request': args.audioRequest
  };
  return this._nonStreamingRecognize(req, args.options, args.callback);
};
