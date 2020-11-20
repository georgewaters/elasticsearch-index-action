module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7529:
/***/ ((module) => {

"use strict";
module.exports = {"i8":"7.10.0"};

/***/ }),

/***/ 2932:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

const core = __webpack_require__(2186);
const { Client } = __webpack_require__(2294);

const path = __webpack_require__(5622);
const fs = __webpack_require__(5747);

(async () => {
  try {
    const apiKey = core.getInput('api-key');
    const username = core.getInput('username');
    const password = core.getInput('password');

    if (!apiKey && !username && !password) {
      throw new Error("Either 'api-key' or 'username' and 'password' must be provided");
    }

    const endpoint = core.getInput('endpoint');
    const file = core.getInput('file');
    const index = core.getInput('index');

    const auth = {};

    if (apiKey) {
      auth.apiKey = apiKey;
    } else {
      auth.username = username;
      auth.password = password;
    }

    const client = new Client({
      node: endpoint,
      auth,
    });

    const body = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), file)));

    const now = new Date();
    body.timestamp = now.toISOString();

    core.debug('got body...');
    core.debug(body);

    client.index({
      index,
      body,
    }).then(console.log).catch(e => {
      core.debug(e);
      core.setFailed(error.message)
    });

  } catch (error) {
    core.debug(error);
    core.setFailed(error.message);
  }
})()


/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __webpack_require__(7351);
const file_command_1 = __webpack_require__(717);
const utils_1 = __webpack_require__(5278);
const os = __importStar(__webpack_require__(2087));
const path = __importStar(__webpack_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(5747));
const os = __importStar(__webpack_require__(2087));
const utils_1 = __webpack_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 6188:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_completion_timeout', 'keep_alive', 'typed_keys', 'keep_on_completion', 'batched_reduce_size', 'request_cache', 'analyzer', 'analyze_wildcard', 'default_operator', 'df', 'explain', 'stored_fields', 'docvalue_fields', 'from', 'ignore_unavailable', 'ignore_throttled', 'allow_no_indices', 'expand_wildcards', 'lenient', 'preference', 'q', 'routing', 'search_type', 'size', 'sort', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'terminate_after', 'stats', 'suggest_field', 'suggest_mode', 'suggest_size', 'suggest_text', 'timeout', 'track_scores', 'track_total_hits', 'allow_partial_search_results', 'version', 'seq_no_primary_term', 'max_concurrent_shard_requests']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', waitForCompletionTimeout: 'wait_for_completion_timeout', keepAlive: 'keep_alive', typedKeys: 'typed_keys', keepOnCompletion: 'keep_on_completion', batchedReduceSize: 'batched_reduce_size', requestCache: 'request_cache', analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', storedFields: 'stored_fields', docvalueFields: 'docvalue_fields', ignoreUnavailable: 'ignore_unavailable', ignoreThrottled: 'ignore_throttled', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', terminateAfter: 'terminate_after', suggestField: 'suggest_field', suggestMode: 'suggest_mode', suggestSize: 'suggest_size', suggestText: 'suggest_text', trackScores: 'track_scores', trackTotalHits: 'track_total_hits', allowPartialSearchResults: 'allow_partial_search_results', seqNoPrimaryTerm: 'seq_no_primary_term', maxConcurrentShardRequests: 'max_concurrent_shard_requests' }

function AsyncSearchApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

AsyncSearchApi.prototype.delete = function asyncSearchDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_async_search' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

AsyncSearchApi.prototype.get = function asyncSearchGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_async_search' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

AsyncSearchApi.prototype.submit = function asyncSearchSubmitApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_async_search'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_async_search'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = AsyncSearchApi


/***/ }),

/***/ 3070:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function AutoscalingApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

AutoscalingApi.prototype.deleteAutoscalingPolicy = function autoscalingDeleteAutoscalingPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_autoscaling' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

AutoscalingApi.prototype.getAutoscalingDecision = function autoscalingGetAutoscalingDecisionApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_autoscaling' + '/' + 'decision'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

AutoscalingApi.prototype.getAutoscalingPolicy = function autoscalingGetAutoscalingPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_autoscaling' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

AutoscalingApi.prototype.putAutoscalingPolicy = function autoscalingPutAutoscalingPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_autoscaling' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(AutoscalingApi.prototype, {
  delete_autoscaling_policy: { get () { return this.deleteAutoscalingPolicy } },
  get_autoscaling_decision: { get () { return this.getAutoscalingDecision } },
  get_autoscaling_policy: { get () { return this.getAutoscalingPolicy } },
  put_autoscaling_policy: { get () { return this.putAutoscalingPolicy } }
})

module.exports = AutoscalingApi


/***/ }),

/***/ 7630:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', 'refresh', 'routing', 'timeout', 'type', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'pipeline', 'require_alias', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', requireAlias: 'require_alias', errorTrace: 'error_trace', filterPath: 'filter_path' }

function bulkApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_bulk'
  } else if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_bulk'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_bulk'
  }

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = bulkApi


/***/ }),

/***/ 8887:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['format', 'local', 'h', 'help', 's', 'v', 'expand_wildcards', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'bytes', 'master_timeout', 'fields', 'time', 'ts', 'health', 'pri', 'include_unloaded_segments', 'full_id', 'active_only', 'detailed', 'index', 'ignore_unavailable', 'node_id', 'actions', 'parent_task', 'size', 'allow_no_match', 'allow_no_datafeeds', 'allow_no_jobs', 'from']
const snakeCase = { expandWildcards: 'expand_wildcards', errorTrace: 'error_trace', filterPath: 'filter_path', masterTimeout: 'master_timeout', includeUnloadedSegments: 'include_unloaded_segments', fullId: 'full_id', activeOnly: 'active_only', ignoreUnavailable: 'ignore_unavailable', nodeId: 'node_id', parentTask: 'parent_task', allowNoMatch: 'allow_no_match', allowNoDatafeeds: 'allow_no_datafeeds', allowNoJobs: 'allow_no_jobs' }

function CatApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

CatApi.prototype.aliases = function catAliasesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'aliases' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'aliases'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.allocation = function catAllocationApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'allocation' + '/' + encodeURIComponent(node_id || nodeId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'allocation'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.count = function catCountApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'count' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'count'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.fielddata = function catFielddataApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, fields, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((fields) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'fielddata' + '/' + encodeURIComponent(fields)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'fielddata'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.health = function catHealthApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'health'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.help = function catHelpApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.indices = function catIndicesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'indices' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'indices'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.master = function catMasterApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'master'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.nodeattrs = function catNodeattrsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'nodeattrs'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.nodes = function catNodesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'nodes'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.pendingTasks = function catPendingTasksApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'pending_tasks'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.plugins = function catPluginsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'plugins'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.recovery = function catRecoveryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'recovery' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'recovery'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.repositories = function catRepositoriesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'repositories'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.segments = function catSegmentsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'segments' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'segments'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.shards = function catShardsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'shards' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'shards'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.snapshots = function catSnapshotsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((repository) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'snapshots' + '/' + encodeURIComponent(repository)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'snapshots'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.tasks = function catTasksApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cat' + '/' + 'tasks'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.templates = function catTemplatesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'templates' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'templates'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.threadPool = function catThreadPoolApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, threadPoolPatterns, thread_pool_patterns, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((thread_pool_patterns || threadPoolPatterns) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'thread_pool' + '/' + encodeURIComponent(thread_pool_patterns || threadPoolPatterns)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'thread_pool'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.mlDataFrameAnalytics = function catMlDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'data_frame' + '/' + 'analytics'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.mlDatafeeds = function catMlDatafeedsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((datafeed_id || datafeedId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'datafeeds'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.mlJobs = function catMlJobsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((job_id || jobId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'anomaly_detectors'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.mlTrainedModels = function catMlTrainedModelsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((model_id || modelId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'ml' + '/' + 'trained_models'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CatApi.prototype.transforms = function catTransformsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((transform_id || transformId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'transforms' + '/' + encodeURIComponent(transform_id || transformId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cat' + '/' + 'transforms'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(CatApi.prototype, {
  pending_tasks: { get () { return this.pendingTasks } },
  thread_pool: { get () { return this.threadPool } },
  ml_data_frame_analytics: { get () { return this.mlDataFrameAnalytics } },
  ml_datafeeds: { get () { return this.mlDatafeeds } },
  ml_jobs: { get () { return this.mlJobs } },
  ml_trained_models: { get () { return this.mlTrainedModels } }
})

module.exports = CatApi


/***/ }),

/***/ 9287:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_active_shards']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', waitForActiveShards: 'wait_for_active_shards' }

function CcrApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

CcrApi.prototype.deleteAutoFollowPattern = function ccrDeleteAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.follow = function ccrFollowApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'follow'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.followInfo = function ccrFollowInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'info'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.followStats = function ccrFollowStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.forgetFollower = function ccrForgetFollowerApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'forget_follower'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.getAutoFollowPattern = function ccrGetAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ccr' + '/' + 'auto_follow'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.pauseAutoFollowPattern = function ccrPauseAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name) + '/' + 'pause'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.pauseFollow = function ccrPauseFollowApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'pause_follow'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.putAutoFollowPattern = function ccrPutAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.resumeAutoFollowPattern = function ccrResumeAutoFollowPatternApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ccr' + '/' + 'auto_follow' + '/' + encodeURIComponent(name) + '/' + 'resume'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.resumeFollow = function ccrResumeFollowApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'resume_follow'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.stats = function ccrStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ccr' + '/' + 'stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

CcrApi.prototype.unfollow = function ccrUnfollowApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ccr' + '/' + 'unfollow'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(CcrApi.prototype, {
  delete_auto_follow_pattern: { get () { return this.deleteAutoFollowPattern } },
  follow_info: { get () { return this.followInfo } },
  follow_stats: { get () { return this.followStats } },
  forget_follower: { get () { return this.forgetFollower } },
  get_auto_follow_pattern: { get () { return this.getAutoFollowPattern } },
  pause_auto_follow_pattern: { get () { return this.pauseAutoFollowPattern } },
  pause_follow: { get () { return this.pauseFollow } },
  put_auto_follow_pattern: { get () { return this.putAutoFollowPattern } },
  resume_auto_follow_pattern: { get () { return this.resumeAutoFollowPattern } },
  resume_follow: { get () { return this.resumeFollow } }
})

module.exports = CcrApi


/***/ }),

/***/ 7259:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function clearScrollApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, scrollId, scroll_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((scroll_id || scrollId) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + '_search' + '/' + 'scroll' + '/' + encodeURIComponent(scroll_id || scrollId)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + '_search' + '/' + 'scroll'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = clearScrollApi


/***/ }),

/***/ 3294:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function closePointInTimeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_pit'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = closePointInTimeApi


/***/ }),

/***/ 6323:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['include_yes_decisions', 'include_disk_info', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'timeout', 'master_timeout', 'wait_for_removal', 'local', 'flat_settings', 'include_defaults', 'expand_wildcards', 'level', 'wait_for_active_shards', 'wait_for_nodes', 'wait_for_events', 'wait_for_no_relocating_shards', 'wait_for_no_initializing_shards', 'wait_for_status', 'node_ids', 'node_names', 'create', 'dry_run', 'explain', 'retry_failed', 'metric', 'wait_for_metadata_version', 'wait_for_timeout', 'ignore_unavailable', 'allow_no_indices']
const snakeCase = { includeYesDecisions: 'include_yes_decisions', includeDiskInfo: 'include_disk_info', errorTrace: 'error_trace', filterPath: 'filter_path', masterTimeout: 'master_timeout', waitForRemoval: 'wait_for_removal', flatSettings: 'flat_settings', includeDefaults: 'include_defaults', expandWildcards: 'expand_wildcards', waitForActiveShards: 'wait_for_active_shards', waitForNodes: 'wait_for_nodes', waitForEvents: 'wait_for_events', waitForNoRelocatingShards: 'wait_for_no_relocating_shards', waitForNoInitializingShards: 'wait_for_no_initializing_shards', waitForStatus: 'wait_for_status', nodeIds: 'node_ids', nodeNames: 'node_names', dryRun: 'dry_run', retryFailed: 'retry_failed', waitForMetadataVersion: 'wait_for_metadata_version', waitForTimeout: 'wait_for_timeout', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices' }

function ClusterApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

ClusterApi.prototype.allocationExplain = function clusterAllocationExplainApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_cluster' + '/' + 'allocation' + '/' + 'explain'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.deleteComponentTemplate = function clusterDeleteComponentTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_component_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.deleteVotingConfigExclusions = function clusterDeleteVotingConfigExclusionsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_cluster' + '/' + 'voting_config_exclusions'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.existsComponentTemplate = function clusterExistsComponentTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'HEAD'
  path = '/' + '_component_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.getComponentTemplate = function clusterGetComponentTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_component_template' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_component_template'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.getSettings = function clusterGetSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cluster' + '/' + 'settings'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.health = function clusterHealthApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'health' + '/' + encodeURIComponent(index)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'health'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.pendingTasks = function clusterPendingTasksApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_cluster' + '/' + 'pending_tasks'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.postVotingConfigExclusions = function clusterPostVotingConfigExclusionsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_cluster' + '/' + 'voting_config_exclusions'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.putComponentTemplate = function clusterPutComponentTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_component_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.putSettings = function clusterPutSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_cluster' + '/' + 'settings'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.remoteInfo = function clusterRemoteInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_remote' + '/' + 'info'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.reroute = function clusterRerouteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_cluster' + '/' + 'reroute'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.state = function clusterStateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params['index'] != null && (params['metric'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: metric')
    return handleError(err, callback)
  }

  var { method, body, metric, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((metric) != null && (index) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'state' + '/' + encodeURIComponent(metric) + '/' + encodeURIComponent(index)
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'state' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'state'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

ClusterApi.prototype.stats = function clusterStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'stats' + '/' + 'nodes' + '/' + encodeURIComponent(node_id || nodeId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(ClusterApi.prototype, {
  allocation_explain: { get () { return this.allocationExplain } },
  delete_component_template: { get () { return this.deleteComponentTemplate } },
  delete_voting_config_exclusions: { get () { return this.deleteVotingConfigExclusions } },
  exists_component_template: { get () { return this.existsComponentTemplate } },
  get_component_template: { get () { return this.getComponentTemplate } },
  get_settings: { get () { return this.getSettings } },
  pending_tasks: { get () { return this.pendingTasks } },
  post_voting_config_exclusions: { get () { return this.postVotingConfigExclusions } },
  put_component_template: { get () { return this.putComponentTemplate } },
  put_settings: { get () { return this.putSettings } },
  remote_info: { get () { return this.remoteInfo } }
})

module.exports = ClusterApi


/***/ }),

/***/ 7944:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['ignore_unavailable', 'ignore_throttled', 'allow_no_indices', 'expand_wildcards', 'min_score', 'preference', 'routing', 'q', 'analyzer', 'analyze_wildcard', 'default_operator', 'df', 'lenient', 'terminate_after', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', ignoreThrottled: 'ignore_throttled', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', minScore: 'min_score', analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', terminateAfter: 'terminate_after', errorTrace: 'error_trace', filterPath: 'filter_path' }

function countApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_count'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_count'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_count'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = countApi


/***/ }),

/***/ 3555:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', 'refresh', 'routing', 'timeout', 'version', 'version_type', 'pipeline', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function createApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_create'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_create' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = createApi


/***/ }),

/***/ 8540:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['accept_data_loss', 'timeout', 'master_timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { acceptDataLoss: 'accept_data_loss', masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function DanglingIndicesApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

DanglingIndicesApi.prototype.deleteDanglingIndex = function danglingIndicesDeleteDanglingIndexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index_uuid'] == null && params['indexUuid'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index_uuid or indexUuid')
    return handleError(err, callback)
  }

  var { method, body, indexUuid, index_uuid, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_dangling' + '/' + encodeURIComponent(index_uuid || indexUuid)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

DanglingIndicesApi.prototype.importDanglingIndex = function danglingIndicesImportDanglingIndexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index_uuid'] == null && params['indexUuid'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index_uuid or indexUuid')
    return handleError(err, callback)
  }

  var { method, body, indexUuid, index_uuid, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_dangling' + '/' + encodeURIComponent(index_uuid || indexUuid)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

DanglingIndicesApi.prototype.listDanglingIndices = function danglingIndicesListDanglingIndicesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_dangling'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(DanglingIndicesApi.prototype, {
  delete_dangling_index: { get () { return this.deleteDanglingIndex } },
  import_dangling_index: { get () { return this.importDanglingIndex } },
  list_dangling_indices: { get () { return this.listDanglingIndices } }
})

module.exports = DanglingIndicesApi


/***/ }),

/***/ 6080:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', 'refresh', 'routing', 'timeout', 'if_seq_no', 'if_primary_term', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', ifSeqNo: 'if_seq_no', ifPrimaryTerm: 'if_primary_term', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function deleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + encodeURIComponent(index) + '/' + '_doc' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = deleteApi


/***/ }),

/***/ 2109:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['analyzer', 'analyze_wildcard', 'default_operator', 'df', 'from', 'ignore_unavailable', 'allow_no_indices', 'conflicts', 'expand_wildcards', 'lenient', 'preference', 'q', 'routing', 'scroll', 'search_type', 'search_timeout', 'size', 'max_docs', 'sort', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'terminate_after', 'stats', 'version', 'request_cache', 'refresh', 'timeout', 'wait_for_active_shards', 'scroll_size', 'wait_for_completion', 'requests_per_second', 'slices', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', searchTimeout: 'search_timeout', maxDocs: 'max_docs', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', terminateAfter: 'terminate_after', requestCache: 'request_cache', waitForActiveShards: 'wait_for_active_shards', scrollSize: 'scroll_size', waitForCompletion: 'wait_for_completion', requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function deleteByQueryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_delete_by_query'
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_delete_by_query'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = deleteByQueryApi


/***/ }),

/***/ 2264:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['requests_per_second', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function deleteByQueryRethrottleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['task_id'] == null && params['taskId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: task_id or taskId')
    return handleError(err, callback)
  }
  if (params['requests_per_second'] == null && params['requestsPerSecond'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: requests_per_second or requestsPerSecond')
    return handleError(err, callback)
  }

  var { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_delete_by_query' + '/' + encodeURIComponent(task_id || taskId) + '/' + '_rethrottle'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = deleteByQueryRethrottleApi


/***/ }),

/***/ 3107:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['timeout', 'master_timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function deleteScriptApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_scripts' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = deleteScriptApi


/***/ }),

/***/ 6350:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_completion']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', waitForCompletion: 'wait_for_completion' }

function EnrichApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

EnrichApi.prototype.deletePolicy = function enrichDeletePolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_enrich' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

EnrichApi.prototype.executePolicy = function enrichExecutePolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_enrich' + '/' + 'policy' + '/' + encodeURIComponent(name) + '/' + '_execute'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

EnrichApi.prototype.getPolicy = function enrichGetPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_enrich' + '/' + 'policy' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_enrich' + '/' + 'policy'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

EnrichApi.prototype.putPolicy = function enrichPutPolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_enrich' + '/' + 'policy' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

EnrichApi.prototype.stats = function enrichStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_enrich' + '/' + '_stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(EnrichApi.prototype, {
  delete_policy: { get () { return this.deletePolicy } },
  execute_policy: { get () { return this.executePolicy } },
  get_policy: { get () { return this.getPolicy } },
  put_policy: { get () { return this.putPolicy } }
})

module.exports = EnrichApi


/***/ }),

/***/ 941:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_completion_timeout', 'keep_alive', 'keep_on_completion']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', waitForCompletionTimeout: 'wait_for_completion_timeout', keepAlive: 'keep_alive', keepOnCompletion: 'keep_on_completion' }

function EqlApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

EqlApi.prototype.delete = function eqlDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_eql' + '/' + 'search' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

EqlApi.prototype.get = function eqlGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_eql' + '/' + 'search' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

EqlApi.prototype.search = function eqlSearchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_eql' + '/' + 'search'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = EqlApi


/***/ }),

/***/ 1297:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['stored_fields', 'preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { storedFields: 'stored_fields', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function existsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + '_doc' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = existsApi


/***/ }),

/***/ 5602:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function existsSourceApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  // check required url components
  if (params['id'] != null && (params['type'] == null || params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: type, index')
    return handleError(err, callback)
  } else if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_source'
  } else {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + '_source' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = existsSourceApi


/***/ }),

/***/ 8941:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['analyze_wildcard', 'analyzer', 'default_operator', 'df', 'stored_fields', 'lenient', 'preference', 'q', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', storedFields: 'stored_fields', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', errorTrace: 'error_trace', filterPath: 'filter_path' }

function explainApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_explain'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_explain' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = explainApi


/***/ }),

/***/ 7109:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['fields', 'ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'include_unmapped', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', includeUnmapped: 'include_unmapped', errorTrace: 'error_trace', filterPath: 'filter_path' }

function fieldCapsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_field_caps'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_field_caps'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = fieldCapsApi


/***/ }),

/***/ 7210:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['stored_fields', 'preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { storedFields: 'stored_fields', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function getApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_doc' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getApi


/***/ }),

/***/ 6482:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['master_timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function getScriptApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_scripts' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getScriptApi


/***/ }),

/***/ 8031:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function getScriptContextApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_script_context'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getScriptContextApi


/***/ }),

/***/ 8681:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function getScriptLanguagesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_script_language'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getScriptLanguagesApi


/***/ }),

/***/ 1488:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function getSourceApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_source'
  } else {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_source' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = getSourceApi


/***/ }),

/***/ 6235:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['routing', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function GraphApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

GraphApi.prototype.explore = function graphExploreApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_graph' + '/' + 'explore'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_graph' + '/' + 'explore'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = GraphApi


/***/ }),

/***/ 9790:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'only_managed', 'only_errors']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', onlyManaged: 'only_managed', onlyErrors: 'only_errors' }

function IlmApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

