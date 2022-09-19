import calculateDistanceToUSA from '../../util/calculeteDistances';

describe('calculeteDistances', function () {

  test('calculateDistanceToUSA', () => {
    const distance = parseFloat(calculateDistanceToUSA(-36, -59.9964).toFixed(2));
    expect(distance).toEqual(8922.51);
  });
  
});