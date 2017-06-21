/**
 * @fileoverview The most basic formatter, it just stringifyes whatever object
 * is passed to it.
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import * as _ from 'lodash';

import { debug as d } from '../../utils/debug';
import { IFormatter, IProblem } from '../../types'; // eslint-disable-line no-unused-vars
import * as logger from '../../utils/logging';

const debug = d(__filename);

// ------------------------------------------------------------------------------
// Formatter
// ------------------------------------------------------------------------------

const formatter: IFormatter = {
    /** Format the problems grouped by `resource` name and sorted by line and column number */
    format(messages: IProblem[]) {

        debug('Formatting results');

        const resources: _.Dictionary<IProblem[]> = _.groupBy(messages, 'resource');

        _.forEach(resources, (msgs: IProblem[], resource: string) => {
            const sortedMessages: IProblem[] = _.sortBy(msgs, ['location.line', 'location.column']);

            logger.log(`${resource}: ${msgs.length} issues`);
            logger.log(JSON.stringify(sortedMessages, null, 2));
        });
    }
};

export default formatter;