IlmApi.prototype.deleteLifecycle = function ilmDeleteLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['policy'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy')
    return handleError(err, callback)
  }

  var { method, body, policy, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ilm' + '/' + 'policy' + '/' + encodeURIComponent(policy)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.explainLifecycle = function ilmExplainLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_ilm' + '/' + 'explain'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.getLifecycle = function ilmGetLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, policy, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((policy) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ilm' + '/' + 'policy' + '/' + encodeURIComponent(policy)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ilm' + '/' + 'policy'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.getStatus = function ilmGetStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ilm' + '/' + 'status'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.moveToStep = function ilmMoveToStepApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ilm' + '/' + 'move' + '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.putLifecycle = function ilmPutLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['policy'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy')
    return handleError(err, callback)
  }

  var { method, body, policy, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ilm' + '/' + 'policy' + '/' + encodeURIComponent(policy)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.removePolicy = function ilmRemovePolicyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ilm' + '/' + 'remove'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.retry = function ilmRetryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_ilm' + '/' + 'retry'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.start = function ilmStartApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ilm' + '/' + 'start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IlmApi.prototype.stop = function ilmStopApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ilm' + '/' + 'stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(IlmApi.prototype, {
  delete_lifecycle: { get () { return this.deleteLifecycle } },
  explain_lifecycle: { get () { return this.explainLifecycle } },
  get_lifecycle: { get () { return this.getLifecycle } },
  get_status: { get () { return this.getStatus } },
  move_to_step: { get () { return this.moveToStep } },
  put_lifecycle: { get () { return this.putLifecycle } },
  remove_policy: { get () { return this.removePolicy } }
})

module.exports = IlmApi


/***/ }),

/***/ 9835:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', 'op_type', 'refresh', 'routing', 'timeout', 'version', 'version_type', 'if_seq_no', 'if_primary_term', 'pipeline', 'require_alias', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', opType: 'op_type', versionType: 'version_type', ifSeqNo: 'if_seq_no', ifPrimaryTerm: 'if_primary_term', requireAlias: 'require_alias', errorTrace: 'error_trace', filterPath: 'filter_path' }

function indexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id)
  } else if ((index) != null && (id) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_doc' + '/' + encodeURIComponent(id)
  } else if ((index) != null && (type) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type)
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_doc'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = indexApi


/***/ }),

/***/ 9820:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['timeout', 'master_timeout', 'ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'index', 'fielddata', 'fields', 'query', 'request', 'wait_for_active_shards', 'include_type_name', 'local', 'flat_settings', 'include_defaults', 'force', 'wait_if_ongoing', 'flush', 'max_num_segments', 'only_expunge_deletes', 'create', 'cause', 'write_index_only', 'preserve_existing', 'order', 'detailed', 'active_only', 'dry_run', 'verbose', 'status', 'copy_settings', 'completion_fields', 'fielddata_fields', 'groups', 'level', 'types', 'include_segment_file_sizes', 'include_unloaded_segments', 'forbid_closed_indices', 'wait_for_completion', 'only_ancient_segments', 'explain', 'q', 'analyzer', 'analyze_wildcard', 'default_operator', 'df', 'lenient', 'rewrite', 'all_shards']
const snakeCase = { masterTimeout: 'master_timeout', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', errorTrace: 'error_trace', filterPath: 'filter_path', waitForActiveShards: 'wait_for_active_shards', includeTypeName: 'include_type_name', flatSettings: 'flat_settings', includeDefaults: 'include_defaults', waitIfOngoing: 'wait_if_ongoing', maxNumSegments: 'max_num_segments', onlyExpungeDeletes: 'only_expunge_deletes', writeIndexOnly: 'write_index_only', preserveExisting: 'preserve_existing', activeOnly: 'active_only', dryRun: 'dry_run', copySettings: 'copy_settings', completionFields: 'completion_fields', fielddataFields: 'fielddata_fields', includeSegmentFileSizes: 'include_segment_file_sizes', includeUnloadedSegments: 'include_unloaded_segments', forbidClosedIndices: 'forbid_closed_indices', waitForCompletion: 'wait_for_completion', onlyAncientSegments: 'only_ancient_segments', analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', allShards: 'all_shards' }

function IndicesApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

IndicesApi.prototype.addBlock = function indicesAddBlockApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['block'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: block')
    return handleError(err, callback)
  }

  // check required url components
  if (params['block'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, block, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_block' + '/' + encodeURIComponent(block)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.analyze = function indicesAnalyzeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_analyze'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_analyze'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.clearCache = function indicesClearCacheApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_cache' + '/' + 'clear'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_cache' + '/' + 'clear'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.clone = function indicesCloneApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['target'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: target')
    return handleError(err, callback)
  }

  // check required url components
  if (params['target'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, target, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_clone' + '/' + encodeURIComponent(target)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.close = function indicesCloseApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_close'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.create = function indicesCreateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.delete = function indicesDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.deleteAlias = function indicesDeleteAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  // check required url components
  if (params['name'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + encodeURIComponent(index) + '/' + '_alias' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + encodeURIComponent(index) + '/' + '_aliases' + '/' + encodeURIComponent(name)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.deleteIndexTemplate = function indicesDeleteIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_index_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.deleteTemplate = function indicesDeleteTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.exists = function indicesExistsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'HEAD'
  path = '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.existsAlias = function indicesExistsAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'HEAD'
    path = '/' + encodeURIComponent(index) + '/' + '_alias' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'HEAD'
    path = '/' + '_alias' + '/' + encodeURIComponent(name)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.existsIndexTemplate = function indicesExistsIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'HEAD'
  path = '/' + '_index_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.existsTemplate = function indicesExistsTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'HEAD'
  path = '/' + '_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.existsType = function indicesExistsTypeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['type'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: type')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'HEAD'
  path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + encodeURIComponent(type)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.flush = function indicesFlushApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_flush'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_flush'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.flushSynced = function indicesFlushSyncedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_flush' + '/' + 'synced'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.forcemerge = function indicesForcemergeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_forcemerge'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_forcemerge'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.get = function indicesGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getAlias = function indicesGetAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_alias' + '/' + encodeURIComponent(name)
  } else if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_alias' + '/' + encodeURIComponent(name)
  } else if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_alias'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_alias'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getFieldMapping = function indicesGetFieldMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['fields'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: fields')
    return handleError(err, callback)
  }

  var { method, body, fields, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (fields) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + encodeURIComponent(type) + '/' + 'field' + '/' + encodeURIComponent(fields)
  } else if ((index) != null && (fields) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + 'field' + '/' + encodeURIComponent(fields)
  } else if ((type) != null && (fields) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_mapping' + '/' + encodeURIComponent(type) + '/' + 'field' + '/' + encodeURIComponent(fields)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_mapping' + '/' + 'field' + '/' + encodeURIComponent(fields)
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getIndexTemplate = function indicesGetIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_index_template' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_index_template'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getMapping = function indicesGetMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + encodeURIComponent(type)
  } else if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping'
  } else if ((type) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_mapping' + '/' + encodeURIComponent(type)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_mapping'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getSettings = function indicesGetSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_settings' + '/' + encodeURIComponent(name)
  } else if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_settings'
  } else if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_settings' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_settings'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getTemplate = function indicesGetTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_template' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_template'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getUpgrade = function indicesGetUpgradeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_upgrade'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_upgrade'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.open = function indicesOpenApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_open'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putAlias = function indicesPutAliasApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  // check required url components
  if (params['name'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (name) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_alias' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_aliases' + '/' + encodeURIComponent(name)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putIndexTemplate = function indicesPutIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_index_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putMapping = function indicesPutMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_mapping'
  } else if ((index) != null && (type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping' + '/' + encodeURIComponent(type)
  } else if ((index) != null && (type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_mappings'
  } else if ((index) != null && (type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_mappings' + '/' + encodeURIComponent(type)
  } else if ((index) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_mapping'
  } else if ((type) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_mappings' + '/' + encodeURIComponent(type)
  } else if ((index) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_mappings'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_mapping' + '/' + encodeURIComponent(type)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putSettings = function indicesPutSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'PUT'
    path = '/' + encodeURIComponent(index) + '/' + '_settings'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_settings'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.putTemplate = function indicesPutTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_template' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.recovery = function indicesRecoveryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_recovery'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_recovery'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.refresh = function indicesRefreshApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_refresh'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_refresh'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.resolveIndex = function indicesResolveIndexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_resolve' + '/' + 'index' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.rollover = function indicesRolloverApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['alias'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: alias')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['new_index'] != null || params['newIndex'] != null) && (params['alias'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: alias')
    return handleError(err, callback)
  }

  var { method, body, alias, newIndex, new_index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((alias) != null && (new_index || newIndex) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(alias) + '/' + '_rollover' + '/' + encodeURIComponent(new_index || newIndex)
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(alias) + '/' + '_rollover'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.segments = function indicesSegmentsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_segments'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_segments'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.shardStores = function indicesShardStoresApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_shard_stores'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_shard_stores'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.shrink = function indicesShrinkApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['target'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: target')
    return handleError(err, callback)
  }

  // check required url components
  if (params['target'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, target, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_shrink' + '/' + encodeURIComponent(target)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.simulateIndexTemplate = function indicesSimulateIndexTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_index_template' + '/' + '_simulate_index' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.simulateTemplate = function indicesSimulateTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'POST'
    path = '/' + '_index_template' + '/' + '_simulate' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_index_template' + '/' + '_simulate'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.split = function indicesSplitApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['target'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: target')
    return handleError(err, callback)
  }

  // check required url components
  if (params['target'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, target, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + encodeURIComponent(index) + '/' + '_split' + '/' + encodeURIComponent(target)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.stats = function indicesStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, metric, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_stats' + '/' + encodeURIComponent(metric)
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_stats' + '/' + encodeURIComponent(metric)
  } else if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.updateAliases = function indicesUpdateAliasesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_aliases'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.upgrade = function indicesUpgradeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_upgrade'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_upgrade'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.validateQuery = function indicesValidateQueryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_validate' + '/' + 'query'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_validate' + '/' + 'query'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_validate' + '/' + 'query'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.createDataStream = function indicesCreateDataStreamApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_data_stream' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.dataStreamsStats = function indicesDataStreamsStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_data_stream' + '/' + encodeURIComponent(name) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_data_stream' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.deleteDataStream = function indicesDeleteDataStreamApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_data_stream' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.freeze = function indicesFreezeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_freeze'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.getDataStream = function indicesGetDataStreamApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_data_stream' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_data_stream'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.reloadSearchAnalyzers = function indicesReloadSearchAnalyzersApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_reload_search_analyzers'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IndicesApi.prototype.unfreeze = function indicesUnfreezeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + encodeURIComponent(index) + '/' + '_unfreeze'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(IndicesApi.prototype, {
  add_block: { get () { return this.addBlock } },
  clear_cache: { get () { return this.clearCache } },
  delete_alias: { get () { return this.deleteAlias } },
  delete_index_template: { get () { return this.deleteIndexTemplate } },
  delete_template: { get () { return this.deleteTemplate } },
  exists_alias: { get () { return this.existsAlias } },
  exists_index_template: { get () { return this.existsIndexTemplate } },
  exists_template: { get () { return this.existsTemplate } },
  exists_type: { get () { return this.existsType } },
  flush_synced: { get () { return this.flushSynced } },
  get_alias: { get () { return this.getAlias } },
  get_field_mapping: { get () { return this.getFieldMapping } },
  get_index_template: { get () { return this.getIndexTemplate } },
  get_mapping: { get () { return this.getMapping } },
  get_settings: { get () { return this.getSettings } },
  get_template: { get () { return this.getTemplate } },
  get_upgrade: { get () { return this.getUpgrade } },
  put_alias: { get () { return this.putAlias } },
  put_index_template: { get () { return this.putIndexTemplate } },
  put_mapping: { get () { return this.putMapping } },
  put_settings: { get () { return this.putSettings } },
  put_template: { get () { return this.putTemplate } },
  resolve_index: { get () { return this.resolveIndex } },
  shard_stores: { get () { return this.shardStores } },
  simulate_index_template: { get () { return this.simulateIndexTemplate } },
  simulate_template: { get () { return this.simulateTemplate } },
  update_aliases: { get () { return this.updateAliases } },
  validate_query: { get () { return this.validateQuery } },
  create_data_stream: { get () { return this.createDataStream } },
  data_streams_stats: { get () { return this.dataStreamsStats } },
  delete_data_stream: { get () { return this.deleteDataStream } },
  get_data_stream: { get () { return this.getDataStream } },
  reload_search_analyzers: { get () { return this.reloadSearchAnalyzers } }
})

module.exports = IndicesApi


/***/ }),

/***/ 5188:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function infoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = infoApi


/***/ }),

/***/ 5631:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['master_timeout', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'verbose']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function IngestApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

IngestApi.prototype.deletePipeline = function ingestDeletePipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ingest' + '/' + 'pipeline' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.getPipeline = function ingestGetPipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ingest' + '/' + 'pipeline' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ingest' + '/' + 'pipeline'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.processorGrok = function ingestProcessorGrokApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ingest' + '/' + 'processor' + '/' + 'grok'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.putPipeline = function ingestPutPipelineApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ingest' + '/' + 'pipeline' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

IngestApi.prototype.simulate = function ingestSimulateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ingest' + '/' + 'pipeline' + '/' + encodeURIComponent(id) + '/' + '_simulate'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ingest' + '/' + 'pipeline' + '/' + '_simulate'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(IngestApi.prototype, {
  delete_pipeline: { get () { return this.deletePipeline } },
  get_pipeline: { get () { return this.getPipeline } },
  processor_grok: { get () { return this.processorGrok } },
  put_pipeline: { get () { return this.putPipeline } }
})

module.exports = IngestApi


/***/ }),

/***/ 1510:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'local', 'accept_enterprise', 'acknowledge', 'type']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', acceptEnterprise: 'accept_enterprise' }

function LicenseApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

LicenseApi.prototype.delete = function licenseDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_license'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.get = function licenseGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_license'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.getBasicStatus = function licenseGetBasicStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_license' + '/' + 'basic_status'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.getTrialStatus = function licenseGetTrialStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_license' + '/' + 'trial_status'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.post = function licensePostApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_license'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.postStartBasic = function licensePostStartBasicApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_license' + '/' + 'start_basic'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

LicenseApi.prototype.postStartTrial = function licensePostStartTrialApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_license' + '/' + 'start_trial'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(LicenseApi.prototype, {
  get_basic_status: { get () { return this.getBasicStatus } },
  get_trial_status: { get () { return this.getTrialStatus } },
  post_start_basic: { get () { return this.postStartBasic } },
  post_start_trial: { get () { return this.postStartTrial } }
})

module.exports = LicenseApi


/***/ }),

/***/ 3803:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['stored_fields', 'preference', 'realtime', 'refresh', 'routing', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { storedFields: 'stored_fields', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', errorTrace: 'error_trace', filterPath: 'filter_path' }

function mgetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_mget'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_mget'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_mget'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = mgetApi


/***/ }),

/***/ 8652:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function MigrationApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

MigrationApi.prototype.deprecations = function migrationDeprecationsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_migration' + '/' + 'deprecations'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_migration' + '/' + 'deprecations'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = MigrationApi


/***/ }),

