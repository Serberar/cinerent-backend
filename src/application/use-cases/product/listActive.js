module.exports = ({ productRepo }) => async function listActive() {
  return productRepo.findAllActive();
};
