import type { Deps } from '../../ports';

export const listHistory = ({ productRepo }: Pick<Deps, 'productRepo'>) => async ({ userId }: { userId: string }) => {
  return productRepo.findByUser(userId);
};