/***/ 842:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['allow_no_match', 'allow_no_jobs', 'force', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'requests_per_second', 'allow_no_forecasts', 'wait_for_completion', 'lines_to_sample', 'line_merge_size_limit', 'charset', 'format', 'has_header_row', 'column_names', 'delimiter', 'quote', 'should_trim_fields', 'grok_pattern', 'timestamp_field', 'timestamp_format', 'explain', 'calc_interim', 'start', 'end', 'advance_time', 'skip_time', 'duration', 'expires_in', 'max_model_memory', 'expand', 'exclude_interim', 'from', 'size', 'anomaly_score', 'sort', 'desc', 'job_id', 'partition_field_value', 'verbose', 'allow_no_datafeeds', 'influencer_score', 'top_n', 'bucket_span', 'overall_score', 'record_score', 'include', 'include_model_definition', 'decompress_definition', 'tags', 'for_export', 'reset_start', 'reset_end', 'ignore_unavailable', 'allow_no_indices', 'ignore_throttled', 'expand_wildcards', 'delete_intervening_results', 'enabled']
const snakeCase = { allowNoMatch: 'allow_no_match', allowNoJobs: 'allow_no_jobs', errorTrace: 'error_trace', filterPath: 'filter_path', requestsPerSecond: 'requests_per_second', allowNoForecasts: 'allow_no_forecasts', waitForCompletion: 'wait_for_completion', linesToSample: 'lines_to_sample', lineMergeSizeLimit: 'line_merge_size_limit', hasHeaderRow: 'has_header_row', columnNames: 'column_names', shouldTrimFields: 'should_trim_fields', grokPattern: 'grok_pattern', timestampField: 'timestamp_field', timestampFormat: 'timestamp_format', calcInterim: 'calc_interim', advanceTime: 'advance_time', skipTime: 'skip_time', expiresIn: 'expires_in', maxModelMemory: 'max_model_memory', excludeInterim: 'exclude_interim', anomalyScore: 'anomaly_score', jobId: 'job_id', partitionFieldValue: 'partition_field_value', allowNoDatafeeds: 'allow_no_datafeeds', influencerScore: 'influencer_score', topN: 'top_n', bucketSpan: 'bucket_span', overallScore: 'overall_score', recordScore: 'record_score', includeModelDefinition: 'include_model_definition', decompressDefinition: 'decompress_definition', forExport: 'for_export', resetStart: 'reset_start', resetEnd: 'reset_end', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', ignoreThrottled: 'ignore_throttled', expandWildcards: 'expand_wildcards', deleteInterveningResults: 'delete_intervening_results' }

function MlApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

MlApi.prototype.closeJob = function mlCloseJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_close'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteCalendar = function mlDeleteCalendarApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['calendar_id'] == null && params['calendarId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }

  var { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteCalendarEvent = function mlDeleteCalendarEventApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['calendar_id'] == null && params['calendarId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }
  if (params['event_id'] == null && params['eventId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: event_id or eventId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['event_id'] != null || params['eventId'] != null) && ((params['calendar_id'] == null && params['calendarId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: calendar_id')
    return handleError(err, callback)
  }

  var { method, body, calendarId, calendar_id, eventId, event_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'events' + '/' + encodeURIComponent(event_id || eventId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteCalendarJob = function mlDeleteCalendarJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['calendar_id'] == null && params['calendarId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['job_id'] != null || params['jobId'] != null) && ((params['calendar_id'] == null && params['calendarId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: calendar_id')
    return handleError(err, callback)
  }

  var { method, body, calendarId, calendar_id, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'jobs' + '/' + encodeURIComponent(job_id || jobId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteDataFrameAnalytics = function mlDeleteDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteDatafeed = function mlDeleteDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['datafeed_id'] == null && params['datafeedId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteExpiredData = function mlDeleteExpiredDataApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((job_id || jobId) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + '_ml' + '/' + '_delete_expired_data' + '/' + encodeURIComponent(job_id || jobId)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + '_ml' + '/' + '_delete_expired_data'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteFilter = function mlDeleteFilterApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['filter_id'] == null && params['filterId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: filter_id or filterId')
    return handleError(err, callback)
  }

  var { method, body, filterId, filter_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'filters' + '/' + encodeURIComponent(filter_id || filterId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteForecast = function mlDeleteForecastApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['forecast_id'] != null || params['forecastId'] != null) && ((params['job_id'] == null && params['jobId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, forecastId, forecast_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((job_id || jobId) != null && (forecast_id || forecastId) != null) {
    if (method == null) method = 'DELETE'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_forecast' + '/' + encodeURIComponent(forecast_id || forecastId)
  } else {
    if (method == null) method = 'DELETE'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_forecast'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteJob = function mlDeleteJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteModelSnapshot = function mlDeleteModelSnapshotApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params['snapshot_id'] == null && params['snapshotId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot_id or snapshotId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['snapshot_id'] != null || params['snapshotId'] != null) && ((params['job_id'] == null && params['jobId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.deleteTrainedModel = function mlDeleteTrainedModelApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['model_id'] == null && params['modelId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: model_id or modelId')
    return handleError(err, callback)
  }

  var { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.estimateModelMemory = function mlEstimateModelMemoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + '_estimate_model_memory'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.evaluateDataFrame = function mlEvaluateDataFrameApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + '_evaluate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.explainDataFrameAnalytics = function mlExplainDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_explain'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + '_explain'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.findFileStructure = function mlFindFileStructureApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'find_file_structure'

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.flushJob = function mlFlushJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_flush'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.forecast = function mlForecastApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_forecast'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getBuckets = function mlGetBucketsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if (params['timestamp'] != null && ((params['job_id'] == null && params['jobId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, timestamp, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((job_id || jobId) != null && (timestamp) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'buckets' + '/' + encodeURIComponent(timestamp)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'buckets'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getCalendarEvents = function mlGetCalendarEventsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['calendar_id'] == null && params['calendarId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }

  var { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'events'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getCalendars = function mlGetCalendarsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((calendar_id || calendarId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'calendars'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getCategories = function mlGetCategoriesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['category_id'] != null || params['categoryId'] != null) && ((params['job_id'] == null && params['jobId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, categoryId, category_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((job_id || jobId) != null && (category_id || categoryId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'categories' + '/' + encodeURIComponent(category_id || categoryId)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'categories'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getDataFrameAnalytics = function mlGetDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getDataFrameAnalyticsStats = function mlGetDataFrameAnalyticsStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getDatafeedStats = function mlGetDatafeedStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((datafeed_id || datafeedId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'datafeeds' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getDatafeeds = function mlGetDatafeedsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((datafeed_id || datafeedId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'datafeeds'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getFilters = function mlGetFiltersApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, filterId, filter_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((filter_id || filterId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'filters' + '/' + encodeURIComponent(filter_id || filterId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'filters'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getInfluencers = function mlGetInfluencersApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'influencers'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getJobStats = function mlGetJobStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((job_id || jobId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getJobs = function mlGetJobsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((job_id || jobId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'anomaly_detectors'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getModelSnapshots = function mlGetModelSnapshotsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['snapshot_id'] != null || params['snapshotId'] != null) && ((params['job_id'] == null && params['jobId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((job_id || jobId) != null && (snapshot_id || snapshotId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getOverallBuckets = function mlGetOverallBucketsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'overall_buckets'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getRecords = function mlGetRecordsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'results' + '/' + 'records'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getTrainedModels = function mlGetTrainedModelsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((model_id || modelId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'trained_models'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.getTrainedModelsStats = function mlGetTrainedModelsStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((model_id || modelId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId) + '/' + '_stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_ml' + '/' + 'trained_models' + '/' + '_stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.info = function mlInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ml' + '/' + 'info'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.openJob = function mlOpenJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_open'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.postCalendarEvents = function mlPostCalendarEventsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['calendar_id'] == null && params['calendarId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'events'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.postData = function mlPostDataApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_data'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.previewDatafeed = function mlPreviewDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['datafeed_id'] == null && params['datafeedId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_preview'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putCalendar = function mlPutCalendarApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['calendar_id'] == null && params['calendarId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }

  var { method, body, calendarId, calendar_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putCalendarJob = function mlPutCalendarJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['calendar_id'] == null && params['calendarId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: calendar_id or calendarId')
    return handleError(err, callback)
  }
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['job_id'] != null || params['jobId'] != null) && ((params['calendar_id'] == null && params['calendarId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: calendar_id')
    return handleError(err, callback)
  }

  var { method, body, calendarId, calendar_id, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'calendars' + '/' + encodeURIComponent(calendar_id || calendarId) + '/' + 'jobs' + '/' + encodeURIComponent(job_id || jobId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putDataFrameAnalytics = function mlPutDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putDatafeed = function mlPutDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['datafeed_id'] == null && params['datafeedId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putFilter = function mlPutFilterApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['filter_id'] == null && params['filterId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: filter_id or filterId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, filterId, filter_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'filters' + '/' + encodeURIComponent(filter_id || filterId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putJob = function mlPutJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.putTrainedModel = function mlPutTrainedModelApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['model_id'] == null && params['modelId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: model_id or modelId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, modelId, model_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_ml' + '/' + 'trained_models' + '/' + encodeURIComponent(model_id || modelId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.revertModelSnapshot = function mlRevertModelSnapshotApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params['snapshot_id'] == null && params['snapshotId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot_id or snapshotId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['snapshot_id'] != null || params['snapshotId'] != null) && ((params['job_id'] == null && params['jobId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId) + '/' + '_revert'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.setUpgradeMode = function mlSetUpgradeModeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'set_upgrade_mode'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.startDataFrameAnalytics = function mlStartDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.startDatafeed = function mlStartDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['datafeed_id'] == null && params['datafeedId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.stopDataFrameAnalytics = function mlStopDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.stopDatafeed = function mlStopDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['datafeed_id'] == null && params['datafeedId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateDataFrameAnalytics = function mlUpdateDataFrameAnalyticsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'data_frame' + '/' + 'analytics' + '/' + encodeURIComponent(id) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateDatafeed = function mlUpdateDatafeedApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['datafeed_id'] == null && params['datafeedId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: datafeed_id or datafeedId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, datafeedId, datafeed_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'datafeeds' + '/' + encodeURIComponent(datafeed_id || datafeedId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateFilter = function mlUpdateFilterApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['filter_id'] == null && params['filterId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: filter_id or filterId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, filterId, filter_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'filters' + '/' + encodeURIComponent(filter_id || filterId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateJob = function mlUpdateJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.updateModelSnapshot = function mlUpdateModelSnapshotApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['job_id'] == null && params['jobId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: job_id or jobId')
    return handleError(err, callback)
  }
  if (params['snapshot_id'] == null && params['snapshotId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot_id or snapshotId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['snapshot_id'] != null || params['snapshotId'] != null) && ((params['job_id'] == null && params['jobId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: job_id')
    return handleError(err, callback)
  }

  var { method, body, jobId, job_id, snapshotId, snapshot_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + encodeURIComponent(job_id || jobId) + '/' + 'model_snapshots' + '/' + encodeURIComponent(snapshot_id || snapshotId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.validate = function mlValidateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + '_validate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

MlApi.prototype.validateDetector = function mlValidateDetectorApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_ml' + '/' + 'anomaly_detectors' + '/' + '_validate' + '/' + 'detector'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(MlApi.prototype, {
  close_job: { get () { return this.closeJob } },
  delete_calendar: { get () { return this.deleteCalendar } },
  delete_calendar_event: { get () { return this.deleteCalendarEvent } },
  delete_calendar_job: { get () { return this.deleteCalendarJob } },
  delete_data_frame_analytics: { get () { return this.deleteDataFrameAnalytics } },
  delete_datafeed: { get () { return this.deleteDatafeed } },
  delete_expired_data: { get () { return this.deleteExpiredData } },
  delete_filter: { get () { return this.deleteFilter } },
  delete_forecast: { get () { return this.deleteForecast } },
  delete_job: { get () { return this.deleteJob } },
  delete_model_snapshot: { get () { return this.deleteModelSnapshot } },
  delete_trained_model: { get () { return this.deleteTrainedModel } },
  estimate_model_memory: { get () { return this.estimateModelMemory } },
  evaluate_data_frame: { get () { return this.evaluateDataFrame } },
  explain_data_frame_analytics: { get () { return this.explainDataFrameAnalytics } },
  find_file_structure: { get () { return this.findFileStructure } },
  flush_job: { get () { return this.flushJob } },
  get_buckets: { get () { return this.getBuckets } },
  get_calendar_events: { get () { return this.getCalendarEvents } },
  get_calendars: { get () { return this.getCalendars } },
  get_categories: { get () { return this.getCategories } },
  get_data_frame_analytics: { get () { return this.getDataFrameAnalytics } },
  get_data_frame_analytics_stats: { get () { return this.getDataFrameAnalyticsStats } },
  get_datafeed_stats: { get () { return this.getDatafeedStats } },
  get_datafeeds: { get () { return this.getDatafeeds } },
  get_filters: { get () { return this.getFilters } },
  get_influencers: { get () { return this.getInfluencers } },
  get_job_stats: { get () { return this.getJobStats } },
  get_jobs: { get () { return this.getJobs } },
  get_model_snapshots: { get () { return this.getModelSnapshots } },
  get_overall_buckets: { get () { return this.getOverallBuckets } },
  get_records: { get () { return this.getRecords } },
  get_trained_models: { get () { return this.getTrainedModels } },
  get_trained_models_stats: { get () { return this.getTrainedModelsStats } },
  open_job: { get () { return this.openJob } },
  post_calendar_events: { get () { return this.postCalendarEvents } },
  post_data: { get () { return this.postData } },
  preview_datafeed: { get () { return this.previewDatafeed } },
  put_calendar: { get () { return this.putCalendar } },
  put_calendar_job: { get () { return this.putCalendarJob } },
  put_data_frame_analytics: { get () { return this.putDataFrameAnalytics } },
  put_datafeed: { get () { return this.putDatafeed } },
  put_filter: { get () { return this.putFilter } },
  put_job: { get () { return this.putJob } },
  put_trained_model: { get () { return this.putTrainedModel } },
  revert_model_snapshot: { get () { return this.revertModelSnapshot } },
  set_upgrade_mode: { get () { return this.setUpgradeMode } },
  start_data_frame_analytics: { get () { return this.startDataFrameAnalytics } },
  start_datafeed: { get () { return this.startDatafeed } },
  stop_data_frame_analytics: { get () { return this.stopDataFrameAnalytics } },
  stop_datafeed: { get () { return this.stopDatafeed } },
  update_data_frame_analytics: { get () { return this.updateDataFrameAnalytics } },
  update_datafeed: { get () { return this.updateDatafeed } },
  update_filter: { get () { return this.updateFilter } },
  update_job: { get () { return this.updateJob } },
  update_model_snapshot: { get () { return this.updateModelSnapshot } },
  validate_detector: { get () { return this.validateDetector } }
})

module.exports = MlApi


/***/ }),

/***/ 9861:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['system_id', 'system_api_version', 'interval', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { systemId: 'system_id', systemApiVersion: 'system_api_version', errorTrace: 'error_trace', filterPath: 'filter_path' }

function MonitoringApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

MonitoringApi.prototype.bulk = function monitoringBulkApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((type) != null) {
    if (method == null) method = 'POST'
    path = '/' + '_monitoring' + '/' + encodeURIComponent(type) + '/' + 'bulk'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_monitoring' + '/' + 'bulk'
  }

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = MonitoringApi


/***/ }),

/***/ 4757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['search_type', 'max_concurrent_searches', 'typed_keys', 'pre_filter_shard_size', 'max_concurrent_shard_requests', 'rest_total_hits_as_int', 'ccs_minimize_roundtrips', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { searchType: 'search_type', maxConcurrentSearches: 'max_concurrent_searches', typedKeys: 'typed_keys', preFilterShardSize: 'pre_filter_shard_size', maxConcurrentShardRequests: 'max_concurrent_shard_requests', restTotalHitsAsInt: 'rest_total_hits_as_int', ccsMinimizeRoundtrips: 'ccs_minimize_roundtrips', errorTrace: 'error_trace', filterPath: 'filter_path' }

function msearchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_msearch'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_msearch'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_msearch'
  }

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = msearchApi


/***/ }),

/***/ 1596:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['search_type', 'typed_keys', 'max_concurrent_searches', 'rest_total_hits_as_int', 'ccs_minimize_roundtrips', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { searchType: 'search_type', typedKeys: 'typed_keys', maxConcurrentSearches: 'max_concurrent_searches', restTotalHitsAsInt: 'rest_total_hits_as_int', ccsMinimizeRoundtrips: 'ccs_minimize_roundtrips', errorTrace: 'error_trace', filterPath: 'filter_path' }

function msearchTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_msearch' + '/' + 'template'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_msearch' + '/' + 'template'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_msearch' + '/' + 'template'
  }

  // build request object
  const request = {
    method,
    path,
    bulkBody: body,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = msearchTemplateApi


/***/ }),

/***/ 1240:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['ids', 'term_statistics', 'field_statistics', 'fields', 'offsets', 'positions', 'payloads', 'preference', 'routing', 'realtime', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { termStatistics: 'term_statistics', fieldStatistics: 'field_statistics', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function mtermvectorsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_mtermvectors'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_mtermvectors'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_mtermvectors'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = mtermvectorsApi


/***/ }),

/***/ 7089:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['interval', 'snapshots', 'threads', 'ignore_idle_threads', 'type', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'flat_settings', 'completion_fields', 'fielddata_fields', 'fields', 'groups', 'level', 'types', 'include_segment_file_sizes']
const snakeCase = { ignoreIdleThreads: 'ignore_idle_threads', errorTrace: 'error_trace', filterPath: 'filter_path', flatSettings: 'flat_settings', completionFields: 'completion_fields', fielddataFields: 'fielddata_fields', includeSegmentFileSizes: 'include_segment_file_sizes' }

function NodesApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

NodesApi.prototype.hotThreads = function nodesHotThreadsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'hot_threads'
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'hotthreads'
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'hotthreads'
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_cluster' + '/' + 'nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'hot_threads'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'hot_threads'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.info = function nodesInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, nodeId, node_id, metric, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((node_id || nodeId) != null && (metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + encodeURIComponent(metric)
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId)
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.reloadSecureSettings = function nodesReloadSecureSettingsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, nodeId, node_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((node_id || nodeId) != null) {
    if (method == null) method = 'POST'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'reload_secure_settings'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_nodes' + '/' + 'reload_secure_settings'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.stats = function nodesStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, nodeId, node_id, metric, indexMetric, index_metric, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((node_id || nodeId) != null && (metric) != null && (index_metric || indexMetric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats' + '/' + encodeURIComponent(metric) + '/' + encodeURIComponent(index_metric || indexMetric)
  } else if ((node_id || nodeId) != null && (metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats' + '/' + encodeURIComponent(metric)
  } else if ((metric) != null && (index_metric || indexMetric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'stats' + '/' + encodeURIComponent(metric) + '/' + encodeURIComponent(index_metric || indexMetric)
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'stats'
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'stats' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

NodesApi.prototype.usage = function nodesUsageApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, nodeId, node_id, metric, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((node_id || nodeId) != null && (metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'usage' + '/' + encodeURIComponent(metric)
  } else if ((node_id || nodeId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + encodeURIComponent(node_id || nodeId) + '/' + 'usage'
  } else if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'usage' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_nodes' + '/' + 'usage'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(NodesApi.prototype, {
  hot_threads: { get () { return this.hotThreads } },
  reload_secure_settings: { get () { return this.reloadSecureSettings } }
})

module.exports = NodesApi


/***/ }),

/***/ 923:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['preference', 'routing', 'ignore_unavailable', 'expand_wildcards', 'keep_alive', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', expandWildcards: 'expand_wildcards', keepAlive: 'keep_alive', errorTrace: 'error_trace', filterPath: 'filter_path' }

function openPointInTimeApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_pit'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_pit'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = openPointInTimeApi


/***/ }),

/***/ 4539:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function pingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'HEAD'
  path = '/'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = pingApi


/***/ }),

/***/ 2321:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['timeout', 'master_timeout', 'context', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path' }

function putScriptApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['context'] != null && (params['id'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: id')
    return handleError(err, callback)
  }

  var { method, body, id, context, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null && (context) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_scripts' + '/' + encodeURIComponent(id) + '/' + encodeURIComponent(context)
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_scripts' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = putScriptApi


/***/ }),

/***/ 683:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'search_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function rankEvalApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_rank_eval'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_rank_eval'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = rankEvalApi


/***/ }),

/***/ 8919:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['refresh', 'timeout', 'wait_for_active_shards', 'wait_for_completion', 'requests_per_second', 'scroll', 'slices', 'max_docs', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', waitForCompletion: 'wait_for_completion', requestsPerSecond: 'requests_per_second', maxDocs: 'max_docs', errorTrace: 'error_trace', filterPath: 'filter_path' }

function reindexApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_reindex'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = reindexApi


/***/ }),

/***/ 643:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['requests_per_second', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function reindexRethrottleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['task_id'] == null && params['taskId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: task_id or taskId')
    return handleError(err, callback)
  }
  if (params['requests_per_second'] == null && params['requestsPerSecond'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: requests_per_second or requestsPerSecond')
    return handleError(err, callback)
  }

  var { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_reindex' + '/' + encodeURIComponent(task_id || taskId) + '/' + '_rethrottle'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = reindexRethrottleApi


/***/ }),

/***/ 9252:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function renderSearchTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_render' + '/' + 'template' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_render' + '/' + 'template'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = renderSearchTemplateApi


/***/ }),

/***/ 5711:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'typed_keys', 'rest_total_hits_as_int', 'wait_for_completion', 'timeout']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', typedKeys: 'typed_keys', restTotalHitsAsInt: 'rest_total_hits_as_int', waitForCompletion: 'wait_for_completion' }

function RollupApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

RollupApi.prototype.deleteJob = function rollupDeleteJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.getJobs = function rollupGetJobsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_rollup' + '/' + 'job'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.getRollupCaps = function rollupGetRollupCapsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_rollup' + '/' + 'data' + '/' + encodeURIComponent(id)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_rollup' + '/' + 'data'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.getRollupIndexCaps = function rollupGetRollupIndexCapsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + encodeURIComponent(index) + '/' + '_rollup' + '/' + 'data'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.putJob = function rollupPutJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.rollupSearch = function rollupRollupSearchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_rollup_search'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_rollup_search'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.startJob = function rollupStartJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id) + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

RollupApi.prototype.stopJob = function rollupStopJobApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_rollup' + '/' + 'job' + '/' + encodeURIComponent(id) + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(RollupApi.prototype, {
  delete_job: { get () { return this.deleteJob } },
  get_jobs: { get () { return this.getJobs } },
  get_rollup_caps: { get () { return this.getRollupCaps } },
  get_rollup_index_caps: { get () { return this.getRollupIndexCaps } },
  put_job: { get () { return this.putJob } },
  rollup_search: { get () { return this.rollupSearch } },
  start_job: { get () { return this.startJob } },
  stop_job: { get () { return this.stopJob } }
})

module.exports = RollupApi


/***/ }),

/***/ 9064:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function scriptsPainlessExecuteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_scripts' + '/' + 'painless' + '/' + '_execute'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = scriptsPainlessExecuteApi


/***/ }),

/***/ 3432:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['scroll', 'scroll_id', 'rest_total_hits_as_int', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { scrollId: 'scroll_id', restTotalHitsAsInt: 'rest_total_hits_as_int', errorTrace: 'error_trace', filterPath: 'filter_path' }

function scrollApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, scrollId, scroll_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((scroll_id || scrollId) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search' + '/' + 'scroll' + '/' + encodeURIComponent(scroll_id || scrollId)
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search' + '/' + 'scroll'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = scrollApi


/***/ }),

/***/ 1974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['analyzer', 'analyze_wildcard', 'ccs_minimize_roundtrips', 'default_operator', 'df', 'explain', 'stored_fields', 'docvalue_fields', 'from', 'ignore_unavailable', 'ignore_throttled', 'allow_no_indices', 'expand_wildcards', 'lenient', 'preference', 'q', 'routing', 'scroll', 'search_type', 'size', 'sort', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'terminate_after', 'stats', 'suggest_field', 'suggest_mode', 'suggest_size', 'suggest_text', 'timeout', 'track_scores', 'track_total_hits', 'allow_partial_search_results', 'typed_keys', 'version', 'seq_no_primary_term', 'request_cache', 'batched_reduce_size', 'max_concurrent_shard_requests', 'pre_filter_shard_size', 'rest_total_hits_as_int', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { analyzeWildcard: 'analyze_wildcard', ccsMinimizeRoundtrips: 'ccs_minimize_roundtrips', defaultOperator: 'default_operator', storedFields: 'stored_fields', docvalueFields: 'docvalue_fields', ignoreUnavailable: 'ignore_unavailable', ignoreThrottled: 'ignore_throttled', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', terminateAfter: 'terminate_after', suggestField: 'suggest_field', suggestMode: 'suggest_mode', suggestSize: 'suggest_size', suggestText: 'suggest_text', trackScores: 'track_scores', trackTotalHits: 'track_total_hits', allowPartialSearchResults: 'allow_partial_search_results', typedKeys: 'typed_keys', seqNoPrimaryTerm: 'seq_no_primary_term', requestCache: 'request_cache', batchedReduceSize: 'batched_reduce_size', maxConcurrentShardRequests: 'max_concurrent_shard_requests', preFilterShardSize: 'pre_filter_shard_size', restTotalHitsAsInt: 'rest_total_hits_as_int', errorTrace: 'error_trace', filterPath: 'filter_path' }

function searchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_search'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_search'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = searchApi


/***/ }),

/***/ 1434:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['preference', 'routing', 'local', 'ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', errorTrace: 'error_trace', filterPath: 'filter_path' }

function searchShardsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_search_shards'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search_shards'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = searchShardsApi


/***/ }),

/***/ 9874:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['ignore_unavailable', 'ignore_throttled', 'allow_no_indices', 'expand_wildcards', 'preference', 'routing', 'scroll', 'search_type', 'explain', 'profile', 'typed_keys', 'rest_total_hits_as_int', 'ccs_minimize_roundtrips', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', ignoreThrottled: 'ignore_throttled', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', typedKeys: 'typed_keys', restTotalHitsAsInt: 'rest_total_hits_as_int', ccsMinimizeRoundtrips: 'ccs_minimize_roundtrips', errorTrace: 'error_trace', filterPath: 'filter_path' }

function searchTemplateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_search' + '/' + 'template'
  } else if ((index) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_search' + '/' + 'template'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_search' + '/' + 'template'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = searchTemplateApi


/***/ }),

/***/ 2240:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['ignore_unavailable', 'allow_no_indices', 'expand_wildcards', 'index', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'master_timeout', 'wait_for_completion']
const snakeCase = { ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', errorTrace: 'error_trace', filterPath: 'filter_path', masterTimeout: 'master_timeout', waitForCompletion: 'wait_for_completion' }

function SearchableSnapshotsApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SearchableSnapshotsApi.prototype.clearCache = function searchableSnapshotsClearCacheApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_searchable_snapshots' + '/' + 'cache' + '/' + 'clear'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_searchable_snapshots' + '/' + 'cache' + '/' + 'clear'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SearchableSnapshotsApi.prototype.mount = function searchableSnapshotsMountApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params['snapshot'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if (params['snapshot'] != null && (params['repository'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot) + '/' + '_mount'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SearchableSnapshotsApi.prototype.repositoryStats = function searchableSnapshotsRepositoryStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SearchableSnapshotsApi.prototype.stats = function searchableSnapshotsStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, index, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null) {
    if (method == null) method = 'GET'
    path = '/' + encodeURIComponent(index) + '/' + '_searchable_snapshots' + '/' + 'stats'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_searchable_snapshots' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SearchableSnapshotsApi.prototype, {
  clear_cache: { get () { return this.clearCache } },
  repository_stats: { get () { return this.repositoryStats } }
})

module.exports = SearchableSnapshotsApi


/***/ }),

/***/ 9457:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'refresh', 'usernames', 'id', 'name', 'username', 'realm_name', 'owner']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', realmName: 'realm_name' }

function SecurityApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SecurityApi.prototype.authenticate = function securityAuthenticateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + '_authenticate'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.changePassword = function securityChangePasswordApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((username) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username) + '/' + '_password'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_security' + '/' + 'user' + '/' + '_password'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearApiKeyCache = function securityClearApiKeyCacheApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['ids'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: ids')
    return handleError(err, callback)
  }

  var { method, body, ids, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'api_key' + '/' + encodeURIComponent(ids) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearCachedPrivileges = function securityClearCachedPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['application'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: application')
    return handleError(err, callback)
  }

  var { method, body, application, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'privilege' + '/' + encodeURIComponent(application) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearCachedRealms = function securityClearCachedRealmsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['realms'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: realms')
    return handleError(err, callback)
  }

  var { method, body, realms, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'realm' + '/' + encodeURIComponent(realms) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.clearCachedRoles = function securityClearCachedRolesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'role' + '/' + encodeURIComponent(name) + '/' + '_clear_cache'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.createApiKey = function securityCreateApiKeyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'api_key'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deletePrivileges = function securityDeletePrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['application'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: application')
    return handleError(err, callback)
  }
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  // check required url components
  if (params['name'] != null && (params['application'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: application')
    return handleError(err, callback)
  }

  var { method, body, application, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'privilege' + '/' + encodeURIComponent(application) + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deleteRole = function securityDeleteRoleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'role' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deleteRoleMapping = function securityDeleteRoleMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'role_mapping' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.deleteUser = function securityDeleteUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['username'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: username')
    return handleError(err, callback)
  }

  var { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.disableUser = function securityDisableUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['username'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: username')
    return handleError(err, callback)
  }

  var { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username) + '/' + '_disable'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.enableUser = function securityEnableUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['username'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: username')
    return handleError(err, callback)
  }

  var { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username) + '/' + '_enable'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getApiKey = function securityGetApiKeyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + 'api_key'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getBuiltinPrivileges = function securityGetBuiltinPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + 'privilege' + '/' + '_builtin'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getPrivileges = function securityGetPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params['name'] != null && (params['application'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: application')
    return handleError(err, callback)
  }

  var { method, body, application, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((application) != null && (name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'privilege' + '/' + encodeURIComponent(application) + '/' + encodeURIComponent(name)
  } else if ((application) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'privilege' + '/' + encodeURIComponent(application)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'privilege'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getRole = function securityGetRoleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'role' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'role'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getRoleMapping = function securityGetRoleMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((name) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'role_mapping' + '/' + encodeURIComponent(name)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'role_mapping'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getToken = function securityGetTokenApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'oauth2' + '/' + 'token'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getUser = function securityGetUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((username) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_security' + '/' + 'user'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.getUserPrivileges = function securityGetUserPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_security' + '/' + 'user' + '/' + '_privileges'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.grantApiKey = function securityGrantApiKeyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_security' + '/' + 'api_key' + '/' + 'grant'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.hasPrivileges = function securityHasPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, user, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((user) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(user) + '/' + '_has_privileges'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + '_security' + '/' + 'user' + '/' + '_has_privileges'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.invalidateApiKey = function securityInvalidateApiKeyApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'api_key'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.invalidateToken = function securityInvalidateTokenApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_security' + '/' + 'oauth2' + '/' + 'token'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.putPrivileges = function securityPutPrivilegesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'privilege'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.putRole = function securityPutRoleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'role' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.putRoleMapping = function securityPutRoleMappingApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['name'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: name')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, name, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'role_mapping' + '/' + encodeURIComponent(name)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SecurityApi.prototype.putUser = function securityPutUserApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['username'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: username')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, username, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_security' + '/' + 'user' + '/' + encodeURIComponent(username)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SecurityApi.prototype, {
  change_password: { get () { return this.changePassword } },
  clear_api_key_cache: { get () { return this.clearApiKeyCache } },
  clear_cached_privileges: { get () { return this.clearCachedPrivileges } },
  clear_cached_realms: { get () { return this.clearCachedRealms } },
  clear_cached_roles: { get () { return this.clearCachedRoles } },
  create_api_key: { get () { return this.createApiKey } },
  delete_privileges: { get () { return this.deletePrivileges } },
  delete_role: { get () { return this.deleteRole } },
  delete_role_mapping: { get () { return this.deleteRoleMapping } },
  delete_user: { get () { return this.deleteUser } },
  disable_user: { get () { return this.disableUser } },
  enable_user: { get () { return this.enableUser } },
  get_api_key: { get () { return this.getApiKey } },
  get_builtin_privileges: { get () { return this.getBuiltinPrivileges } },
  get_privileges: { get () { return this.getPrivileges } },
  get_role: { get () { return this.getRole } },
  get_role_mapping: { get () { return this.getRoleMapping } },
  get_token: { get () { return this.getToken } },
  get_user: { get () { return this.getUser } },
  get_user_privileges: { get () { return this.getUserPrivileges } },
  grant_api_key: { get () { return this.grantApiKey } },
  has_privileges: { get () { return this.hasPrivileges } },
  invalidate_api_key: { get () { return this.invalidateApiKey } },
  invalidate_token: { get () { return this.invalidateToken } },
  put_privileges: { get () { return this.putPrivileges } },
  put_role: { get () { return this.putRole } },
  put_role_mapping: { get () { return this.putRoleMapping } },
  put_user: { get () { return this.putUser } }
})

module.exports = SecurityApi


/***/ }),

/***/ 1395:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function SlmApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SlmApi.prototype.deleteLifecycle = function slmDeleteLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['policy_id'] == null && params['policyId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy_id or policyId')
    return handleError(err, callback)
  }

  var { method, body, policyId, policy_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_slm' + '/' + 'policy' + '/' + encodeURIComponent(policy_id || policyId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.executeLifecycle = function slmExecuteLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['policy_id'] == null && params['policyId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy_id or policyId')
    return handleError(err, callback)
  }

  var { method, body, policyId, policy_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_slm' + '/' + 'policy' + '/' + encodeURIComponent(policy_id || policyId) + '/' + '_execute'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.executeRetention = function slmExecuteRetentionApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_slm' + '/' + '_execute_retention'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.getLifecycle = function slmGetLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, policyId, policy_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((policy_id || policyId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_slm' + '/' + 'policy' + '/' + encodeURIComponent(policy_id || policyId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_slm' + '/' + 'policy'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.getStats = function slmGetStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_slm' + '/' + 'stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.getStatus = function slmGetStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_slm' + '/' + 'status'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.putLifecycle = function slmPutLifecycleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['policy_id'] == null && params['policyId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: policy_id or policyId')
    return handleError(err, callback)
  }

  var { method, body, policyId, policy_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_slm' + '/' + 'policy' + '/' + encodeURIComponent(policy_id || policyId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.start = function slmStartApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_slm' + '/' + 'start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SlmApi.prototype.stop = function slmStopApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_slm' + '/' + 'stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SlmApi.prototype, {
  delete_lifecycle: { get () { return this.deleteLifecycle } },
  execute_lifecycle: { get () { return this.executeLifecycle } },
  execute_retention: { get () { return this.executeRetention } },
  get_lifecycle: { get () { return this.getLifecycle } },
  get_stats: { get () { return this.getStats } },
  get_status: { get () { return this.getStatus } },
  put_lifecycle: { get () { return this.putLifecycle } }
})

module.exports = SlmApi


/***/ }),

/***/ 3536:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['master_timeout', 'timeout', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'wait_for_completion', 'verify', 'ignore_unavailable', 'verbose', 'local']
const snakeCase = { masterTimeout: 'master_timeout', errorTrace: 'error_trace', filterPath: 'filter_path', waitForCompletion: 'wait_for_completion', ignoreUnavailable: 'ignore_unavailable' }

function SnapshotApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SnapshotApi.prototype.cleanupRepository = function snapshotCleanupRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_cleanup'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.clone = function snapshotCloneApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params['snapshot'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }
  if (params['target_snapshot'] == null && params['targetSnapshot'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: target_snapshot or targetSnapshot')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['target_snapshot'] != null || params['targetSnapshot'] != null) && (params['snapshot'] == null || params['repository'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: snapshot, repository')
    return handleError(err, callback)
  } else if (params['snapshot'] != null && (params['repository'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, snapshot, targetSnapshot, target_snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot) + '/' + '_clone' + '/' + encodeURIComponent(target_snapshot || targetSnapshot)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.create = function snapshotCreateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params['snapshot'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }

  // check required url components
  if (params['snapshot'] != null && (params['repository'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.createRepository = function snapshotCreateRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.delete = function snapshotDeleteApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params['snapshot'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }

  // check required url components
  if (params['snapshot'] != null && (params['repository'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.deleteRepository = function snapshotDeleteRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.get = function snapshotGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params['snapshot'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }

  // check required url components
  if (params['snapshot'] != null && (params['repository'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.getRepository = function snapshotGetRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((repository) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot' + '/' + encodeURIComponent(repository)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.restore = function snapshotRestoreApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }
  if (params['snapshot'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: snapshot')
    return handleError(err, callback)
  }

  // check required url components
  if (params['snapshot'] != null && (params['repository'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot) + '/' + '_restore'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.status = function snapshotStatusApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required url components
  if (params['snapshot'] != null && (params['repository'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, snapshot, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((repository) != null && (snapshot) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + encodeURIComponent(snapshot) + '/' + '_status'
  } else if ((repository) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_status'
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_snapshot' + '/' + '_status'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

SnapshotApi.prototype.verifyRepository = function snapshotVerifyRepositoryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['repository'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: repository')
    return handleError(err, callback)
  }

  var { method, body, repository, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_snapshot' + '/' + encodeURIComponent(repository) + '/' + '_verify'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SnapshotApi.prototype, {
  cleanup_repository: { get () { return this.cleanupRepository } },
  create_repository: { get () { return this.createRepository } },
  delete_repository: { get () { return this.deleteRepository } },
  get_repository: { get () { return this.getRepository } },
  verify_repository: { get () { return this.verifyRepository } }
})

module.exports = SnapshotApi


/***/ }),

/***/ 8150:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'format']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function SqlApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SqlApi.prototype.clearCursor = function sqlClearCursorApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_sql' + '/' + 'close'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SqlApi.prototype.query = function sqlQueryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_sql'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

SqlApi.prototype.translate = function sqlTranslateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = body == null ? 'GET' : 'POST'
  path = '/' + '_sql' + '/' + 'translate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(SqlApi.prototype, {
  clear_cursor: { get () { return this.clearCursor } }
})

module.exports = SqlApi


/***/ }),

/***/ 6805:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path' }

function SslApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

SslApi.prototype.certificates = function sslCertificatesApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_ssl' + '/' + 'certificates'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = SslApi


/***/ }),

/***/ 8917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['nodes', 'actions', 'parent_task_id', 'wait_for_completion', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'timeout', 'detailed', 'group_by']
const snakeCase = { parentTaskId: 'parent_task_id', waitForCompletion: 'wait_for_completion', errorTrace: 'error_trace', filterPath: 'filter_path', groupBy: 'group_by' }

function TasksApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

TasksApi.prototype.cancel = function tasksCancelApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((task_id || taskId) != null) {
    if (method == null) method = 'POST'
    path = '/' + '_tasks' + '/' + encodeURIComponent(task_id || taskId) + '/' + '_cancel'
  } else {
    if (method == null) method = 'POST'
    path = '/' + '_tasks' + '/' + '_cancel'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TasksApi.prototype.get = function tasksGetApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['task_id'] == null && params['taskId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: task_id or taskId')
    return handleError(err, callback)
  }

  var { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_tasks' + '/' + encodeURIComponent(task_id || taskId)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

TasksApi.prototype.list = function tasksListApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_tasks'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = TasksApi


/***/ }),

/***/ 1796:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['term_statistics', 'field_statistics', 'fields', 'offsets', 'positions', 'payloads', 'preference', 'routing', 'realtime', 'version', 'version_type', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { termStatistics: 'term_statistics', fieldStatistics: 'field_statistics', versionType: 'version_type', errorTrace: 'error_trace', filterPath: 'filter_path' }

function termvectorsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  var { method, body, index, id, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_termvectors'
  } else if ((index) != null && (id) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_termvectors' + '/' + encodeURIComponent(id)
  } else if ((index) != null && (type) != null) {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_termvectors'
  } else {
    if (method == null) method = body == null ? 'GET' : 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_termvectors'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = termvectorsApi


/***/ }),

/***/ 3881:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['force', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'from', 'size', 'allow_no_match', 'defer_validation', 'timeout', 'wait_for_completion', 'wait_for_checkpoint']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', allowNoMatch: 'allow_no_match', deferValidation: 'defer_validation', waitForCompletion: 'wait_for_completion', waitForCheckpoint: 'wait_for_checkpoint' }

function TransformApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

TransformApi.prototype.deleteTransform = function transformDeleteTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['transform_id'] == null && params['transformId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }

  var { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.getTransform = function transformGetTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((transform_id || transformId) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_transform'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.getTransformStats = function transformGetTransformStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['transform_id'] == null && params['transformId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }

  var { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId) + '/' + '_stats'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.previewTransform = function transformPreviewTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_transform' + '/' + '_preview'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.putTransform = function transformPutTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['transform_id'] == null && params['transformId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.startTransform = function transformStartTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['transform_id'] == null && params['transformId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }

  var { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId) + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.stopTransform = function transformStopTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['transform_id'] == null && params['transformId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }

  var { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId) + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

TransformApi.prototype.updateTransform = function transformUpdateTransformApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['transform_id'] == null && params['transformId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: transform_id or transformId')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, transformId, transform_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_transform' + '/' + encodeURIComponent(transform_id || transformId) + '/' + '_update'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(TransformApi.prototype, {
  delete_transform: { get () { return this.deleteTransform } },
  get_transform: { get () { return this.getTransform } },
  get_transform_stats: { get () { return this.getTransformStats } },
  preview_transform: { get () { return this.previewTransform } },
  put_transform: { get () { return this.putTransform } },
  start_transform: { get () { return this.startTransform } },
  stop_transform: { get () { return this.stopTransform } },
  update_transform: { get () { return this.updateTransform } }
})

module.exports = TransformApi


/***/ }),

/***/ 8676:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['wait_for_active_shards', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'lang', 'refresh', 'retry_on_conflict', 'routing', 'timeout', 'if_seq_no', 'if_primary_term', 'require_alias', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { waitForActiveShards: 'wait_for_active_shards', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', retryOnConflict: 'retry_on_conflict', ifSeqNo: 'if_seq_no', ifPrimaryTerm: 'if_primary_term', requireAlias: 'require_alias', errorTrace: 'error_trace', filterPath: 'filter_path' }

function updateApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }
  if (params['body'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: body')
    return handleError(err, callback)
  }

  var { method, body, id, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null && (id) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + encodeURIComponent(id) + '/' + '_update'
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_update' + '/' + encodeURIComponent(id)
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = updateApi


/***/ }),

/***/ 4651:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['analyzer', 'analyze_wildcard', 'default_operator', 'df', 'from', 'ignore_unavailable', 'allow_no_indices', 'conflicts', 'expand_wildcards', 'lenient', 'pipeline', 'preference', 'q', 'routing', 'scroll', 'search_type', 'search_timeout', 'size', 'max_docs', 'sort', '_source', '_source_excludes', '_source_exclude', '_source_includes', '_source_include', 'terminate_after', 'stats', 'version', 'version_type', 'request_cache', 'refresh', 'timeout', 'wait_for_active_shards', 'scroll_size', 'wait_for_completion', 'requests_per_second', 'slices', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { analyzeWildcard: 'analyze_wildcard', defaultOperator: 'default_operator', ignoreUnavailable: 'ignore_unavailable', allowNoIndices: 'allow_no_indices', expandWildcards: 'expand_wildcards', searchType: 'search_type', searchTimeout: 'search_timeout', maxDocs: 'max_docs', _sourceExcludes: '_source_excludes', _sourceExclude: '_source_exclude', _sourceIncludes: '_source_includes', _sourceInclude: '_source_include', terminateAfter: 'terminate_after', versionType: 'version_type', requestCache: 'request_cache', waitForActiveShards: 'wait_for_active_shards', scrollSize: 'scroll_size', waitForCompletion: 'wait_for_completion', requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function updateByQueryApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['index'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: index')
    return handleError(err, callback)
  }

  // check required url components
  if (params['type'] != null && (params['index'] == null)) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: index')
    return handleError(err, callback)
  }

  var { method, body, index, type, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((index) != null && (type) != null) {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + encodeURIComponent(type) + '/' + '_update_by_query'
  } else {
    if (method == null) method = 'POST'
    path = '/' + encodeURIComponent(index) + '/' + '_update_by_query'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = updateByQueryApi


/***/ }),

/***/ 6879:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['requests_per_second', 'pretty', 'human', 'error_trace', 'source', 'filter_path']
const snakeCase = { requestsPerSecond: 'requests_per_second', errorTrace: 'error_trace', filterPath: 'filter_path' }

function updateByQueryRethrottleApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['task_id'] == null && params['taskId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: task_id or taskId')
    return handleError(err, callback)
  }
  if (params['requests_per_second'] == null && params['requestsPerSecond'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: requests_per_second or requestsPerSecond')
    return handleError(err, callback)
  }

  var { method, body, taskId, task_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_update_by_query' + '/' + encodeURIComponent(task_id || taskId) + '/' + '_rethrottle'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = updateByQueryRethrottleApi


/***/ }),

/***/ 1085:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['pretty', 'human', 'error_trace', 'source', 'filter_path', 'debug', 'active', 'version', 'if_seq_no', 'if_primary_term', 'metric', 'emit_stacktraces']
const snakeCase = { errorTrace: 'error_trace', filterPath: 'filter_path', ifSeqNo: 'if_seq_no', ifPrimaryTerm: 'if_primary_term', emitStacktraces: 'emit_stacktraces' }

function WatcherApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

WatcherApi.prototype.ackWatch = function watcherAckWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['watch_id'] == null && params['watchId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: watch_id or watchId')
    return handleError(err, callback)
  }

  // check required url components
  if ((params['action_id'] != null || params['actionId'] != null) && ((params['watch_id'] == null && params['watchId'] == null))) {
    const err = new this[kConfigurationError]('Missing required parameter of the url: watch_id')
    return handleError(err, callback)
  }

  var { method, body, watchId, watch_id, actionId, action_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((watch_id || watchId) != null && (action_id || actionId) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(watch_id || watchId) + '/' + '_ack' + '/' + encodeURIComponent(action_id || actionId)
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(watch_id || watchId) + '/' + '_ack'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.activateWatch = function watcherActivateWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['watch_id'] == null && params['watchId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: watch_id or watchId')
    return handleError(err, callback)
  }

  var { method, body, watchId, watch_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(watch_id || watchId) + '/' + '_activate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.deactivateWatch = function watcherDeactivateWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['watch_id'] == null && params['watchId'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: watch_id or watchId')
    return handleError(err, callback)
  }

  var { method, body, watchId, watch_id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(watch_id || watchId) + '/' + '_deactivate'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.deleteWatch = function watcherDeleteWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'DELETE'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.executeWatch = function watcherExecuteWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((id) != null) {
    if (method == null) method = 'PUT'
    path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(id) + '/' + '_execute'
  } else {
    if (method == null) method = 'PUT'
    path = '/' + '_watcher' + '/' + 'watch' + '/' + '_execute'
  }

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.getWatch = function watcherGetWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.putWatch = function watcherPutWatchApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  // check required parameters
  if (params['id'] == null) {
    const err = new this[kConfigurationError]('Missing required parameter: id')
    return handleError(err, callback)
  }

  var { method, body, id, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'PUT'
  path = '/' + '_watcher' + '/' + 'watch' + '/' + encodeURIComponent(id)

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.start = function watcherStartApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_watcher' + '/' + '_start'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.stats = function watcherStatsApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, metric, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if ((metric) != null) {
    if (method == null) method = 'GET'
    path = '/' + '_watcher' + '/' + 'stats' + '/' + encodeURIComponent(metric)
  } else {
    if (method == null) method = 'GET'
    path = '/' + '_watcher' + '/' + 'stats'
  }

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

WatcherApi.prototype.stop = function watcherStopApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'POST'
  path = '/' + '_watcher' + '/' + '_stop'

  // build request object
  const request = {
    method,
    path,
    body: body || '',
    querystring
  }

  return this.transport.request(request, options, callback)
}

Object.defineProperties(WatcherApi.prototype, {
  ack_watch: { get () { return this.ackWatch } },
  activate_watch: { get () { return this.activateWatch } },
  deactivate_watch: { get () { return this.deactivateWatch } },
  delete_watch: { get () { return this.deleteWatch } },
  execute_watch: { get () { return this.executeWatch } },
  get_watch: { get () { return this.getWatch } },
  put_watch: { get () { return this.putWatch } }
})

module.exports = WatcherApi


/***/ }),

/***/ 4323:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */

const { handleError, snakeCaseKeys, normalizeArguments, kConfigurationError } = __webpack_require__(5230)
const acceptedQuerystring = ['categories', 'accept_enterprise', 'pretty', 'human', 'error_trace', 'source', 'filter_path', 'master_timeout']
const snakeCase = { acceptEnterprise: 'accept_enterprise', errorTrace: 'error_trace', filterPath: 'filter_path', masterTimeout: 'master_timeout' }

function XpackApi (transport, ConfigurationError) {
  this.transport = transport
  this[kConfigurationError] = ConfigurationError
}

XpackApi.prototype.info = function xpackInfoApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_xpack'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

XpackApi.prototype.usage = function xpackUsageApi (params, options, callback) {
  ;[params, options, callback] = normalizeArguments(params, options, callback)

  var { method, body, ...querystring } = params
  querystring = snakeCaseKeys(acceptedQuerystring, snakeCase, querystring)

  var path = ''
  if (method == null) method = 'GET'
  path = '/' + '_xpack' + '/' + 'usage'

  // build request object
  const request = {
    method,
    path,
    body: null,
    querystring
  }

  return this.transport.request(request, options, callback)
}

module.exports = XpackApi


/***/ }),

/***/ 8608:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const bulkApi = __webpack_require__(7630)
const CatApi = __webpack_require__(8887)
const clearScrollApi = __webpack_require__(7259)
const ClusterApi = __webpack_require__(6323)
const countApi = __webpack_require__(7944)
const createApi = __webpack_require__(3555)
const DanglingIndicesApi = __webpack_require__(8540)
const deleteApi = __webpack_require__(6080)
const deleteByQueryApi = __webpack_require__(2109)
const deleteByQueryRethrottleApi = __webpack_require__(2264)
const deleteScriptApi = __webpack_require__(3107)
const existsApi = __webpack_require__(1297)
const existsSourceApi = __webpack_require__(5602)
const explainApi = __webpack_require__(8941)
const fieldCapsApi = __webpack_require__(7109)
const getApi = __webpack_require__(7210)
const getScriptApi = __webpack_require__(6482)
const getScriptContextApi = __webpack_require__(8031)
const getScriptLanguagesApi = __webpack_require__(8681)
const getSourceApi = __webpack_require__(1488)
const indexApi = __webpack_require__(9835)
const IndicesApi = __webpack_require__(9820)
const infoApi = __webpack_require__(5188)
const IngestApi = __webpack_require__(5631)
const mgetApi = __webpack_require__(3803)
const msearchApi = __webpack_require__(4757)
const msearchTemplateApi = __webpack_require__(1596)
const mtermvectorsApi = __webpack_require__(1240)
const NodesApi = __webpack_require__(7089)
const pingApi = __webpack_require__(4539)
const putScriptApi = __webpack_require__(2321)
const rankEvalApi = __webpack_require__(683)
const reindexApi = __webpack_require__(8919)
const reindexRethrottleApi = __webpack_require__(643)
const renderSearchTemplateApi = __webpack_require__(9252)
const scriptsPainlessExecuteApi = __webpack_require__(9064)
const scrollApi = __webpack_require__(3432)
const searchApi = __webpack_require__(1974)
const searchShardsApi = __webpack_require__(1434)
const searchTemplateApi = __webpack_require__(9874)
const SnapshotApi = __webpack_require__(3536)
const TasksApi = __webpack_require__(8917)
const termvectorsApi = __webpack_require__(1796)
const updateApi = __webpack_require__(8676)
const updateByQueryApi = __webpack_require__(4651)
const updateByQueryRethrottleApi = __webpack_require__(6879)
const AsyncSearchApi = __webpack_require__(6188)
const AutoscalingApi = __webpack_require__(3070)
const CcrApi = __webpack_require__(9287)
const closePointInTimeApi = __webpack_require__(3294)
const EnrichApi = __webpack_require__(6350)
const EqlApi = __webpack_require__(941)
const GraphApi = __webpack_require__(6235)
const IlmApi = __webpack_require__(9790)
const LicenseApi = __webpack_require__(1510)
const MigrationApi = __webpack_require__(8652)
const MlApi = __webpack_require__(842)
const MonitoringApi = __webpack_require__(9861)
const openPointInTimeApi = __webpack_require__(923)
const RollupApi = __webpack_require__(5711)
const SearchableSnapshotsApi = __webpack_require__(2240)
const SecurityApi = __webpack_require__(9457)
const SlmApi = __webpack_require__(1395)
const SqlApi = __webpack_require__(8150)
const SslApi = __webpack_require__(6805)
const TransformApi = __webpack_require__(3881)
const WatcherApi = __webpack_require__(1085)
const XpackApi = __webpack_require__(4323)

const { kConfigurationError } = __webpack_require__(5230)
const kCat = Symbol('Cat')
const kCluster = Symbol('Cluster')
const kDanglingIndices = Symbol('DanglingIndices')
const kIndices = Symbol('Indices')
const kIngest = Symbol('Ingest')
const kNodes = Symbol('Nodes')
const kSnapshot = Symbol('Snapshot')
const kTasks = Symbol('Tasks')
const kAsyncSearch = Symbol('AsyncSearch')
const kAutoscaling = Symbol('Autoscaling')
const kCcr = Symbol('Ccr')
const kEnrich = Symbol('Enrich')
const kEql = Symbol('Eql')
const kGraph = Symbol('Graph')
const kIlm = Symbol('Ilm')
const kLicense = Symbol('License')
const kMigration = Symbol('Migration')
const kMl = Symbol('Ml')
const kMonitoring = Symbol('Monitoring')
const kRollup = Symbol('Rollup')
const kSearchableSnapshots = Symbol('SearchableSnapshots')
const kSecurity = Symbol('Security')
const kSlm = Symbol('Slm')
const kSql = Symbol('Sql')
const kSsl = Symbol('Ssl')
const kTransform = Symbol('Transform')
const kWatcher = Symbol('Watcher')
const kXpack = Symbol('Xpack')

function ESAPI (opts) {
  this[kConfigurationError] = opts.ConfigurationError
  this[kCat] = null
  this[kCluster] = null
  this[kDanglingIndices] = null
  this[kIndices] = null
  this[kIngest] = null
  this[kNodes] = null
  this[kSnapshot] = null
  this[kTasks] = null
  this[kAsyncSearch] = null
  this[kAutoscaling] = null
  this[kCcr] = null
  this[kEnrich] = null
  this[kEql] = null
  this[kGraph] = null
  this[kIlm] = null
  this[kLicense] = null
  this[kMigration] = null
  this[kMl] = null
  this[kMonitoring] = null
  this[kRollup] = null
  this[kSearchableSnapshots] = null
  this[kSecurity] = null
  this[kSlm] = null
  this[kSql] = null
  this[kSsl] = null
  this[kTransform] = null
  this[kWatcher] = null
  this[kXpack] = null
}

ESAPI.prototype.bulk = bulkApi
ESAPI.prototype.clearScroll = clearScrollApi
ESAPI.prototype.count = countApi
ESAPI.prototype.create = createApi
ESAPI.prototype.delete = deleteApi
ESAPI.prototype.deleteByQuery = deleteByQueryApi
ESAPI.prototype.deleteByQueryRethrottle = deleteByQueryRethrottleApi
ESAPI.prototype.deleteScript = deleteScriptApi
ESAPI.prototype.exists = existsApi
ESAPI.prototype.existsSource = existsSourceApi
ESAPI.prototype.explain = explainApi
ESAPI.prototype.fieldCaps = fieldCapsApi
ESAPI.prototype.get = getApi
ESAPI.prototype.getScript = getScriptApi
ESAPI.prototype.getScriptContext = getScriptContextApi
ESAPI.prototype.getScriptLanguages = getScriptLanguagesApi
ESAPI.prototype.getSource = getSourceApi
ESAPI.prototype.index = indexApi
ESAPI.prototype.info = infoApi
ESAPI.prototype.mget = mgetApi
ESAPI.prototype.msearch = msearchApi
ESAPI.prototype.msearchTemplate = msearchTemplateApi
ESAPI.prototype.mtermvectors = mtermvectorsApi
ESAPI.prototype.ping = pingApi
ESAPI.prototype.putScript = putScriptApi
ESAPI.prototype.rankEval = rankEvalApi
ESAPI.prototype.reindex = reindexApi
ESAPI.prototype.reindexRethrottle = reindexRethrottleApi
ESAPI.prototype.renderSearchTemplate = renderSearchTemplateApi
ESAPI.prototype.scriptsPainlessExecute = scriptsPainlessExecuteApi
ESAPI.prototype.scroll = scrollApi
ESAPI.prototype.search = searchApi
ESAPI.prototype.searchShards = searchShardsApi
ESAPI.prototype.searchTemplate = searchTemplateApi
ESAPI.prototype.termvectors = termvectorsApi
ESAPI.prototype.update = updateApi
ESAPI.prototype.updateByQuery = updateByQueryApi
ESAPI.prototype.updateByQueryRethrottle = updateByQueryRethrottleApi
ESAPI.prototype.closePointInTime = closePointInTimeApi
ESAPI.prototype.openPointInTime = openPointInTimeApi

Object.defineProperties(ESAPI.prototype, {
  cat: {
    get () {
      if (this[kCat] === null) {
        this[kCat] = new CatApi(this.transport, this[kConfigurationError])
      }
      return this[kCat]
    }
  },
  clear_scroll: { get () { return this.clearScroll } },
  cluster: {
    get () {
      if (this[kCluster] === null) {
        this[kCluster] = new ClusterApi(this.transport, this[kConfigurationError])
      }
      return this[kCluster]
    }
  },
  danglingIndices: {
    get () {
      if (this[kDanglingIndices] === null) {
        this[kDanglingIndices] = new DanglingIndicesApi(this.transport, this[kConfigurationError])
      }
      return this[kDanglingIndices]
    }
  },
  dangling_indices: { get () { return this.danglingIndices } },
  delete_by_query: { get () { return this.deleteByQuery } },
  delete_by_query_rethrottle: { get () { return this.deleteByQueryRethrottle } },
  delete_script: { get () { return this.deleteScript } },
  exists_source: { get () { return this.existsSource } },
  field_caps: { get () { return this.fieldCaps } },
  get_script: { get () { return this.getScript } },
  get_script_context: { get () { return this.getScriptContext } },
  get_script_languages: { get () { return this.getScriptLanguages } },
  get_source: { get () { return this.getSource } },
  indices: {
    get () {
      if (this[kIndices] === null) {
        this[kIndices] = new IndicesApi(this.transport, this[kConfigurationError])
      }
      return this[kIndices]
    }
  },
  ingest: {
    get () {
      if (this[kIngest] === null) {
        this[kIngest] = new IngestApi(this.transport, this[kConfigurationError])
      }
      return this[kIngest]
    }
  },
  msearch_template: { get () { return this.msearchTemplate } },
  nodes: {
    get () {
      if (this[kNodes] === null) {
        this[kNodes] = new NodesApi(this.transport, this[kConfigurationError])
      }
      return this[kNodes]
    }
  },
  put_script: { get () { return this.putScript } },
  rank_eval: { get () { return this.rankEval } },
  reindex_rethrottle: { get () { return this.reindexRethrottle } },
  render_search_template: { get () { return this.renderSearchTemplate } },
  scripts_painless_execute: { get () { return this.scriptsPainlessExecute } },
  search_shards: { get () { return this.searchShards } },
  search_template: { get () { return this.searchTemplate } },
  snapshot: {
    get () {
      if (this[kSnapshot] === null) {
        this[kSnapshot] = new SnapshotApi(this.transport, this[kConfigurationError])
      }
      return this[kSnapshot]
    }
  },
  tasks: {
    get () {
      if (this[kTasks] === null) {
        this[kTasks] = new TasksApi(this.transport, this[kConfigurationError])
      }
      return this[kTasks]
    }
  },
  update_by_query: { get () { return this.updateByQuery } },
  update_by_query_rethrottle: { get () { return this.updateByQueryRethrottle } },
  asyncSearch: {
    get () {
      if (this[kAsyncSearch] === null) {
        this[kAsyncSearch] = new AsyncSearchApi(this.transport, this[kConfigurationError])
      }
      return this[kAsyncSearch]
    }
  },
  async_search: { get () { return this.asyncSearch } },
  autoscaling: {
    get () {
      if (this[kAutoscaling] === null) {
        this[kAutoscaling] = new AutoscalingApi(this.transport, this[kConfigurationError])
      }
      return this[kAutoscaling]
    }
  },
  ccr: {
    get () {
      if (this[kCcr] === null) {
        this[kCcr] = new CcrApi(this.transport, this[kConfigurationError])
      }
      return this[kCcr]
    }
  },
  close_point_in_time: { get () { return this.closePointInTime } },
  enrich: {
    get () {
      if (this[kEnrich] === null) {
        this[kEnrich] = new EnrichApi(this.transport, this[kConfigurationError])
      }
      return this[kEnrich]
    }
  },
  eql: {
    get () {
      if (this[kEql] === null) {
        this[kEql] = new EqlApi(this.transport, this[kConfigurationError])
      }
      return this[kEql]
    }
  },
  graph: {
    get () {
      if (this[kGraph] === null) {
        this[kGraph] = new GraphApi(this.transport, this[kConfigurationError])
      }
      return this[kGraph]
    }
  },
  ilm: {
    get () {
      if (this[kIlm] === null) {
        this[kIlm] = new IlmApi(this.transport, this[kConfigurationError])
      }
      return this[kIlm]
    }
  },
  license: {
    get () {
      if (this[kLicense] === null) {
        this[kLicense] = new LicenseApi(this.transport, this[kConfigurationError])
      }
      return this[kLicense]
    }
  },
  migration: {
    get () {
      if (this[kMigration] === null) {
        this[kMigration] = new MigrationApi(this.transport, this[kConfigurationError])
      }
      return this[kMigration]
    }
  },
  ml: {
    get () {
      if (this[kMl] === null) {
        this[kMl] = new MlApi(this.transport, this[kConfigurationError])
      }
      return this[kMl]
    }
  },
  monitoring: {
    get () {
      if (this[kMonitoring] === null) {
        this[kMonitoring] = new MonitoringApi(this.transport, this[kConfigurationError])
      }
      return this[kMonitoring]
    }
  },
  open_point_in_time: { get () { return this.openPointInTime } },
  rollup: {
    get () {
      if (this[kRollup] === null) {
        this[kRollup] = new RollupApi(this.transport, this[kConfigurationError])
      }
      return this[kRollup]
    }
  },
  searchableSnapshots: {
    get () {
      if (this[kSearchableSnapshots] === null) {
        this[kSearchableSnapshots] = new SearchableSnapshotsApi(this.transport, this[kConfigurationError])
      }
      return this[kSearchableSnapshots]
    }
  },
  searchable_snapshots: { get () { return this.searchableSnapshots } },
  security: {
    get () {
      if (this[kSecurity] === null) {
        this[kSecurity] = new SecurityApi(this.transport, this[kConfigurationError])
      }
      return this[kSecurity]
    }
  },
  slm: {
    get () {
      if (this[kSlm] === null) {
        this[kSlm] = new SlmApi(this.transport, this[kConfigurationError])
      }
      return this[kSlm]
    }
  },
  sql: {
    get () {
      if (this[kSql] === null) {
        this[kSql] = new SqlApi(this.transport, this[kConfigurationError])
      }
      return this[kSql]
    }
  },
  ssl: {
    get () {
      if (this[kSsl] === null) {
        this[kSsl] = new SslApi(this.transport, this[kConfigurationError])
      }
      return this[kSsl]
    }
  },
  transform: {
    get () {
      if (this[kTransform] === null) {
        this[kTransform] = new TransformApi(this.transport, this[kConfigurationError])
      }
      return this[kTransform]
    }
  },
  watcher: {
    get () {
      if (this[kWatcher] === null) {
        this[kWatcher] = new WatcherApi(this.transport, this[kConfigurationError])
      }
      return this[kWatcher]
    }
  },
  xpack: {
    get () {
      if (this[kXpack] === null) {
        this[kXpack] = new XpackApi(this.transport, this[kConfigurationError])
      }
      return this[kXpack]
    }
  }
})

module.exports = ESAPI


/***/ }),

/***/ 5230:
/***/ ((module) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const result = { body: null, statusCode: null, headers: null, warnings: null }
const kConfigurationError = Symbol('configuration error')

function handleError (err, callback) {
  if (callback) {
    process.nextTick(callback, err, result)
    return { then: noop, catch: noop, abort: noop }
  }
  return Promise.reject(err)
}

function snakeCaseKeys (acceptedQuerystring, snakeCase, querystring) {
  var target = {}
  var keys = Object.keys(querystring)
  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i]
    target[snakeCase[key] || key] = querystring[key]
  }
  return target
}

function normalizeArguments (params, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  if (typeof params === 'function' || params == null) {
    callback = params
    params = {}
    options = {}
  }
  return [params, options, callback]
}

function noop () {}

module.exports = { handleError, snakeCaseKeys, normalizeArguments, noop, kConfigurationError }


/***/ }),

/***/ 2294:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const nodeMajor = Number(process.versions.node.split('.')[0])

const { EventEmitter } = __webpack_require__(8614)
const { URL } = __webpack_require__(8835)
const debug = __webpack_require__(8237)('elasticsearch')
const Transport = __webpack_require__(7027)
const Connection = __webpack_require__(5613)
const { ConnectionPool, CloudConnectionPool } = __webpack_require__(3911)
// Helpers works only in Node.js >= 10
const Helpers = nodeMajor < 10 ? /* istanbul ignore next */ null : __webpack_require__(4505)
const Serializer = __webpack_require__(2697)
const errors = __webpack_require__(5372)
const { ConfigurationError } = errors
const { prepareHeaders } = Connection.internals

const kInitialOptions = Symbol('elasticsearchjs-initial-options')
const kChild = Symbol('elasticsearchjs-child')
const kExtensions = Symbol('elasticsearchjs-extensions')
const kEventEmitter = Symbol('elasticsearchjs-event-emitter')

const ESAPI = __webpack_require__(8608)

/* istanbul ignore next */
if (nodeMajor < 10) {
  process.emitWarning('You are using a version of Node.js that is currently in EOL. ' +
                      'The support for this version will be dropped in 7.12. ' +
                      'Please refer to https://ela.st/nodejs-support for additional information.',
  'DeprecationWarning'
  )
}

/* istanbul ignore next */
if (nodeMajor >= 10 && nodeMajor < 12) {
  process.emitWarning('You are using a version of Node.js that will reach EOL in April 2021. ' +
                      'The support for this version will be dropped in 7.13. ' +
                      'Please refer to https://ela.st/nodejs-support for additional information.',
  'DeprecationWarning'
  )
}

class Client extends ESAPI {
  constructor (opts = {}) {
    super({ ConfigurationError })
    if (opts.cloud && opts[kChild] === undefined) {
      const { id, username, password } = opts.cloud
      // the cloud id is `cluster-name:base64encodedurl`
      // the url is a string divided by two '$', the first is the cloud url
      // the second the elasticsearch instance, the third the kibana instance
      const cloudUrls = Buffer.from(id.split(':')[1], 'base64').toString().split('$')

      // TODO: remove username and password here in 8
      if (username && password) {
        opts.auth = Object.assign({}, opts.auth, { username, password })
      }
      opts.node = `https://${cloudUrls[1]}.${cloudUrls[0]}`

      // Cloud has better performances with compression enabled
      // see https://github.com/elastic/elasticsearch-py/pull/704.
      // So unless the user specifies otherwise, we enable compression.
      if (opts.compression == null) opts.compression = 'gzip'
      if (opts.suggestCompression == null) opts.suggestCompression = true
      if (opts.ssl == null ||
         (opts.ssl && opts.ssl.secureProtocol == null)) {
        opts.ssl = opts.ssl || {}
        opts.ssl.secureProtocol = 'TLSv1_2_method'
      }
    }

    if (!opts.node && !opts.nodes) {
      throw new ConfigurationError('Missing node(s) option')
    }

    if (opts[kChild] === undefined) {
      const checkAuth = getAuth(opts.node || opts.nodes)
      if (checkAuth && checkAuth.username && checkAuth.password) {
        opts.auth = Object.assign({}, opts.auth, { username: checkAuth.username, password: checkAuth.password })
      }
    }

    const options = opts[kChild] !== undefined
      ? opts[kChild].initialOptions
      : Object.assign({}, {
        Connection,
        Transport,
        Serializer,
        ConnectionPool: opts.cloud ? CloudConnectionPool : ConnectionPool,
        maxRetries: 3,
        requestTimeout: 30000,
        pingTimeout: 3000,
        sniffInterval: false,
        sniffOnStart: false,
        sniffEndpoint: '_nodes/_all/http',
        sniffOnConnectionFault: false,
        resurrectStrategy: 'ping',
        suggestCompression: false,
        compression: false,
        ssl: null,
        agent: null,
        headers: {},
        nodeFilter: null,
        nodeSelector: 'round-robin',
        generateRequestId: null,
        name: 'elasticsearch-js',
        auth: null,
        opaqueIdPrefix: null,
        context: null,
        proxy: null
      }, opts)

    this[kInitialOptions] = options
    this[kExtensions] = []
    this.name = options.name

    if (opts[kChild] !== undefined) {
      this.serializer = options[kChild].serializer
      this.connectionPool = options[kChild].connectionPool
      this[kEventEmitter] = options[kChild].eventEmitter
    } else {
      this[kEventEmitter] = new EventEmitter()
      this.serializer = new options.Serializer()
      this.connectionPool = new options.ConnectionPool({
        pingTimeout: options.pingTimeout,
        resurrectStrategy: options.resurrectStrategy,
        ssl: options.ssl,
        agent: options.agent,
        proxy: options.proxy,
        Connection: options.Connection,
        auth: options.auth,
        emit: this[kEventEmitter].emit.bind(this[kEventEmitter]),
        sniffEnabled: options.sniffInterval !== false ||
                      options.sniffOnStart !== false ||
                      options.sniffOnConnectionFault !== false
      })
      // Add the connections before initialize the Transport
      this.connectionPool.addConnection(options.node || options.nodes)
    }

    this.transport = new options.Transport({
      emit: this[kEventEmitter].emit.bind(this[kEventEmitter]),
      connectionPool: this.connectionPool,
      serializer: this.serializer,
      maxRetries: options.maxRetries,
      requestTimeout: options.requestTimeout,
      sniffInterval: options.sniffInterval,
      sniffOnStart: options.sniffOnStart,
      sniffOnConnectionFault: options.sniffOnConnectionFault,
      sniffEndpoint: options.sniffEndpoint,
      suggestCompression: options.suggestCompression,
      compression: options.compression,
      headers: options.headers,
      nodeFilter: options.nodeFilter,
      nodeSelector: options.nodeSelector,
      generateRequestId: options.generateRequestId,
      name: options.name,
      opaqueIdPrefix: options.opaqueIdPrefix,
      context: options.context
    })

    /* istanbul ignore else */
    if (Helpers !== null) {
      this.helpers = new Helpers({ client: this, maxRetries: options.maxRetries })
    }
  }

  get emit () {
    return this[kEventEmitter].emit.bind(this[kEventEmitter])
  }

  get on () {
    return this[kEventEmitter].on.bind(this[kEventEmitter])
  }

  get once () {
    return this[kEventEmitter].once.bind(this[kEventEmitter])
  }

  get off () {
    return this[kEventEmitter].off.bind(this[kEventEmitter])
  }

  extend (name, opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = {}
    }

    var [namespace, method] = name.split('.')
    if (method == null) {
      method = namespace
      namespace = null
    }

    if (namespace != null) {
      if (this[namespace] != null && this[namespace][method] != null && opts.force !== true) {
        throw new Error(`The method "${method}" already exists on namespace "${namespace}"`)
      }

      if (this[namespace] == null) this[namespace] = {}
      this[namespace][method] = fn({
        makeRequest: this.transport.request.bind(this.transport),
        result: { body: null, statusCode: null, headers: null, warnings: null },
        ConfigurationError
      })
    } else {
      if (this[method] != null && opts.force !== true) {
        throw new Error(`The method "${method}" already exists`)
      }

      this[method] = fn({
        makeRequest: this.transport.request.bind(this.transport),
        result: { body: null, statusCode: null, headers: null, warnings: null },
        ConfigurationError
      })
    }

    this[kExtensions].push({ name, opts, fn })
  }

  child (opts) {
    // Merge the new options with the initial ones
    const options = Object.assign({}, this[kInitialOptions], opts)
    // Pass to the child client the parent instances that cannot be overriden
    options[kChild] = {
      connectionPool: this.connectionPool,
      serializer: this.serializer,
      eventEmitter: this[kEventEmitter],
      initialOptions: options
    }

    /* istanbul ignore else */
    if (options.auth !== undefined) {
      options.headers = prepareHeaders(options.headers, options.auth)
    }

    const client = new Client(options)
    // Add parent extensions
    if (this[kExtensions].length > 0) {
      this[kExtensions].forEach(({ name, opts, fn }) => {
        client.extend(name, opts, fn)
      })
    }
    return client
  }

  close (callback) {
    if (callback == null) {
      return new Promise((resolve, reject) => {
        this.close(resolve)
      })
    }
    debug('Closing the client')
    this.connectionPool.empty(callback)
  }
}

function getAuth (node) {
  if (Array.isArray(node)) {
    for (const url of node) {
      const auth = getUsernameAndPassword(url)
      if (auth.username !== '' && auth.password !== '') {
        return auth
      }
    }

    return null
  }

  const auth = getUsernameAndPassword(node)
  if (auth.username !== '' && auth.password !== '') {
    return auth
  }

  return null

  function getUsernameAndPassword (node) {
    /* istanbul ignore else */
    if (typeof node === 'string') {
      const { username, password } = new URL(node)
      return {
        username: decodeURIComponent(username),
        password: decodeURIComponent(password)
      }
    } else if (node.url instanceof URL) {
      return {
        username: decodeURIComponent(node.url.username),
        password: decodeURIComponent(node.url.password)
      }
    }
  }
}

const events = {
  RESPONSE: 'response',
  REQUEST: 'request',
  SNIFF: 'sniff',
  RESURRECT: 'resurrect'
}

module.exports = {
  Client,
  Transport,
  ConnectionPool,
  Connection,
  Serializer,
  events,
  errors
}


/***/ }),

/***/ 5613:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const assert = __webpack_require__(2357)
const { inspect } = __webpack_require__(1669)
const hpagent = __webpack_require__(4585)
const http = __webpack_require__(8605)
const https = __webpack_require__(7211)
const debug = __webpack_require__(8237)('elasticsearch')
const pump = __webpack_require__(8341)
const INVALID_PATH_REGEX = /[^\u0021-\u00ff]/
const {
  ConnectionError,
  RequestAbortedError,
  TimeoutError,
  ConfigurationError
} = __webpack_require__(5372)

class Connection {
  constructor (opts) {
    this.url = opts.url
    this.ssl = opts.ssl || null
    this.id = opts.id || stripAuth(opts.url.href)
    this.headers = prepareHeaders(opts.headers, opts.auth)
    this.deadCount = 0
    this.resurrectTimeout = 0

    this._openRequests = 0
    this._status = opts.status || Connection.statuses.ALIVE
    this.roles = Object.assign({}, defaultRoles, opts.roles)

    if (!['http:', 'https:'].includes(this.url.protocol)) {
      throw new ConfigurationError(`Invalid protocol: '${this.url.protocol}'`)
    }

    if (typeof opts.agent === 'function') {
      this.agent = opts.agent(opts)
    } else if (opts.agent === false) {
      this.agent = undefined
    } else {
      const agentOptions = Object.assign({}, {
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: 256,
        maxFreeSockets: 256,
        scheduling: 'lifo'
      }, opts.agent)
      if (opts.proxy) {
        agentOptions.proxy = opts.proxy
        this.agent = this.url.protocol === 'http:'
          ? new hpagent.HttpProxyAgent(agentOptions)
          : new hpagent.HttpsProxyAgent(Object.assign({}, agentOptions, this.ssl))
      } else {
        this.agent = this.url.protocol === 'http:'
          ? new http.Agent(agentOptions)
          : new https.Agent(Object.assign({}, agentOptions, this.ssl))
      }
    }

    this.makeRequest = this.url.protocol === 'http:'
      ? http.request
      : https.request
  }

  request (params, callback) {
    this._openRequests++

    const requestParams = this.buildRequestObject(params)
    // https://github.com/nodejs/node/commit/b961d9fd83
    if (INVALID_PATH_REGEX.test(requestParams.path) === true) {
      callback(new TypeError(`ERR_UNESCAPED_CHARACTERS: ${requestParams.path}`), null)
      /* istanbul ignore next */
      return { abort: () => {} }
    }

    debug('Starting a new request', params)
    const request = this.makeRequest(requestParams)

    const onResponse = response => {
      cleanListeners()
      this._openRequests--
      callback(null, response)
    }

    const onTimeout = () => {
      cleanListeners()
      this._openRequests--
      request.once('error', () => {}) // we need to catch the request aborted error
      request.abort()
      callback(new TimeoutError('Request timed out', params), null)
    }

    const onError = err => {
      cleanListeners()
      this._openRequests--
      callback(new ConnectionError(err.message), null)
    }

    const onAbort = () => {
      cleanListeners()
      request.once('error', () => {}) // we need to catch the request aborted error
      debug('Request aborted', params)
      this._openRequests--
      callback(new RequestAbortedError(), null)
    }

    request.on('response', onResponse)
    request.on('timeout', onTimeout)
    request.on('error', onError)
    request.on('abort', onAbort)

    // Disables the Nagle algorithm
    request.setNoDelay(true)

    // starts the request
    if (isStream(params.body) === true) {
      pump(params.body, request, err => {
        /* istanbul ignore if  */
        if (err != null) {
          cleanListeners()
          this._openRequests--
          callback(err, null)
        }
      })
    } else {
      request.end(params.body)
    }

    return request

    function cleanListeners () {
      request.removeListener('response', onResponse)
      request.removeListener('timeout', onTimeout)
      request.removeListener('error', onError)
      request.removeListener('abort', onAbort)
    }
  }

  // TODO: write a better closing logic
  close (callback = () => {}) {
    debug('Closing connection', this.id)
    if (this._openRequests > 0) {
      setTimeout(() => this.close(callback), 1000)
    } else {
      if (this.agent !== undefined) {
        this.agent.destroy()
      }
      callback()
    }
  }

  setRole (role, enabled) {
    if (validRoles.indexOf(role) === -1) {
      throw new ConfigurationError(`Unsupported role: '${role}'`)
    }
    if (typeof enabled !== 'boolean') {
      throw new ConfigurationError('enabled should be a boolean')
    }

    this.roles[role] = enabled
    return this
  }

  get status () {
    return this._status
  }

  set status (status) {
    assert(
      ~validStatuses.indexOf(status),
      `Unsupported status: '${status}'`
    )
    this._status = status
  }

  buildRequestObject (params) {
    const url = this.url
    const request = {
      protocol: url.protocol,
      hostname: url.hostname[0] === '['
        ? url.hostname.slice(1, -1)
        : url.hostname,
      hash: url.hash,
      search: url.search,
      pathname: url.pathname,
      path: '',
      href: url.href,
      origin: url.origin,
      // https://github.com/elastic/elasticsearch-js/issues/843
      port: url.port !== '' ? url.port : undefined,
      headers: this.headers,
      agent: this.agent
    }

    const paramsKeys = Object.keys(params)
    for (var i = 0, len = paramsKeys.length; i < len; i++) {
      var key = paramsKeys[i]
      if (key === 'path') {
        request.pathname = resolve(request.pathname, params[key])
      } else if (key === 'querystring' && !!params[key] === true) {
        if (request.search === '') {
          request.search = '?' + params[key]
        } else {
          request.search += '&' + params[key]
        }
      } else if (key === 'headers') {
        request.headers = Object.assign({}, request.headers, params.headers)
      } else {
        request[key] = params[key]
      }
    }

    request.path = request.pathname + request.search

    return request
  }

  // Handles console.log and utils.inspect invocations.
  // We want to hide `auth`, `agent` and `ssl` since they made
  // the logs very hard to read. The user can still
  // access them with `instance.agent` and `instance.ssl`.
  [inspect.custom] (depth, options) {
    const {
      authorization,
      ...headers
    } = this.headers

    return {
      url: stripAuth(this.url.toString()),
      id: this.id,
      headers,
      deadCount: this.deadCount,
      resurrectTimeout: this.resurrectTimeout,
      _openRequests: this._openRequests,
      status: this.status,
      roles: this.roles
    }
  }

  toJSON () {
    const {
      authorization,
      ...headers
    } = this.headers

    return {
      url: stripAuth(this.url.toString()),
      id: this.id,
      headers,
      deadCount: this.deadCount,
      resurrectTimeout: this.resurrectTimeout,
      _openRequests: this._openRequests,
      status: this.status,
      roles: this.roles
    }
  }
}

Connection.statuses = {
  ALIVE: 'alive',
  DEAD: 'dead'
}

Connection.roles = {
  MASTER: 'master',
  DATA: 'data',
  INGEST: 'ingest',
  ML: 'ml'
}

const defaultRoles = {
  [Connection.roles.MASTER]: true,
  [Connection.roles.DATA]: true,
  [Connection.roles.INGEST]: true,
  [Connection.roles.ML]: false
}

const validStatuses = Object.keys(Connection.statuses)
  .map(k => Connection.statuses[k])
const validRoles = Object.keys(Connection.roles)
  .map(k => Connection.roles[k])

function stripAuth (url) {
  if (url.indexOf('@') === -1) return url
  return url.slice(0, url.indexOf('//') + 2) + url.slice(url.indexOf('@') + 1)
}

function isStream (obj) {
  return obj != null && typeof obj.pipe === 'function'
}

function resolve (host, path) {
  const hostEndWithSlash = host[host.length - 1] === '/'
  const pathStartsWithSlash = path[0] === '/'

  if (hostEndWithSlash === true && pathStartsWithSlash === true) {
    return host + path.slice(1)
  } else if (hostEndWithSlash !== pathStartsWithSlash) {
    return host + path
  } else {
    return host + '/' + path
  }
}

function prepareHeaders (headers = {}, auth) {
  if (auth != null && headers.authorization == null) {
    /* istanbul ignore else */
    if (auth.apiKey) {
      if (typeof auth.apiKey === 'object') {
        headers.authorization = 'ApiKey ' + Buffer.from(`${auth.apiKey.id}:${auth.apiKey.api_key}`).toString('base64')
      } else {
        headers.authorization = `ApiKey ${auth.apiKey}`
      }
    } else if (auth.username && auth.password) {
      headers.authorization = 'Basic ' + Buffer.from(`${auth.username}:${auth.password}`).toString('base64')
    }
  }
  return headers
}

module.exports = Connection
module.exports.internals = { prepareHeaders }


/***/ }),

/***/ 4505:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



/* eslint camelcase: 0 */

const { Readable } = __webpack_require__(2413)
const { promisify } = __webpack_require__(1669)
const { ResponseError, ConfigurationError } = __webpack_require__(5372)

const pImmediate = promisify(setImmediate)
const sleep = promisify(setTimeout)
const kClient = Symbol('elasticsearch-client')
/* istanbul ignore next */
const noop = () => {}

class Helpers {
  constructor (opts) {
    this[kClient] = opts.client
    this.maxRetries = opts.maxRetries
  }

  /**
   * Runs a search operation. The only difference between client.search and this utility,
   * is that we are only returning the hits to the user and not the full ES response.
   * This helper automatically adds `filter_path=hits.hits._source` to the querystring,
   * as it will only need the documents source.
   * @param {object} params - The Elasticsearch's search parameters.
   * @param {object} options - The client optional configuration for this request.
   * @return {array} The documents that matched the request.
   */
  async search (params, options) {
    appendFilterPath('hits.hits._source', params, true)
    const { body } = await this[kClient].search(params, options)
    if (body.hits && body.hits.hits) {
      return body.hits.hits.map(d => d._source)
    }
    return []
  }

  /**
   * Runs a scroll search operation. This function returns an async iterator, allowing
   * the user to use a for await loop to get all the results of a given search.
   * ```js
   * for await (const result of client.helpers.scrollSearch({ params })) {
   *   console.log(result)
   * }
   * ```
   * Each result represents the entire body of a single scroll search request,
   * if you just need to scroll the results, use scrollDocuments.
   * This function handles automatically retries on 429 status code.
   * @param {object} params - The Elasticsearch's search parameters.
   * @param {object} options - The client optional configuration for this request.
   * @return {iterator} the async iterator
   */
  async * scrollSearch (params, options = {}) {
    // TODO: study scroll search slices
    const wait = options.wait || 5000
    const maxRetries = options.maxRetries || this.maxRetries
    if (Array.isArray(options.ignore)) {
      options.ignore.push(429)
    } else {
      options.ignore = [429]
    }
    params.scroll = params.scroll || '1m'
    appendFilterPath('_scroll_id', params, false)
    const { method, body, index, ...querystring } = params

    let response = null
    for (let i = 0; i <= maxRetries; i++) {
      response = await this[kClient].search(params, options)
      if (response.statusCode !== 429) break
      await sleep(wait)
    }
    if (response.statusCode === 429) {
      throw new ResponseError(response)
    }

    let scroll_id = response.body._scroll_id
    let stop = false
    const clear = async () => {
      stop = true
      await this[kClient].clearScroll(
        { body: { scroll_id } },
        { ignore: [400] }
      )
    }

    while (response.body.hits && response.body.hits.hits.length > 0) {
      // scroll id is always present in the response, but it might
      // change over time based on the number of shards
      scroll_id = response.body._scroll_id
      response.clear = clear
      addDocumentsGetter(response)

      yield response

      if (stop === true) {
        break
      }

      for (let i = 0; i <= maxRetries; i++) {
        response = await this[kClient].scroll({
          scroll: querystring.scroll,
          rest_total_hits_as_int: querystring.rest_total_hits_as_int || querystring.restTotalHitsAsInt,
          body: { scroll_id }
        }, options)
        if (response.statusCode !== 429) break
        await sleep(wait)
      }
      if (response.statusCode === 429) {
        throw new ResponseError(response)
      }
    }

    if (stop === false) {
      await clear()
    }
  }

  /**
   * Runs a scroll search operation. This function returns an async iterator, allowing
   * the user to use a for await loop to get all the documents of a given search.
   * ```js
   * for await (const document of client.helpers.scrollSearch({ params })) {
   *   console.log(document)
   * }
   * ```
   * Each document is what you will find by running a scrollSearch and iterating on the hits array.
   * This helper automatically adds `filter_path=hits.hits._source` to the querystring,
   * as it will only need the documents source.
   * @param {object} params - The Elasticsearch's search parameters.
   * @param {object} options - The client optional configuration for this request.
   * @return {iterator} the async iterator
   */
  async * scrollDocuments (params, options) {
    appendFilterPath('hits.hits._source', params, true)
    for await (const { documents } of this.scrollSearch(params)) {
      for (const document of documents) {
        yield document
      }
    }
  }

  /**
   * Creates a msearch helper instance. Once you configure it, you can use the provided
   * `search` method to add new searches in the queue.
   * @param {object} options - The configuration of the msearch operations.
   * @return {object} The possible operations to run.
   */
  msearch (options = {}) {
    const client = this[kClient]
    const {
      operations = 5,
      concurrency = 5,
      flushInterval = 500,
      retries = this.maxRetries,
      wait = 5000,
      ...msearchOptions
    } = options

    let stopReading = false
    let stopError = null
    let timeoutRef = null
    const operationsStream = new Readable({
      objectMode: true,
      read (size) {}
    })

    const p = iterate()
    const helper = {
      then (onFulfilled, onRejected) {
        return p.then(onFulfilled, onRejected)
      },
      catch (onRejected) {
        return p.catch(onRejected)
      },
      stop (error = null) {
        if (stopReading === true) return
        stopReading = true
        stopError = error
        operationsStream.push(null)
      },
      // TODO: support abort a single search?
      // NOTE: the validation checks are synchronous and the callback/promise will
      //       be resolved in the same tick. We might want to fix this in the future.
      search (header, body, callback) {
        if (stopReading === true) {
          const error = stopError === null
            ? new ConfigurationError('The msearch processor has been stopped')
            : stopError
          return callback ? callback(error, {}) : Promise.reject(error)
        }

        if (!(typeof header === 'object' && header !== null && !Array.isArray(header))) {
          const error = new ConfigurationError('The header should be an object')
          return callback ? callback(error, {}) : Promise.reject(error)
        }

        if (!(typeof body === 'object' && body !== null && !Array.isArray(body))) {
          const error = new ConfigurationError('The body should be an object')
          return callback ? callback(error, {}) : Promise.reject(error)
        }

        let promise = null
        if (callback === undefined) {
          let onFulfilled = null
          let onRejected = null
          promise = new Promise((resolve, reject) => {
            onFulfilled = resolve
            onRejected = reject
          })
          callback = function callback (err, result) {
            err ? onRejected(err) : onFulfilled(result)
          }
        }

        operationsStream.push([header, body, callback])

        if (promise !== null) {
          return promise
        }
      }
    }

    return helper

    async function iterate () {
      const { semaphore, finish } = buildSemaphore()
      const msearchBody = []
      const callbacks = []
      let loadedOperations = 0
      timeoutRef = setTimeout(onFlushTimeout, flushInterval)

      for await (const operation of operationsStream) {
        timeoutRef.refresh()
        loadedOperations += 1
        msearchBody.push(operation[0], operation[1])
        callbacks.push(operation[2])
        if (loadedOperations >= operations) {
          const send = await semaphore()
          send(msearchBody.slice(), callbacks.slice())
          msearchBody.length = 0
          callbacks.length = 0
          loadedOperations = 0
        }
      }

      clearTimeout(timeoutRef)
      // In some cases the previos http call does not have finished,
      // or we didn't reach the flush bytes threshold, so we force one last operation.
      if (loadedOperations > 0) {
        const send = await semaphore()
        send(msearchBody, callbacks)
      }

      await finish()

      if (stopError !== null) {
        throw stopError
      }

      async function onFlushTimeout () {
        if (loadedOperations === 0) return
        const msearchBodyCopy = msearchBody.slice()
        const callbacksCopy = callbacks.slice()
        msearchBody.length = 0
        callbacks.length = 0
        loadedOperations = 0
        try {
          const send = await semaphore()
          send(msearchBodyCopy, callbacksCopy)
        } catch (err) {
          /* istanbul ignore next */
          helper.stop(err)
        }
      }
    }

    // This function builds a semaphore using the concurrency
    // options of the msearch helper. It is used inside the iterator
    // to guarantee that no more than the number of operations
    // allowed to run at the same time are executed.
    // It returns a semaphore function which resolves in the next tick
    // if we didn't reach the maximim concurrency yet, otherwise it returns
    // a promise that resolves as soon as one of the running request has finshed.
    // The semaphore function resolves a send function, which will be used
    // to send the actual msearch request.
    // It also returns a finish function, which returns a promise that is resolved
    // when there are no longer request running.
    function buildSemaphore () {
      let resolveSemaphore = null
      let resolveFinish = null
      let running = 0

      return { semaphore, finish }

      function finish () {
        return new Promise((resolve, reject) => {
          if (running === 0) {
            resolve()
          } else {
            resolveFinish = resolve
          }
        })
      }

      function semaphore () {
        if (running < concurrency) {
          running += 1
          return pImmediate(send)
        } else {
          return new Promise((resolve, reject) => {
            resolveSemaphore = resolve
          })
        }
      }

      function send (msearchBody, callbacks) {
        /* istanbul ignore if */
        if (running > concurrency) {
          throw new Error('Max concurrency reached')
        }
        msearchOperation(msearchBody, callbacks, () => {
          running -= 1
          if (resolveSemaphore) {
            running += 1
            resolveSemaphore(send)
            resolveSemaphore = null
          } else if (resolveFinish && running === 0) {
            resolveFinish()
          }
        })
      }
    }

    function msearchOperation (msearchBody, callbacks, done) {
      let retryCount = retries

      // Instead of going full on async-await, which would make the code easier to read,
      // we have decided to use callback style instead.
      // This because every time we use async await, V8 will create multiple promises
      // behind the scenes, making the code slightly slower.
      tryMsearch(msearchBody, callbacks, retrySearch)
      function retrySearch (msearchBody, callbacks) {
        if (msearchBody.length > 0 && retryCount > 0) {
          retryCount -= 1
          setTimeout(tryMsearch, wait, msearchBody, callbacks, retrySearch)
          return
        }

        done()
      }

      // This function never returns an error, if the msearch operation fails,
      // the error is dispatched to all search executors.
      function tryMsearch (msearchBody, callbacks, done) {
        client.msearch(Object.assign({}, msearchOptions, { body: msearchBody }), (err, results) => {
          const retryBody = []
          const retryCallbacks = []
          if (err) {
            addDocumentsGetter(results)
            for (const callback of callbacks) {
              callback(err, results)
            }
            return done(retryBody, retryCallbacks)
          }
          const { responses } = results.body
          for (let i = 0, len = responses.length; i < len; i++) {
            const response = responses[i]
            if (response.status === 429 && retryCount > 0) {
              retryBody.push(msearchBody[i * 2])
              retryBody.push(msearchBody[(i * 2) + 1])
              retryCallbacks.push(callbacks[i])
              continue
            }
            const result = { ...results, body: response }
            addDocumentsGetter(result)
            if (response.status >= 400) {
              callbacks[i](new ResponseError(result), result)
            } else {
              callbacks[i](null, result)
            }
          }
          done(retryBody, retryCallbacks)
        })
      }
    }
  }

  /**
   * Creates a bulk helper instance. Once you configure it, you can pick which operation
   * to execute with the given dataset, index, create, update, and delete.
   * @param {object} options - The configuration of the bulk operation.
   * @return {object} The possible operations to run with the datasource.
   */
  bulk (options) {
    const client = this[kClient]
    const { serialize, deserialize } = client.serializer
    const {
      datasource,
      onDocument,
      flushBytes = 5000000,
      flushInterval = 30000,
      concurrency = 5,
      retries = this.maxRetries,
      wait = 5000,
      onDrop = noop,
      refreshOnCompletion = false,
      ...bulkOptions
    } = options

    if (datasource === undefined) {
      return Promise.reject(new ConfigurationError('bulk helper: the datasource is required'))
    }
    if (!(Array.isArray(datasource) || Buffer.isBuffer(datasource) || typeof datasource.pipe === 'function' || datasource[Symbol.asyncIterator])) {
      return Promise.reject(new ConfigurationError('bulk helper: the datasource must be an array or a buffer or a readable stream or an async generator'))
    }
    if (onDocument === undefined) {
      return Promise.reject(new ConfigurationError('bulk helper: the onDocument callback is required'))
    }

    let shouldAbort = false
    let timeoutRef = null
    const stats = {
      total: 0,
      failed: 0,
      retry: 0,
      successful: 0,
      time: 0,
      bytes: 0,
      aborted: false
    }

    const p = iterate()
    const helper = {
      then (onFulfilled, onRejected) {
        return p.then(onFulfilled, onRejected)
      },
      catch (onRejected) {
        return p.catch(onRejected)
      },
      abort () {
        clearTimeout(timeoutRef)
        shouldAbort = true
        stats.aborted = true
        return this
      }
    }

    return helper

    /**
     * Function that iterates over the given datasource and start a bulk operation as soon
     * as it reaches the configured bulk size. It's designed to use the Node.js asynchronous
     * model at this maximum capacity, as it will collect the next body to send while there is
     * a running http call. In this way, the CPU time will be used carefully.
     * The objects will be serialized right away, to approximate the byte length of the body.
     * It creates an array of strings instead of a ndjson string because the bulkOperation
     * will navigate the body for matching failed operations with the original document.
     */
    async function iterate () {
      const { semaphore, finish } = buildSemaphore()
      const startTime = Date.now()
      const bulkBody = []
      let actionBody = ''
      let payloadBody = ''
      let chunkBytes = 0
      timeoutRef = setTimeout(onFlushTimeout, flushInterval)

      for await (const chunk of datasource) {
        if (shouldAbort === true) break
        timeoutRef.refresh()
        const action = onDocument(chunk)
        const operation = Array.isArray(action)
          ? Object.keys(action[0])[0]
          : Object.keys(action)[0]
        if (operation === 'index' || operation === 'create') {
          actionBody = serialize(action)
          payloadBody = typeof chunk === 'string' ? chunk : serialize(chunk)
          chunkBytes += Buffer.byteLength(actionBody) + Buffer.byteLength(payloadBody)
          bulkBody.push(actionBody, payloadBody)
        } else if (operation === 'update') {
          actionBody = serialize(action[0])
          payloadBody = typeof chunk === 'string'
            ? `{"doc":${chunk}}`
            : serialize({ doc: chunk, ...action[1] })
          chunkBytes += Buffer.byteLength(actionBody) + Buffer.byteLength(payloadBody)
          bulkBody.push(actionBody, payloadBody)
        } else if (operation === 'delete') {
          actionBody = serialize(action)
          chunkBytes += Buffer.byteLength(actionBody)
          bulkBody.push(actionBody)
        } else {
          clearTimeout(timeoutRef)
          throw new ConfigurationError(`Bulk helper invalid action: '${operation}'`)
        }

        if (chunkBytes >= flushBytes) {
          stats.bytes += chunkBytes
          const send = await semaphore()
          send(bulkBody.slice())
          bulkBody.length = 0
          chunkBytes = 0
        }
      }

      clearTimeout(timeoutRef)
      // In some cases the previos http call does not have finished,
      // or we didn't reach the flush bytes threshold, so we force one last operation.
      if (shouldAbort === false && chunkBytes > 0) {
        const send = await semaphore()
        stats.bytes += chunkBytes
        send(bulkBody)
      }

      await finish()

      if (refreshOnCompletion) {
        await client.indices.refresh({
          index: typeof refreshOnCompletion === 'string'
            ? refreshOnCompletion
            : '_all'
        })
      }

      stats.time = Date.now() - startTime
      stats.total = stats.successful + stats.failed

      return stats

      async function onFlushTimeout () {
        if (chunkBytes === 0) return
        stats.bytes += chunkBytes
        const bulkBodyCopy = bulkBody.slice()
        bulkBody.length = 0
        chunkBytes = 0
        try {
          const send = await semaphore()
          send(bulkBodyCopy)
        } catch (err) {
          /* istanbul ignore next */
          helper.abort()
        }
      }
    }

    // This function builds a semaphore using the concurrency
    // options of the bulk helper. It is used inside the iterator
    // to guarantee that no more than the number of operations
    // allowed to run at the same time are executed.
    // It returns a semaphore function which resolves in the next tick
    // if we didn't reach the maximim concurrency yet, otherwise it returns
    // a promise that resolves as soon as one of the running request has finshed.
    // The semaphore function resolves a send function, which will be used
    // to send the actual bulk request.
    // It also returns a finish function, which returns a promise that is resolved
    // when there are no longer request running. It rejects an error if one
    // of the request has failed for some reason.
    function buildSemaphore () {
      let resolveSemaphore = null
      let resolveFinish = null
      let rejectFinish = null
      let error = null
      let running = 0

      return { semaphore, finish }

      function finish () {
        return new Promise((resolve, reject) => {
          if (running === 0) {
            if (error) {
              reject(error)
            } else {
              resolve()
            }
          } else {
            resolveFinish = resolve
            rejectFinish = reject
          }
        })
      }

      function semaphore () {
        if (running < concurrency) {
          running += 1
          return pImmediate(send)
        } else {
          return new Promise((resolve, reject) => {
            resolveSemaphore = resolve
          })
        }
      }

      function send (bulkBody) {
        /* istanbul ignore if */
        if (running > concurrency) {
          throw new Error('Max concurrency reached')
        }
        bulkOperation(bulkBody, err => {
          running -= 1
          if (err) {
            shouldAbort = true
            error = err
          }
          if (resolveSemaphore) {
            running += 1
            resolveSemaphore(send)
            resolveSemaphore = null
          } else if (resolveFinish && running === 0) {
            if (error) {
              rejectFinish(error)
            } else {
              resolveFinish()
            }
          }
        })
      }
    }

    function bulkOperation (bulkBody, callback) {
      let retryCount = retries
      let isRetrying = false

      // Instead of going full on async-await, which would make the code easier to read,
      // we have decided to use callback style instead.
      // This because every time we use async await, V8 will create multiple promises
      // behind the scenes, making the code slightly slower.
      tryBulk(bulkBody, retryDocuments)
      function retryDocuments (err, bulkBody) {
        if (err) return callback(err)
        if (shouldAbort === true) return callback()

        if (bulkBody.length > 0) {
          if (retryCount > 0) {
            isRetrying = true
            retryCount -= 1
            stats.retry += bulkBody.length
            setTimeout(tryBulk, wait, bulkBody, retryDocuments)
            return
          }
          for (let i = 0, len = bulkBody.length; i < len; i = i + 2) {
            const operation = Object.keys(deserialize(bulkBody[i]))[0]
            onDrop({
              status: 429,
              error: null,
              operation: deserialize(bulkBody[i]),
              document: operation !== 'delete'
                ? deserialize(bulkBody[i + 1])
                /* istanbul ignore next */
                : null,
              retried: isRetrying
            })
            stats.failed += 1
          }
        }
        callback()
      }

      function tryBulk (bulkBody, callback) {
        if (shouldAbort === true) return callback(null, [])
        client.bulk(Object.assign({}, bulkOptions, { body: bulkBody }), (err, { body }) => {
          if (err) return callback(err, null)
          if (body.errors === false) {
            stats.successful += body.items.length
            return callback(null, [])
          }
          const retry = []
          const { items } = body
          for (let i = 0, len = items.length; i < len; i++) {
            const action = items[i]
            const operation = Object.keys(action)[0]
            const { status } = action[operation]
            const indexSlice = operation !== 'delete' ? i * 2 : i

            if (status >= 400) {
              // 429 is the only staus code where we might want to retry
              // a document, because it was not an error in the document itself,
              // but the ES node were handling too many operations.
              if (status === 429) {
                retry.push(bulkBody[indexSlice])
                /* istanbul ignore next */
                if (operation !== 'delete') {
                  retry.push(bulkBody[indexSlice + 1])
                }
              } else {
                onDrop({
                  status: status,
                  error: action[operation].error,
                  operation: deserialize(bulkBody[indexSlice]),
                  document: operation !== 'delete'
                    ? deserialize(bulkBody[indexSlice + 1])
                    : null,
                  retried: isRetrying
                })
                stats.failed += 1
              }
            } else {
              stats.successful += 1
            }
          }
          callback(null, retry)
        })
      }
    }
  }
}

// Using a getter will improve the overall performances of the code,
// as we will reed the documents only if needed.
function addDocumentsGetter (result) {
  Object.defineProperty(result, 'documents', {
    get () {
      if (this.body.hits && this.body.hits.hits) {
        return this.body.hits.hits.map(d => d._source)
      }
      return []
    }
  })
}

function appendFilterPath (filter, params, force) {
  if (params.filter_path !== undefined) {
    params.filter_path += ',' + filter
  } else if (params.filterPath !== undefined) {
    params.filterPath += ',' + filter
  } else if (force === true) {
    params.filter_path = filter
  }
}

module.exports = Helpers


/***/ }),

/***/ 2697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const { stringify } = __webpack_require__(1191)
const debug = __webpack_require__(8237)('elasticsearch')
const sjson = __webpack_require__(707)
const { SerializationError, DeserializationError } = __webpack_require__(5372)

class Serializer {
  serialize (object) {
    debug('Serializing', object)
    try {
      var json = JSON.stringify(object)
    } catch (err) {
      throw new SerializationError(err.message, object)
    }
    return json
  }

  deserialize (json) {
    debug('Deserializing', json)
    try {
      var object = sjson.parse(json)
    } catch (err) {
      throw new DeserializationError(err.message, json)
    }
    return object
  }

  ndserialize (array) {
    debug('ndserialize', array)
    if (Array.isArray(array) === false) {
      throw new SerializationError('The argument provided is not an array')
    }
    var ndjson = ''
    for (var i = 0, len = array.length; i < len; i++) {
      if (typeof array[i] === 'string') {
        ndjson += array[i] + '\n'
      } else {
        ndjson += this.serialize(array[i]) + '\n'
      }
    }
    return ndjson
  }

  qserialize (object) {
    debug('qserialize', object)
    if (object == null) return ''
    if (typeof object === 'string') return object
    // arrays should be serialized as comma separated list
    const keys = Object.keys(object)
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i]
      // elasticsearch will complain for keys without a value
      if (object[key] === undefined) {
        delete object[key]
      } else if (Array.isArray(object[key]) === true) {
        object[key] = object[key].join(',')
      }
    }
    return stringify(object)
  }
}

module.exports = Serializer


/***/ }),

/***/ 7027:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const debug = __webpack_require__(8237)('elasticsearch')
const os = __webpack_require__(2087)
const { gzip, unzip, createGzip } = __webpack_require__(8761)
const ms = __webpack_require__(900)
const {
  ConnectionError,
  RequestAbortedError,
  NoLivingConnectionsError,
  ResponseError,
  ConfigurationError
} = __webpack_require__(5372)

const noop = () => {}

const clientVersion = __webpack_require__(7529)/* .version */ .i8
const userAgent = `elasticsearch-js/${clientVersion} (${os.platform()} ${os.release()}-${os.arch()}; Node.js ${process.version})`

class Transport {
  constructor (opts) {
    if (typeof opts.compression === 'string' && opts.compression !== 'gzip') {
      throw new ConfigurationError(`Invalid compression: '${opts.compression}'`)
    }
    this.emit = opts.emit
    this.connectionPool = opts.connectionPool
    this.serializer = opts.serializer
    this.maxRetries = opts.maxRetries
    this.requestTimeout = toMs(opts.requestTimeout)
    this.suggestCompression = opts.suggestCompression === true
    this.compression = opts.compression || false
    this.context = opts.context || null
    this.headers = Object.assign({},
      { 'user-agent': userAgent },
      opts.suggestCompression === true ? { 'accept-encoding': 'gzip,deflate' } : null,
      lowerCaseHeaders(opts.headers)
    )
    this.sniffInterval = opts.sniffInterval
    this.sniffOnConnectionFault = opts.sniffOnConnectionFault
    this.sniffEndpoint = opts.sniffEndpoint
    this.generateRequestId = opts.generateRequestId || generateRequestId()
    this.name = opts.name
    this.opaqueIdPrefix = opts.opaqueIdPrefix

    this.nodeFilter = opts.nodeFilter || defaultNodeFilter
    if (typeof opts.nodeSelector === 'function') {
      this.nodeSelector = opts.nodeSelector
    } else if (opts.nodeSelector === 'round-robin') {
      this.nodeSelector = roundRobinSelector()
    } else if (opts.nodeSelector === 'random') {
      this.nodeSelector = randomSelector
    } else {
      this.nodeSelector = roundRobinSelector()
    }

    this._sniffEnabled = typeof this.sniffInterval === 'number'
    this._nextSniff = this._sniffEnabled ? (Date.now() + this.sniffInterval) : 0
    this._isSniffing = false

    if (opts.sniffOnStart === true) {
      this.sniff({ reason: Transport.sniffReasons.SNIFF_ON_START })
    }
  }

  request (params, options, callback) {
    options = options || {}
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    var p = null

    // promises support
    if (callback === undefined) {
      let onFulfilled = null
      let onRejected = null
      p = new Promise((resolve, reject) => {
        onFulfilled = resolve
        onRejected = reject
      })
      callback = function callback (err, result) {
        err ? onRejected(err) : onFulfilled(result)
      }
    }

    const meta = {
      context: null,
      request: {
        params: null,
        options: null,
        id: options.id || this.generateRequestId(params, options)
      },
      name: this.name,
      connection: null,
      attempts: 0,
      aborted: false
    }

    if (this.context != null && options.context != null) {
      meta.context = Object.assign({}, this.context, options.context)
    } else if (this.context != null) {
      meta.context = this.context
    } else if (options.context != null) {
      meta.context = options.context
    }

    const result = {
      body: null,
      statusCode: null,
      headers: null,
      meta
    }

    Object.defineProperty(result, 'warnings', {
      get () {
        return this.headers && this.headers.warning
          ? this.headers.warning.split(/(?!\B"[^"]*),(?![^"]*"\B)/)
          : null
      }
    })

    // We should not retry if we are sending a stream body, because we should store in memory
    // a copy of the stream to be able to send it again, but since we don't know in advance
    // the size of the stream, we risk to take too much memory.
    // Furthermore, copying everytime the stream is very a expensive operation.
    const maxRetries = isStream(params.body) || isStream(params.bulkBody)
      ? 0 : (typeof options.maxRetries === 'number' ? options.maxRetries : this.maxRetries)
    const compression = options.compression !== undefined ? options.compression : this.compression
    var request = { abort: noop }
    const transportReturn = {
      then (onFulfilled, onRejected) {
        return p.then(onFulfilled, onRejected)
      },
      catch (onRejected) {
        return p.catch(onRejected)
      },
      abort () {
        meta.aborted = true
        request.abort()
        debug('Aborting request', params)
        return this
      }
    }

    const makeRequest = () => {
      if (meta.aborted === true) {
        return process.nextTick(callback, new RequestAbortedError(), result)
      }
      meta.connection = this.getConnection({ requestId: meta.request.id })
      if (meta.connection == null) {
        return process.nextTick(callback, new NoLivingConnectionsError(), result)
      }
      this.emit('request', null, result)
      // perform the actual http request
      request = meta.connection.request(params, onResponse)
    }

    const onConnectionError = (err) => {
      if (err.name !== 'RequestAbortedError') {
        // if there is an error in the connection
        // let's mark the connection as dead
        this.connectionPool.markDead(meta.connection)

        if (this.sniffOnConnectionFault === true) {
          this.sniff({
            reason: Transport.sniffReasons.SNIFF_ON_CONNECTION_FAULT,
            requestId: meta.request.id
          })
        }

        // retry logic
        if (meta.attempts < maxRetries) {
          meta.attempts++
          debug(`Retrying request, there are still ${maxRetries - meta.attempts} attempts`, params)
          makeRequest()
          return
        }
      }

      err.meta = result
      this.emit('response', err, result)
      return callback(err, result)
    }

    const onResponse = (err, response) => {
      if (err !== null) {
        return onConnectionError(err)
      }

      result.statusCode = response.statusCode
      result.headers = response.headers

      if (options.asStream === true) {
        result.body = response
        this.emit('response', null, result)
        callback(null, result)
        return
      }

      const contentEncoding = (result.headers['content-encoding'] || '').toLowerCase()
      const isCompressed = contentEncoding.indexOf('gzip') > -1 || contentEncoding.indexOf('deflate') > -1
      // if the response is compressed, we must handle it
      // as buffer for allowing decompression later
      let payload = isCompressed ? [] : ''
      const onData = isCompressed
        ? chunk => { payload.push(chunk) }
        : chunk => { payload += chunk }
      const onEnd = err => {
        response.removeListener('data', onData)
        response.removeListener('end', onEnd)
        response.removeListener('error', onEnd)
        response.removeListener('aborted', onAbort)

        if (err) {
          return onConnectionError(new ConnectionError(err.message))
        }

        if (isCompressed) {
          unzip(Buffer.concat(payload), onBody)
        } else {
          onBody(null, payload)
        }
      }

      const onAbort = () => {
        response.destroy()
        onEnd(new Error('Response aborted while reading the body'))
      }

      if (!isCompressed) {
        response.setEncoding('utf8')
      }
      response.on('data', onData)
      response.on('error', onEnd)
      response.on('end', onEnd)
      response.on('aborted', onAbort)
    }

    const onBody = (err, payload) => {
      if (err) {
        this.emit('response', err, result)
        return callback(err, result)
      }
      if (Buffer.isBuffer(payload)) {
        payload = payload.toString()
      }
      const isHead = params.method === 'HEAD'
      // we should attempt the payload deserialization only if:
      //    - a `content-type` is defined and is equal to `application/json`
      //    - the request is not a HEAD request
      //    - the payload is not an empty string
      if (result.headers['content-type'] !== undefined &&
          result.headers['content-type'].indexOf('application/json') > -1 &&
          isHead === false &&
          payload !== ''
      ) {
        try {
          result.body = this.serializer.deserialize(payload)
        } catch (err) {
          this.emit('response', err, result)
          return callback(err, result)
        }
      } else {
        // cast to boolean if the request method was HEAD
        result.body = isHead === true ? true : payload
      }

      // we should ignore the statusCode if the user has configured the `ignore` field with
      // the statusCode we just got or if the request method is HEAD and the statusCode is 404
      const ignoreStatusCode = (Array.isArray(options.ignore) && options.ignore.indexOf(result.statusCode) > -1) ||
        (isHead === true && result.statusCode === 404)

      if (ignoreStatusCode === false &&
         (result.statusCode === 502 || result.statusCode === 503 || result.statusCode === 504)) {
        // if the statusCode is 502/3/4 we should run our retry strategy
        // and mark the connection as dead
        this.connectionPool.markDead(meta.connection)
        // retry logic (we shoukd not retry on "429 - Too Many Requests")
        if (meta.attempts < maxRetries && result.statusCode !== 429) {
          meta.attempts++
          debug(`Retrying request, there are still ${maxRetries - meta.attempts} attempts`, params)
          makeRequest()
          return
        }
      } else {
        // everything has worked as expected, let's mark
        // the connection as alive (or confirm it)
        this.connectionPool.markAlive(meta.connection)
      }

      if (ignoreStatusCode === false && result.statusCode >= 400) {
        const error = new ResponseError(result)
        this.emit('response', error, result)
        callback(error, result)
      } else {
        // cast to boolean if the request method was HEAD
        if (isHead === true && result.statusCode === 404) {
          result.body = false
        }
        this.emit('response', null, result)
        callback(null, result)
      }
    }

    const headers = Object.assign({}, this.headers, lowerCaseHeaders(options.headers))

    if (options.opaqueId !== undefined) {
      headers['x-opaque-id'] = this.opaqueIdPrefix !== null
        ? this.opaqueIdPrefix + options.opaqueId
        : options.opaqueId
    }

    // handle json body
    if (params.body != null) {
      if (shouldSerialize(params.body) === true) {
        try {
          params.body = this.serializer.serialize(params.body)
        } catch (err) {
          process.nextTick(callback, err, result)
          return transportReturn
        }
      }

      if (params.body !== '') {
        headers['content-type'] = headers['content-type'] || 'application/json'
      }

    // handle ndjson body
    } else if (params.bulkBody != null) {
      if (shouldSerialize(params.bulkBody) === true) {
        try {
          params.body = this.serializer.ndserialize(params.bulkBody)
        } catch (err) {
          process.nextTick(callback, err, result)
          return transportReturn
        }
      } else {
        params.body = params.bulkBody
      }
      if (params.body !== '') {
        headers['content-type'] = headers['content-type'] || 'application/x-ndjson'
      }
    }

    params.headers = headers
    // serializes the querystring
    if (options.querystring == null) {
      params.querystring = this.serializer.qserialize(params.querystring)
    } else {
      params.querystring = this.serializer.qserialize(
        Object.assign({}, params.querystring, options.querystring)
      )
    }

    // handles request timeout
    params.timeout = toMs(options.requestTimeout || this.requestTimeout)
    if (options.asStream === true) params.asStream = true
    meta.request.params = params
    meta.request.options = options

    // handle compression
    if (params.body !== '' && params.body != null) {
      if (isStream(params.body) === true) {
        if (compression === 'gzip') {
          params.headers['content-encoding'] = compression
          params.body = params.body.pipe(createGzip())
        }
        makeRequest()
      } else if (compression === 'gzip') {
        gzip(params.body, (err, buffer) => {
          /* istanbul ignore next */
          if (err) {
            return callback(err, result)
          }
          params.headers['content-encoding'] = compression
          params.headers['content-length'] = '' + Buffer.byteLength(buffer)
          params.body = buffer
          makeRequest()
        })
      } else {
        params.headers['content-length'] = '' + Buffer.byteLength(params.body)
        makeRequest()
      }
    } else {
      makeRequest()
    }

    return transportReturn
  }

  getConnection (opts) {
    const now = Date.now()
    if (this._sniffEnabled === true && now > this._nextSniff) {
      this.sniff({ reason: Transport.sniffReasons.SNIFF_INTERVAL, requestId: opts.requestId })
    }
    return this.connectionPool.getConnection({
      filter: this.nodeFilter,
      selector: this.nodeSelector,
      requestId: opts.requestId,
      name: this.name,
      now
    })
  }

  sniff (opts, callback = noop) {
    if (this._isSniffing === true) return
    this._isSniffing = true
    debug('Started sniffing request')

    if (typeof opts === 'function') {
      callback = opts
      opts = { reason: Transport.sniffReasons.DEFAULT }
    }

    const { reason } = opts

    const request = {
      method: 'GET',
      path: this.sniffEndpoint
    }

    this.request(request, { id: opts.requestId }, (err, result) => {
      this._isSniffing = false
      if (this._sniffEnabled === true) {
        this._nextSniff = Date.now() + this.sniffInterval
      }

      if (err != null) {
        debug('Sniffing errored', err)
        result.meta.sniff = { hosts: [], reason }
        this.emit('sniff', err, result)
        return callback(err)
      }

      debug('Sniffing ended successfully', result.body)
      const protocol = result.meta.connection.url.protocol || /* istanbul ignore next */ 'http:'
      const hosts = this.connectionPool.nodesToHost(result.body.nodes, protocol)
      this.connectionPool.update(hosts)

      result.meta.sniff = { hosts, reason }
      this.emit('sniff', null, result)
      callback(null, hosts)
    })
  }
}

Transport.sniffReasons = {
  SNIFF_ON_START: 'sniff-on-start',
  SNIFF_INTERVAL: 'sniff-interval',
  SNIFF_ON_CONNECTION_FAULT: 'sniff-on-connection-fault',
  // TODO: find a better name
  DEFAULT: 'default'
}

function toMs (time) {
  if (typeof time === 'string') {
    return ms(time)
  }
  return time
}

function shouldSerialize (obj) {
  return typeof obj !== 'string' &&
         typeof obj.pipe !== 'function' &&
         Buffer.isBuffer(obj) === false
}

function isStream (obj) {
  return obj != null && typeof obj.pipe === 'function'
}

function defaultNodeFilter (node) {
  // avoid master only nodes
  if (node.roles.master === true &&
      node.roles.data === false &&
      node.roles.ingest === false) {
    return false
  }
  return true
}

function roundRobinSelector () {
  var current = -1
  return function _roundRobinSelector (connections) {
    if (++current >= connections.length) {
      current = 0
    }
    return connections[current]
  }
}

function randomSelector (connections) {
  const index = Math.floor(Math.random() * connections.length)
  return connections[index]
}

function generateRequestId () {
  var maxInt = 2147483647
  var nextReqId = 0
  return function genReqId (params, options) {
    return (nextReqId = (nextReqId + 1) & maxInt)
  }
}

function lowerCaseHeaders (oldHeaders) {
  if (oldHeaders == null) return oldHeaders
  const newHeaders = {}
  for (const header in oldHeaders) {
    newHeaders[header.toLowerCase()] = oldHeaders[header]
  }
  return newHeaders
}

module.exports = Transport
module.exports.internals = {
  defaultNodeFilter,
  roundRobinSelector,
  randomSelector,
  generateRequestId,
  lowerCaseHeaders
}


/***/ }),

/***/ 5372:
/***/ ((module) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



class ElasticsearchClientError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ElasticsearchClientError'
  }
}

class TimeoutError extends ElasticsearchClientError {
  constructor (message, meta) {
    super(message)
    Error.captureStackTrace(this, TimeoutError)
    this.name = 'TimeoutError'
    this.message = message || 'Timeout Error'
    this.meta = meta
  }
}

class ConnectionError extends ElasticsearchClientError {
  constructor (message, meta) {
    super(message)
    Error.captureStackTrace(this, ConnectionError)
    this.name = 'ConnectionError'
    this.message = message || 'Connection Error'
    this.meta = meta
  }
}

class NoLivingConnectionsError extends ElasticsearchClientError {
  constructor (message, meta) {
    super(message)
    Error.captureStackTrace(this, NoLivingConnectionsError)
    this.name = 'NoLivingConnectionsError'
    this.message = message || 'Given the configuration, the ConnectionPool was not able to find a usable Connection for this request.'
    this.meta = meta
  }
}

class SerializationError extends ElasticsearchClientError {
  constructor (message, data) {
    super(message, data)
    Error.captureStackTrace(this, SerializationError)
    this.name = 'SerializationError'
    this.message = message || 'Serialization Error'
    this.data = data
  }
}

class DeserializationError extends ElasticsearchClientError {
  constructor (message, data) {
    super(message, data)
    Error.captureStackTrace(this, DeserializationError)
    this.name = 'DeserializationError'
    this.message = message || 'Deserialization Error'
    this.data = data
  }
}

class ConfigurationError extends ElasticsearchClientError {
  constructor (message) {
    super(message)
    Error.captureStackTrace(this, ConfigurationError)
    this.name = 'ConfigurationError'
    this.message = message || 'Configuration Error'
  }
}

class ResponseError extends ElasticsearchClientError {
  constructor (meta) {
    super('Response Error')
    Error.captureStackTrace(this, ResponseError)
    this.name = 'ResponseError'
    this.message = (meta.body && meta.body.error && meta.body.error.type) || 'Response Error'
    this.meta = meta
  }

  get body () {
    return this.meta.body
  }

  get statusCode () {
    if (this.meta.body && typeof this.meta.body.status === 'number') {
      return this.meta.body.status
    }
    return this.meta.statusCode
  }

  get headers () {
    return this.meta.headers
  }
}

class RequestAbortedError extends ElasticsearchClientError {
  constructor (message, meta) {
    super(message)
    Error.captureStackTrace(this, RequestAbortedError)
    this.name = 'RequestAbortedError'
    this.message = message || 'Request aborted'
    this.meta = meta
  }
}

module.exports = {
  ElasticsearchClientError,
  TimeoutError,
  ConnectionError,
  NoLivingConnectionsError,
  SerializationError,
  DeserializationError,
  ConfigurationError,
  ResponseError,
  RequestAbortedError
}


/***/ }),

