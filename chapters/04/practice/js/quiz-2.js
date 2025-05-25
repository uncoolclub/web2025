const gcd = (a, b) => {
  if (b === 0) return a;
  return gcd(b, a % b);
};

const log = (a, b) => {
  console.log(`${a}와 ${b}의 최대 공약수는 ${gcd(a, b)}입니다.`);
};

log(12, 18);
log(24, 36);
