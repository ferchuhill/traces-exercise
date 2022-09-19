const checkIfValidIP = (str : string): boolean => {
  const ip = str.split('.');
  if (ip.length !== 4) {
    return false;
  }
  for (let i = 0; i < ip.length; i++) {
    const num = parseInt(ip[i]);
    if (num < 0 || num > 255) {
      return false;
    }
  }
  return true;
};

export default checkIfValidIP;