/***/ 9233:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const { URL } = __webpack_require__(8835)
const debug = __webpack_require__(8237)('elasticsearch')
const Connection = __webpack_require__(5613)
const noop = () => {}

class BaseConnectionPool {
  constructor (opts) {
    // list of nodes and weights
    this.connections = []
    // how many nodes we have in our scheduler
    this.size = this.connections.length
    this.Connection = opts.Connection
    this.emit = opts.emit || noop
    this.auth = opts.auth || null
    this._ssl = opts.ssl
    this._agent = opts.agent
    this._proxy = opts.proxy || null
  }

  getConnection () {
    throw new Error('getConnection must be implemented')
  }

  markAlive () {
    return this
  }

  markDead () {
    return this
  }

  /**
   * Creates a new connection instance.
   */
  createConnection (opts) {
    if (typeof opts === 'string') {
      opts = this.urlToHost(opts)
    }

    if (this.auth !== null) {
      opts.auth = this.auth
    } else if (opts.url.username !== '' && opts.url.password !== '') {
      opts.auth = {
        username: decodeURIComponent(opts.url.username),
        password: decodeURIComponent(opts.url.password)
      }
    }

    if (opts.ssl == null) opts.ssl = this._ssl
    /* istanbul ignore else */
    if (opts.agent == null) opts.agent = this._agent
    /* istanbul ignore else */
    if (opts.proxy == null) opts.proxy = this._proxy

    const connection = new this.Connection(opts)

    for (const conn of this.connections) {
      if (conn.id === connection.id) {
        throw new Error(`Connection with id '${connection.id}' is already present`)
      }
    }

    return connection
  }

