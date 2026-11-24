module.exports = ({ productRepo }) => async function listHistory({ userId }) {
  return productRepo.findByUser(userId);
};
