import type { Deps } from '../../ports';

export const listActive = ({ productRepo }: Pick<Deps, 'productRepo'>) => async () => {
  return productRepo.findAllActive();
};
