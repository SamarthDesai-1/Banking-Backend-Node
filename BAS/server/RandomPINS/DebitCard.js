const GenerateDebitCardNo = () => {
  let number = "";
  for (let i = 1; i <= 16; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
}

module.exports = GenerateDebitCardNo;