const {assert} = require('chai');
const { default: Logger } = require('log-ng');
const biMath = require('./BigIntMath');

const logger = new Logger('spec.js');
Logger.setLogLevel('error');

describe('BigIntMath', function(){
	it('should correctly calculate absolute value', function(){
		assert.strictEqual(biMath.abs(biMath(-5)), biMath(5));
	});

	it('should correctly calculate minimum of two BigInts', function(){
		assert.strictEqual(biMath.min(biMath(5), biMath(8), biMath(3)), biMath(3));
		assert.strictEqual(biMath.min(biMath(100), biMath(10)), biMath(10));
		assert.strictEqual(biMath.min(biMath(10), biMath(100)), biMath(10));
	});

	it('should correctly calculate maximum of two BigInts', function(){
		assert.strictEqual(biMath.max(biMath(5), biMath(8), biMath(3)), biMath(8));
		assert.strictEqual(biMath.max(biMath(10), biMath(100)), biMath(100));
		assert.strictEqual(biMath.max(biMath(100), biMath(10)), biMath(100));
	});

	it('should correctly calculate powers', function(){
		for(let i = biMath(0); i < biMath(100); ++i){
			const sqrs = biMath.pow(i, biMath(2));
			const pow2 = biMath.pow(biMath(2), i);
			assert.strictEqual(sqrs, i ** biMath(2));
			assert.strictEqual(pow2, biMath(2) ** i);
		}
	});

	it('should correctly calculate powers with modulo', function(){
		assert.strictEqual(biMath.pow(biMath(3), 4n, biMath(5)), biMath(1));
	});

	it('should generate random BigInts within specified range', function(){
		const min = biMath(50);
		const max = biMath(100);
		for(let i = 0; i < 100; ++i){
			const random = biMath.random(min, max);
			assert.ok(random >= min && random <= max);
		}
	});

	it('should generate small BigInts within the specified range', function(){
		const min = biMath.pow(biMath(2), biMath(8)) - biMath(1);
		const max = biMath.pow(min, biMath(2)) - biMath(1);
		logger.debug(`range (${min.toString(2).length}, ${max.toString(2).length})`);
		for(let i = 0; i < 1000; ++i){
			const random = biMath.random_bytes(min, max);
			logger.debug(random.toString(2).length/8, random);
			assert.ok(random >= min && random <= max);
		}
	});

	it('should generate random large BigInts within specified range', function(){
		const min = biMath(Number.MAX_SAFE_INTEGER);
		const max = biMath(Number.MAX_SAFE_INTEGER * 2);
		logger.debug(`range (${min.toString(2).length}, ${max.toString(2).length})`);
		for(let i = 0; i < 1000; ++i){
			const random = biMath.random_bytes(min, max);
			logger.debug(random.toString(2).length/8, random);
			assert.ok(random >= min && random <= max);
		}
	});

	it('should generate all values in range with equal frequency', function(){
		const numSamples = 1000;
		const min = biMath(Number.MAX_SAFE_INTEGER);
		const max = biMath(Number.MAX_SAFE_INTEGER * 2);

		const generatedValues = Array.from({length: numSamples}, () => biMath.random_bytes(min, max));

		// https://cdn.scribbr.com/wp-content/uploads/2022/05/chi-square-distribution-table.png
		chi2Test(50, generatedValues);
	});
});

describe('chi squared', function(){
	const numSamples = 1000;
	const start = BigInt(Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER)));

	it('should pass for conformant sequences', function(){
		const numSamples = 1000;
		let m = start;
		const observed = Array.from({length: numSamples}, () => m++);
		logger.debug(observed);

		chi2Test(1, observed);
	});
	it('should fail for non-conformant sequences', function(){
		const numSamples = 1000;
		let m = start;
		const observed = Array.from({length: numSamples}, () => m*=2n);

		chi2FailTest(1, observed);
	});
});

function chiSquared(sequence, numBins){
	logger.debug('sequence:', sequence);
	logger.debug('numBins:', numBins);
	if(!(numBins instanceof BigInt)){
		numBins = BigInt(numBins);
	}
	sequence.sort((a, b) => a - b > 0 ? 1 : a - b < 0 ? -1 : 0);

	const min = sequence[0];
	const max = sequence[sequence.length - 1];
	logger.debug('min:', min, 'max:', max, 'range:', max - min);
	const binSize = (max - min + 1n) / numBins;
	logger.debug('binSize:', binSize);

	const observedFrequency = new Array(Number(numBins)+1).fill(0n);
	logger.debug('observedFrequency:', observedFrequency, observedFrequency.length, typeof observedFrequency[0]);
	for(let i = 0; i < sequence.length; i++){
		// figure out which bin the value belongs to
		const bin = Number((sequence[i] - min) / binSize);
		try{
			observedFrequency[bin] += 1n;
		}catch(e){
			logger.error(e);
			logger.debug('sequence:', sequence[i]);
			logger.debug('bin:', bin, typeof bin, 'observedFrequency[bin]:', observedFrequency[bin], typeof observedFrequency[bin]);
			assert(false);
		}
	}

	const expectedFrequency = BigInt(sequence.length) / numBins;

	let chiSquare = 0n;
	for(let i = 0; i < numBins; i++){
		const deviation = observedFrequency[i] - expectedFrequency;
		chiSquare += ((deviation ** 2n)) / (expectedFrequency);
	}

	logger.debug('chiSquare:', chiSquare);
	return chiSquare;
}

function chi2Test(threshold, observed){
	const numBins = Math.round(Math.sqrt(observed.length));
	const chiSquare = chiSquared(observed, numBins);
	assert.ok(chiSquare < threshold, `Chi-Square value: ${chiSquare} exceeds threshold ${threshold}`);
}

function chi2FailTest(threshold, observed){
	const numBins = Math.round(Math.sqrt(observed.length));
	const chiSquare = chiSquared(observed, numBins);
	assert.ok(chiSquare > threshold, `Chi-Square value: ${chiSquare} is below threshold ${threshold}`);
}