  /**
   * Adds a new connection to the pool.
   *
   * @param {object|string} host
   * @returns {ConnectionPool}
   */
  addConnection (opts) {
    if (Array.isArray(opts)) {
      return opts.forEach(o => this.addConnection(o))
    }

    if (typeof opts === 'string') {
      opts = this.urlToHost(opts)
    }

    const connectionById = this.connections.find(c => c.id === opts.id)
    const connectionByUrl = this.connections.find(c => c.id === opts.url.href)

    if (connectionById || connectionByUrl) {
      throw new Error(`Connection with id '${opts.id || opts.url.href}' is already present`)
    }

    this.update([...this.connections, opts])
    return this.connections[this.size - 1]
  }

  /**
   * Removes a new connection to the pool.
   *
   * @param {object} connection
   * @returns {ConnectionPool}
   */
  removeConnection (connection) {
    debug('Removing connection', connection)
    return this.update(this.connections.filter(c => c.id !== connection.id))
  }

  /**
   * Empties the connection pool.
   *
   * @returns {ConnectionPool}
   */
  empty (callback) {
    debug('Emptying the connection pool')
    var openConnections = this.size
    this.connections.forEach(connection => {
      connection.close(() => {
        if (--openConnections === 0) {
          this.connections = []
          this.size = this.connections.length
          callback()
        }
      })
    })
  }

