const GenerateAccountNo = () => {
  let number = "";
  for (let i = 1; i <= 14; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
}

module.exports = GenerateAccountNo;