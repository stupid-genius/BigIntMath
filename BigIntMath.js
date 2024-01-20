function flyweightCache(num){
	if(flyweightCache[num] !== undefined){
		// console.log(`returning ${num}`);
		return flyweightCache[num];
	}
	// console.log(`creating ${num}`);
	const biVal = BigInt(+num);
	Object.defineProperty(flyweightCache, num, {
		get: function(){
			return biVal;
		}
	});
	return biVal;
}

//chauffage
[0, 1, 2, 3].forEach(flyweightCache);

const defaultMod = flyweightCache[2]**flyweightCache(128);
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
		value: (base, exp, mod = defaultMod) => {
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
	}
});

module.exports = biMath;
