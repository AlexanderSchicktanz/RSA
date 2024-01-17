// Hilfsfunktionen
function calculateGGT(a, b) {
  if (b === 0) return a;
  return calculateGGT(b, a % b);
}

const extendedEuclidean = (m, n) => {
  let equation1 = [m, 1, 0];
  let equation2 = [n, 0, 1];

  const applyExtendedEuclidean = () => {
    while (equation2[0] !== 0) {
      const quotient = Math.floor(equation1[0] / equation2[0]);
      [equation1, equation2] = [equation2, [
        equation1[0] - quotient * equation2[0],
        equation1[1] - quotient * equation2[1],
        equation1[2] - quotient * equation2[2],
      ]];
    }
  };

  applyExtendedEuclidean();

  return equation1;
};

// RSA-Algo

function generatePublic(n, phi) {
  let ggt = 0;
  let e = 2;
  while (ggt !== 1) {
    e += 1;
    ggt = calculateGGT(e, phi);
  }
  return e;
}

// Form interaction

function getInputValue(input) {
  return input.options[input.selectedIndex].value;
}

function keys(form) {
  console.log(form);
  const p = +getInputValue(form.p);
  const q = +getInputValue(form.q);

  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const e = generatePublic(n, phi);
  let d = extendedEuclidean(e, phi)[1];
  if (d < 0) d += phi;

  form.n.value = n;
  form.phi.value = phi;
  form.e.value = e;
  form.d.value = d;
}

function getPublic(form) {
  form.e1.value = form.e.value;
  form.n1.value = form.n.value;
}

function getPrivate(form) {
  form.d2.value = form.d.value;
  form.n2.value = form.n.value;
}

function encode(form) {
  form.mess1.value = getInputValue(form.message);
}

function powMod(n, e, p) {
  if (p === 0 || e < 0) return 0;
  let c = 1;
  let pow = n;
  let e1 = e;
  while (e1 !== 0) {
    const d = e1 % 2;
    e1 = Math.floor(e1 / 2);
    if (d === 1) { c = (c * pow) % p; }
    pow = (pow * pow) % p;
  }
  if (c < 0) { c += p; }
  return c;
}

function encrypt(form) {
  const n = +form.mess1.value;
  const e = +form.e1.value;
  const p = +form.n1.value;
  form.mess2.value = powMod(n, e, p);
}

function getMessage(form) {
  form.mess3.value = form.mess2.value;
}

function decrypt(form) {
  const n = +form.mess3.value;
  const e = +form.d2.value;
  const p = +form.n2.value;
  form.mess4.value = powMod(n, e, p);
}

function decode(form) {
  form.mess5.selectedIndex = form.mess4.value;
}
