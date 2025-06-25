import { Prisma } from '@prisma/client';

export const fullArticle = Prisma.validator<Prisma.ArticleDefaultArgs>()({
  include: {
    _count: { select: { likes: true }},
    author: true,
    chapters: {
      include: { paragraphs: { include: { codeSections: true } } },
    },
  },
});
