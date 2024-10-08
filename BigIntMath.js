let Logger;
if(typeof window === 'undefined'){
	Logger = require('log-ng');
}else{
	Logger = require('log-ng').default;
}

const logger = new Logger('BigIntMath.js');

function flyweightCache(num){
	if(flyweightCache[num] !== undefined){
		logger.silly(`returning ${num}`);
		return flyweightCache[num];
	}
	logger.silly(`creating ${num}`);
	const biVal = BigInt(num);
	Object.defineProperty(flyweightCache, num, {
		get: function(){
			return biVal;
		}
	});
	return biVal;
}

//chauffage
[0, 1, 2, 3, 8, 20, 128].forEach(flyweightCache);

// this consumes ~120k of memory; set it lower if not needed and you are memory constrained
const maxBigInt = flyweightCache[2]**(flyweightCache[2]**flyweightCache[20]-flyweightCache[1]);
const biMath = flyweightCache;
Object.defineProperties(biMath, {
	abs: {
		value: (n) => n < flyweightCache[0] ? -n : n
	},
	max: {
		value: (v, ...values) => values.reduce((acc, cur) => cur > acc ? cur : acc, v)
	},
	min: {
		value: (v, ...values) => values.reduce((acc, cur) => cur < acc ? cur : acc, v)
	},
	pow: {
		value: (base, exp, mod = maxBigInt) => {
			let result = flyweightCache[1];

			while(exp > flyweightCache[0]){
				if(exp % flyweightCache[2] === flyweightCache[1]){
					result = (result * base) % mod;
				}
				base = (base * base) % mod;
				exp = exp / flyweightCache[2];
			}

			return result;
		}
	},
	random: {
		value: (min, max) => BigInt(Math.floor(Math.random() * Number(max - min + flyweightCache[1]))) + min
	},
	random_bytes: {
		value: (min, max) => {
			if(!(min instanceof BigInt)){
				min = BigInt(min);
			}
			if(!(max instanceof BigInt)){
				max = BigInt(max);
			}
			const range = max - min;
			const bytes = Math.ceil(range.toString(2).length / 8);
			const maxPossibleValue = (flyweightCache[1] << (flyweightCache(bytes) * flyweightCache[8])) - flyweightCache[1];
			let randomBigInt = flyweightCache[0];

			for(let i = 0; i < bytes; ++i){
				const randomByte = Math.floor(Math.random() * 256);
				randomBigInt = (randomBigInt << flyweightCache[8]) | BigInt(randomByte);
				logger.debug(`acc: ${randomBigInt}, generated byte ${randomByte}`);
			}

			randomBigInt = (randomBigInt * range) / maxPossibleValue;
			return randomBigInt + min;
		}
	}
});

module.exports = biMath;
