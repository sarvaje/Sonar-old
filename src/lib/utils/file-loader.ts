import * as requireUncached from 'require-uncached';
import * as stripComments from 'strip-json-comments';

import { debug as d } from './debug';
import { readFile } from './misc';

const debug = d(__filename);

/** Loads a JSON a file. */
const loadJSONFile = (filePath: string): any => {

    debug(`Loading JSON file: ${filePath}`);

    return JSON.parse(stripComments(readFile(filePath)));
};

/** Loads a JavaScript file. */
const loadJSFile = (filePath: string): any => {

    debug(`Loading JS file: ${filePath}`);

    return requireUncached(filePath);
};

export {
    loadJSFile,
    loadJSONFile
};