  /**
   * Update the ConnectionPool with new connections.
   *
   * @param {array} array of connections
   * @returns {ConnectionPool}
   */
  update (nodes) {
    debug('Updating the connection pool')
    const newConnections = []
    const oldConnections = []

    for (const node of nodes) {
      // if we already have a given connection in the pool
      // we mark it as alive and we do not close the connection
      // to avoid socket issues
      const connectionById = this.connections.find(c => c.id === node.id)
      const connectionByUrl = this.connections.find(c => c.id === node.url.href)
      if (connectionById) {
        debug(`The connection with id '${node.id}' is already present`)
        this.markAlive(connectionById)
        newConnections.push(connectionById)
      // in case the user has passed a single url (or an array of urls),
      // the connection id will be the full href; to avoid closing valid connections
      // because are not present in the pool, we check also the node url,
      // and if is already present we update its id with the ES provided one.
      } else if (connectionByUrl) {
        connectionByUrl.id = node.id
        this.markAlive(connectionByUrl)
        newConnections.push(connectionByUrl)
      } else {
        newConnections.push(this.createConnection(node))
      }
    }

    const ids = nodes.map(c => c.id)
    // remove all the dead connections and old connections
    for (const connection of this.connections) {
      if (ids.indexOf(connection.id) === -1) {
        oldConnections.push(connection)
      }
    }

    // close old connections
    oldConnections.forEach(connection => connection.close())

    this.connections = newConnections
    this.size = this.connections.length

    return this
  }

