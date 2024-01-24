const { assert } = require('chai');
const biMath = require('./BigIntMath');

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

	it('should generate random large BigInts within specified range', function(){
		const min = biMath.pow(biMath(2), biMath(1024))-biMath(1);
		const max = biMath.pow(min, biMath(2))-biMath(1);
		// console.log(`range (${min.toString(2).length}, ${max.toString(2).length})`);
		for(let i = 0; i < 1000; ++i){
			const random = biMath.random_bytes(min, max);
			// console.log(random.toString(2).length/8, random);
			assert.ok(random >= min && random <= max);
		}
	});
});
