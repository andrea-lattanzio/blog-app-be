import { Prisma } from '@prisma/client';

export const fullArticle = Prisma.validator<Prisma.ArticleDefaultArgs>()({
  include: {
    author: true,
    chapters: {
      include: { paragraphs: { include: { codeSections: true } } },
    },
  },
});
