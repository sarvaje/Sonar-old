/**
 * @fileoverview Validates that a given configuration is fully valid in terms
 * of schema and options.
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

import * as _ from 'lodash';
import * as schemaValidator from 'is-my-json-valid/require';

import { debug as d } from '../utils/debug';
import { IRuleBuilder } from '../types'; //eslint-disable-line no-unused-vars
import * as logger from '../utils/logging';
import * as resourceLoader from '../utils/resource-loader';
import { validate as validateRule } from './config-rules';

const debug = d(__filename);

/** Validates that a configuration is valid */
const validate = schemaValidator('config-schema.json');

// ------------------------------------------------------------------------------
// Public
// ------------------------------------------------------------------------------

/** Validates that a given config object is valid */
export const validateConfig = (config): boolean => {

    debug('Validating configuration');
    if (!validate(config)) {
        logger.error('Configuration schema is not valid');

        return false;
    }

    // Validate also collectors, plugins, etc.
    const rules: Map<string, IRuleBuilder> = resourceLoader.getRules();

    const areRulesValid = _.reduce(config.rules, (acum: boolean, ruleConfig, ruleId: string) => {
        const rule: IRuleBuilder = rules.get(ruleId);

        if (!rule) {
            logger.error(`Rule "${ruleId}" not found`);

            return false;
        }

        let validConfig: boolean = true;

        try {
            validConfig = validateRule(rule, ruleConfig, ruleId);
        } catch (err) {
            // if severity is invalid
            validConfig = false;
        }

        if (!validConfig) {
            logger.error(`Invalid configuration for "${ruleId}"`);

            return false;
        }

        return acum && true;
    }, true);

    return areRulesValid;
};
