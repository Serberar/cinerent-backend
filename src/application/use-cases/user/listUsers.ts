import type { Deps } from '../../ports';

export const listUsers = ({ userRepo }: Pick<Deps, 'userRepo'>) => async () => {
  const users = (await userRepo.findAll()).filter((user) => user.role !== 'ADMIN');
  return {
    users: users.map(({ id, firstName, lastName, email, role, createdAt, suspended, suspensionNote }) => (
      { id, firstName, lastName, email, role, createdAt, suspended, suspensionNote }
    )),
  };
};