  /**
   * Transforms the nodes objects to a host object.
   *
   * @param {object} nodes
   * @returns {array} hosts
   */
  nodesToHost (nodes, protocol) {
    const ids = Object.keys(nodes)
    const hosts = []

    for (var i = 0, len = ids.length; i < len; i++) {
      const node = nodes[ids[i]]
      // If there is no protocol in
      // the `publish_address` new URL will throw
      // the publish_address can have two forms:
      //   - ip:port
      //   - hostname/ip:port
      // if we encounter the second case, we should
      // use the hostname instead of the ip
      var address = node.http.publish_address
      const parts = address.split('/')
      // the url is in the form of hostname/ip:port
      if (parts.length > 1) {
        const hostname = parts[0]
        const port = parts[1].match(/((?::))(?:[0-9]+)$/g)[0].slice(1)
        address = `${hostname}:${port}`
      }

      address = address.slice(0, 4) === 'http'
        /* istanbul ignore next */
        ? address
        : `${protocol}//${address}`
      const roles = node.roles.reduce((acc, role) => {
        acc[role] = true
        return acc
      }, {})

      hosts.push({
        url: new URL(address),
        id: ids[i],
        roles: Object.assign({
          [Connection.roles.MASTER]: false,
          [Connection.roles.DATA]: false,
          [Connection.roles.INGEST]: false,
          [Connection.roles.ML]: false
        }, roles)
      })
    }

    return hosts
  }

