import { formatDate } from '../../formatDate';
import type { Deps } from '../../ports';

export const returnExpired = ({ productRepo, userRepo, emailSender, logger }: Pick<Deps, 'productRepo' | 'userRepo' | 'emailSender' | 'logger'>) => async ({ now = new Date() }: { now?: Date } = {}) => {
  const expired = (await productRepo.findAllActive()).filter((rental) => rental.isExpired(now));

  for (const rental of expired) {
    const returnedAt = formatDate(rental.markAsReturned(now));
    await productRepo.update(rental);

    const user = await userRepo.findById(rental.userId);
    if (!user) continue;
        await emailSender.send(user.email, 'returnConfirmation', { movieTitle: rental.movieTitle, returnedAt })
      .catch((error: Error) => logger.error('Email returnConfirmation fallido:', error.message));
  }

  return { returned: expired.length };
};
