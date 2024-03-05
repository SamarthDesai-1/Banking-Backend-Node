exports.authorize = async (request, response) => {

  return response.status(200).send({ msg: "Authorized user" });
  
};