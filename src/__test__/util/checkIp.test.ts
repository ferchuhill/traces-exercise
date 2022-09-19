import checkIfValidIP from '../../util/checkIp';

describe('CheckIp', () => {
  
  test('should have a correct IP', () => {
    expect(checkIfValidIP('190.191.237.90')).toEqual(true);
  });

  test('should not haven a digit > 255', () =>{
    expect(checkIfValidIP('256.191.237.90')).toEqual(false);
  });

  test('should not haven a digit < 0', () => {
    expect(checkIfValidIP('256.-1.237.90')).toEqual(false);
  });

  test('should haven four digit', () => {
    expect(checkIfValidIP('255.191.237')).toEqual(false);
  });

});