  /**
   * Transforms an url string to a host object
   *
   * @param {string} url
   * @returns {object} host
   */
  urlToHost (url) {
    return {
      url: new URL(url)
    }
  }
}

module.exports = BaseConnectionPool


/***/ }),

/***/ 8730:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const BaseConnectionPool = __webpack_require__(9233)

class CloudConnectionPool extends BaseConnectionPool {
  constructor (opts) {
    super(opts)
    this.cloudConnection = null
  }

  /**
   * Returns the only cloud connection.
   *
   * @returns {object} connection
   */
  getConnection () {
    return this.cloudConnection
  }

  /**
   * Empties the connection pool.
   *
   * @returns {ConnectionPool}
   */
  empty (callback) {
    super.empty(() => {
      this.cloudConnection = null
      callback()
    })
  }

  /**
   * Update the ConnectionPool with new connections.
   *
   * @param {array} array of connections
   * @returns {ConnectionPool}
   */
  update (connections) {
    super.update(connections)
    this.cloudConnection = this.connections[0]
    return this
  }
}

module.exports = CloudConnectionPool


/***/ }),

/***/ 6213:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const BaseConnectionPool = __webpack_require__(9233)
const assert = __webpack_require__(2357)
const debug = __webpack_require__(8237)('elasticsearch')
const Connection = __webpack_require__(5613)
const noop = () => {}

class ConnectionPool extends BaseConnectionPool {
  constructor (opts) {
    super(opts)

    this.dead = []
    // the resurrect timeout is 60s
    this.resurrectTimeout = 1000 * 60
    // number of consecutive failures after which
    // the timeout doesn't increase
    this.resurrectTimeoutCutoff = 5
    this.pingTimeout = opts.pingTimeout
    this._sniffEnabled = opts.sniffEnabled || false

    const resurrectStrategy = opts.resurrectStrategy || 'ping'
    this.resurrectStrategy = ConnectionPool.resurrectStrategies[resurrectStrategy]
    assert(
      this.resurrectStrategy != null,
      `Invalid resurrection strategy: '${resurrectStrategy}'`
    )
  }

  /**
   * Marks a connection as 'alive'.
   * If needed removes the connection from the dead list
   * and then resets the `deadCount`.
   *
   * @param {object} connection
   */
  markAlive (connection) {
    const { id } = connection
    debug(`Marking as 'alive' connection '${id}'`)
    const index = this.dead.indexOf(id)
    if (index > -1) this.dead.splice(index, 1)
    connection.status = Connection.statuses.ALIVE
    connection.deadCount = 0
    connection.resurrectTimeout = 0
    return this
  }

  /**
   * Marks a connection as 'dead'.
   * If needed adds the connection to the dead list
   * and then increments the `deadCount`.
   *
   * @param {object} connection
   */
  markDead (connection) {
    const { id } = connection
    debug(`Marking as 'dead' connection '${id}'`)
    if (this.dead.indexOf(id) === -1) {
      // It might happen that `markDead` is called jsut after
      // a pool update, and in such case we will add to the dead
      // list a node that no longer exist. The following check verify
      // that the connection is still part of the pool before
      // marking it as dead.
      for (var i = 0; i < this.size; i++) {
        if (this.connections[i].id === id) {
          this.dead.push(id)
          break
        }
      }
    }
    connection.status = Connection.statuses.DEAD
    connection.deadCount++
    // resurrectTimeout formula:
    // `resurrectTimeout * 2 ** min(deadCount - 1, resurrectTimeoutCutoff)`
    connection.resurrectTimeout = Date.now() + this.resurrectTimeout * Math.pow(
      2, Math.min(connection.deadCount - 1, this.resurrectTimeoutCutoff)
    )

    // sort the dead list in ascending order
    // based on the resurrectTimeout
    this.dead.sort((a, b) => {
      const conn1 = this.connections.find(c => c.id === a)
      const conn2 = this.connections.find(c => c.id === b)
      return conn1.resurrectTimeout - conn2.resurrectTimeout
    })

    return this
  }

  /**
   * If enabled, tries to resurrect a connection with the given
   * resurrect strategy ('ping', 'optimistic', 'none').
   *
   * @param {object} { now, requestId }
   * @param {function} callback (isAlive, connection)
   */
  resurrect (opts, callback = noop) {
    if (this.resurrectStrategy === 0 || this.dead.length === 0) {
      debug('Nothing to resurrect')
      callback(null, null)
      return
    }

    // the dead list is sorted in ascending order based on the timeout
    // so the first element will always be the one with the smaller timeout
    const connection = this.connections.find(c => c.id === this.dead[0])
    if ((opts.now || Date.now()) < connection.resurrectTimeout) {
      debug('Nothing to resurrect')
      callback(null, null)
      return
    }

    const { id } = connection

    // ping strategy
    if (this.resurrectStrategy === 1) {
      connection.request({
        method: 'HEAD',
        path: '/',
        timeout: this.pingTimeout
      }, (err, response) => {
        var isAlive = true
        const statusCode = response !== null ? response.statusCode : 0
        if (err != null ||
           (statusCode === 502 || statusCode === 503 || statusCode === 504)) {
          debug(`Resurrect: connection '${id}' is still dead`)
          this.markDead(connection)
          isAlive = false
        } else {
          debug(`Resurrect: connection '${id}' is now alive`)
          this.markAlive(connection)
        }
        this.emit('resurrect', null, {
          strategy: 'ping',
          name: opts.name,
          request: { id: opts.requestId },
          isAlive,
          connection
        })
        callback(isAlive, connection)
      })
    // optimistic strategy
    } else {
      debug(`Resurrect: optimistic resurrection for connection '${id}'`)
      this.dead.splice(this.dead.indexOf(id), 1)
      connection.status = Connection.statuses.ALIVE
      this.emit('resurrect', null, {
        strategy: 'optimistic',
        name: opts.name,
        request: { id: opts.requestId },
        isAlive: true,
        connection
      })
      // eslint-disable-next-line standard/no-callback-literal
      callback(true, connection)
    }
  }

  /**
   * Returns an alive connection if present,
   * otherwise returns a dead connection.
   * By default it filters the `master` only nodes.
   * It uses the selector to choose which
   * connection return.
   *
   * @param {object} options (filter and selector)
   * @returns {object|null} connection
   */
  getConnection (opts = {}) {
    const filter = opts.filter || (() => true)
    const selector = opts.selector || (c => c[0])

    this.resurrect({
      now: opts.now,
      requestId: opts.requestId,
      name: opts.name
    })

    const noAliveConnections = this.size === this.dead.length

    // TODO: can we cache this?
    const connections = []
    for (var i = 0; i < this.size; i++) {
      const connection = this.connections[i]
      if (noAliveConnections || connection.status === Connection.statuses.ALIVE) {
        if (filter(connection) === true) {
          connections.push(connection)
        }
      }
    }

    if (connections.length === 0) return null

    return selector(connections)
  }

  /**
   * Empties the connection pool.
   *
   * @returns {ConnectionPool}
   */
  empty (callback) {
    super.empty(() => {
      this.dead = []
      callback()
    })
  }

  /**
   * Update the ConnectionPool with new connections.
   *
   * @param {array} array of connections
   * @returns {ConnectionPool}
   */
  update (connections) {
    super.update(connections)
    this.dead = []
    return this
  }
}

ConnectionPool.resurrectStrategies = {
  none: 0,
  ping: 1,
  optimistic: 2
}

module.exports = ConnectionPool


/***/ }),

/***/ 3911:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



const BaseConnectionPool = __webpack_require__(9233)
const ConnectionPool = __webpack_require__(6213)
const CloudConnectionPool = __webpack_require__(8730)

module.exports = {
  BaseConnectionPool,
  ConnectionPool,
  CloudConnectionPool
}


/***/ }),

/***/ 8222:
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 6243:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(900);

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 8237:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(8222);
} else {
	module.exports = __webpack_require__(5332);
}


/***/ }),

/***/ 5332:
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(3867);
const util = __webpack_require__(1669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(132);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 1205:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var once = __webpack_require__(1223);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 4585:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const https = __webpack_require__(7211)
const http = __webpack_require__(8605)
const { URL } = __webpack_require__(8835)

class HttpProxyAgent extends http.Agent {
  constructor (options) {
    const { proxy, ...opts } = options
    super(opts)
    this.proxy = typeof proxy === 'string'
      ? new URL(proxy)
      : proxy
  }

  createConnection (options, callback) {
    const requestOptions = {
      method: 'CONNECT',
      host: this.proxy.hostname,
      port: this.proxy.port,
      path: `${options.host}:${options.port}`,
      headers: { connection: this.keepAlive ? 'keep-alive' : 'close' },
      agent: false
    }

    if (this.proxy.username != null && this.proxy.password != null) {
      const base64 = Buffer.from(`${this.proxy.username}:${this.proxy.password}`).toString('base64')
      requestOptions.headers['proxy-authorization'] = `Basic ${base64}`
    }

    const request = (this.proxy.protocol === 'http:' ? http : https).request(requestOptions)
    request.once('connect', (response, socket, head) => {
      request.removeAllListeners()
      socket.removeAllListeners()
      if (response.statusCode === 200) {
        callback(null, socket)
      } else {
        callback(new Error(`Bad response: ${response.statusCode}`), null)
      }
    })

    request.once('error', err => {
      request.removeAllListeners()
      callback(err, null)
    })

    request.end()
  }
}

class HttpsProxyAgent extends https.Agent {
  constructor (options) {
    const { proxy, ...opts } = options
    super(opts)
    this.proxy = typeof proxy === 'string'
      ? new URL(proxy)
      : proxy
  }

  createConnection (options, callback) {
    const requestOptions = {
      method: 'CONNECT',
      host: this.proxy.hostname,
      port: this.proxy.port,
      path: `${options.host}:${options.port}`,
      headers: { connection: this.keepAlive ? 'keep-alive' : 'close' },
      agent: false
    }

    if (this.proxy.username != null && this.proxy.password != null) {
      const base64 = Buffer.from(`${this.proxy.username}:${this.proxy.password}`).toString('base64')
      requestOptions.headers['proxy-authorization'] = `Basic ${base64}`
    }

    const request = (this.proxy.protocol === 'http:' ? http : https).request(requestOptions)
    request.once('connect', (response, socket, head) => {
      request.removeAllListeners()
      socket.removeAllListeners()
      if (response.statusCode === 200) {
        const secureSocket = super.createConnection({ ...options, socket })
        callback(null, secureSocket)
      } else {
        callback(new Error(`Bad response: ${response.statusCode}`), null)
      }
    })

    request.once('error', err => {
      request.removeAllListeners()
      callback(err, null)
    })

    request.end()
  }
}

module.exports = {
  HttpProxyAgent,
  HttpsProxyAgent
}


/***/ }),

/***/ 900:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 8341:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var once = __webpack_require__(1223)
var eos = __webpack_require__(1205)
var fs = __webpack_require__(5747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 707:
/***/ ((module) => {

"use strict";


const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/

function parse (text, reviver, options) {
  // Normalize arguments
  if (options == null) {
    if (reviver !== null && typeof reviver === 'object') {
      options = reviver
      reviver = undefined
    } else {
      options = {}
    }
  }

  const protoAction = options.protoAction || 'error'
  const constructorAction = options.constructorAction || 'error'

  // BOM checker
  if (text && text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1)
  }

  // Parse normally, allowing exceptions
  const obj = JSON.parse(text, reviver)

  // options: 'error' (default) / 'remove' / 'ignore'
  if (protoAction === 'ignore' && constructorAction === 'ignore') {
    return obj
  }

  // Ignore null and non-objects
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (protoAction !== 'ignore' && constructorAction !== 'ignore') {
    if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
      return obj
    }
  } else if (protoAction !== 'ignore' && constructorAction === 'ignore') {
    if (suspectProtoRx.test(text) === false) {
      return obj
    }
  } else {
    if (suspectConstructorRx.test(text) === false) {
      return obj
    }
  }

  // Scan result for proto keys
  scan(obj, { protoAction, constructorAction })

  return obj
}

function scan (obj, { protoAction = 'error', constructorAction = 'error' } = {}) {
  let next = [obj]

  while (next.length) {
    const nodes = next
    next = []

    for (const node of nodes) {
      if (protoAction !== 'ignore' && Object.prototype.hasOwnProperty.call(node, '__proto__')) { // Avoid calling node.hasOwnProperty directly
        if (protoAction === 'error') {
          throw new SyntaxError('Object contains forbidden prototype property')
        }

        delete node.__proto__ // eslint-disable-line no-proto
      }

      if (constructorAction !== 'ignore' && Object.prototype.hasOwnProperty.call(node, 'constructor')) { // Avoid calling node.hasOwnProperty directly
        if (constructorAction === 'error') {
          throw new SyntaxError('Object contains forbidden prototype property')
        }

        delete node.constructor
      }

      for (const key in node) {
        const value = node[key]
        if (value && typeof value === 'object') {
          next.push(node[key])
        }
      }
    }
  }
}

function safeParse (text, reviver) {
  try {
    return parse(text, reviver)
  } catch (ignoreError) {
    return null
  }
}

module.exports = {
  parse,
  scan,
  safeParse
}


/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 132:
/***/ ((module) => {

module.exports = eval("require")("supports-color");


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 1191:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 3867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__webpack_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(2932);
/******/ })()
;