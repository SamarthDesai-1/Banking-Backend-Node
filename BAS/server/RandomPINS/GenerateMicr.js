const GenerateMICR = () => {
  let MICR = "";
  for (let i = 1; i <= 9; i++) {
    MICR += Math.floor(Math.random() * 10).toString();
  }
  return MICR;
}

module.exports = GenerateMICR;