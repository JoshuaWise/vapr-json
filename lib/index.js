'use strict';
const noInputPlugin = require('vapr-no-input');
const inputPlugin = require('vapr-input');
const outputPlugin = require('vapr-output');

module.exports = ({ encodeNull, allowAny, allowArrays } = {}) => {
	return [
		jsonOutputPlugin(!!encodeNull),
		jsonInputPlugin(!!allowAny, !!allowArrays),
	];
};

const jsonOutputPlugin = (encodeNull) => {
	return outputPlugin({ encodeNull, 'application/json': x => JSON.stringify(x) });
};

const jsonInputPlugin = (allowAny, allowArrays) => {
	const decodeJson = (chunks) => {
		let result;
		const bytes = Buffer.concat(chunks);
		if (!bytes.length) throw [400, 'Missing JSON Payload'];
		try { result = JSON.parse(bytes); }
		catch (_) { throw [400, 'Malformed JSON Payload']; }
		if (!allowAny) {
			if (result === null || typeof result !== 'object' || !allowArrays && Array.isArray(result)) {
				throw [422, 'Unprocessable JSON Payload Type'];
			}
		}
		return result;
	};

	const rejectInput = noInputPlugin();
	const expectInput = inputPlugin({ 'application/json': raw => raw.all().then(decodeJson) });

	return (req) => {
		const { method } = req;
		const hasInput = method === 'POST' || method === 'PUT' || method === 'PATCH';
		return hasInput ? expectInput(req) : rejectInput(req);
	};
};
