import { Prisma } from '@prisma/client';

export const fullArticle = Prisma.validator<Prisma.ArticleDefaultArgs>()({
  include: {
    chapters: {
      include: { paragraphs: { include: { codeSections: true } } },
    },
  },
});
