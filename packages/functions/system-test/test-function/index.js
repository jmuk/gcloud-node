/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// exports.helloHttp = function helloHttp(req, res) {
//   res.send(`Hello ${req.body.name}!`);
// };

// exports.helloPubSub = function helloPubSub(event, callback) {
//   const pubsubMessage = event.data;
//   const name = Buffer.from(pubsubMessage.data, 'base64').toString().name;
//   callback(null, `Hello ${name}!`);
// };

// exports.helloGCS = function helloGCS(event, callback) {
//   const file = event.data;
//   const isDelete = file.resourceState === 'not_exists';

//   if (isDelete) {
//     callback(null, `File ${file.name} deleted.`);
//   } else {
//     callback(null, `File ${file.name} uploaded.`);
//   }
// };

exports.helloHttp = function helloHttp(req, res) {
  res.send(`Hello ${req.body.name}!`);
};

exports.helloPubSub = function helloPubSub(context, data) {
  const name = data.name;
  context.success(`Hello ${name}!`);
};

exports.helloGCS = function helloGCS(context, data) {
  const name = data.name;
  const isDelete = !!data.timeDeleted;

  if (isDelete) {
    context.success(`File ${name} deleted.`);
  } else {
    context.success(`File ${name} uploaded.`);
  }
};
