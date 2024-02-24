const GenerateIFSC = () => {
  let IFSC = "TRAC";
  for (let i = 1; i <= 7; i++) {
    IFSC += Math.floor(Math.random() * 10).toString();
  }
  return IFSC;
}

module.exports = GenerateIFSC;