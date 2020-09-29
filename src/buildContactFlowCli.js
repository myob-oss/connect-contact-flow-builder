#!/usr/bin/env node

const path = require('path');
const { parseArgs, loadContactFlowDefinition } = require('./cli/cliTools');
const buildContactFlow = require('./index');

/**
 * @param {ErrorResult} result
 */
function writeErrorResult(result) {
  process.stderr.write(result.error.message);
  process.stderr.write('\n');
  if (result.error.innerError) {
    process.stderr.write('\n');
    process.stderr.write(result.error.innerError.message);
    process.stderr.write('\n');
  }
}

const args = parseArgs(process.argv);
if (args.help || !args.isValid) {
  if (!args.isValid) {
    process.stderr.write(`Invalid arguments ${JSON.stringify(args)}\n\n`);
  }
  process.stderr.write(`Usage: build-contact-flow [...options] flowName sourcePath [...builderArgs]

Generate a contact flow named "flowName". Import the JavaScript module at 
"sourcePath" and pass [...builderArgs] as positional arguments to the exported
function. Serialize the returned object to JSON and print to stdout.

Example:
  build-contact-flow 'Main Flow' ./flowDefinition.js $LAMBDA_ARN
    
Options:
  -h, --help          Print command line usage info 
`);
  process.exit(0);
}

const definitionPath = path.resolve(process.cwd(), args.sourcePath);
const flowDefinition = loadContactFlowDefinition(definitionPath, args.generateArgs);
if (flowDefinition.error) {
  writeErrorResult(flowDefinition);
  process.exit(1);
}

try {
  const generatedConfig = buildContactFlow(args.flowName, flowDefinition);
  process.stdout.write(JSON.stringify(generatedConfig));
  process.stdout.write('\n');
} catch (error) {
  process.stderr.write(error.message);
  process.stderr.write('\n\n');
  process.stderr.write(error.stack);
  process.stdout.write('\n');
}
