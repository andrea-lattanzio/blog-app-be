
import type {
  UpdateArticleDto,
  UpdateChapterDto,
  UpdateCodeSectionDto,
  UpdateParagraphDto,
} from '../dto/update-article.dto';

import {
  type Article,
  type Chapter,
  type CodeSection,
  type Paragraph,
  type Prisma,
  PrismaClient,
} from '@prisma/client';
import { isValidArticleModelName } from 'src/shared/utils/common';

export type ArticleModels = Article | Chapter | Paragraph | CodeSection;

export type ModelName = 'article' | 'chapter' | 'paragraph' | 'codesection';

export type ArticlePartDelegate =
  Prisma.ArticleDelegate |
  Prisma.ChapterDelegate |
  Prisma.ParagraphDelegate |
  Prisma.CodeSectionDelegate;

export type UpdateArticlePartDto =
  UpdateArticleDto |
  UpdateChapterDto |
  UpdateParagraphDto |
  UpdateCodeSectionDto;

/* eslint-disable */
export interface UpdatableModelDelegate {
  update: (args: { where: { id: string }; data: UpdateArticlePartDto }) => Promise<any>
}

const prisma: PrismaClient = new PrismaClient();

export function getModel(modelName: string): UpdatableModelDelegate {
  if (!isValidArticleModelName(modelName)) {
    throw new Error('Model name is not valid');
  }

  let delegate: ArticlePartDelegate;

  switch (modelName) {
    case 'article':
      delegate = prisma.article;
      break;
    case 'chapter':
      delegate = prisma.chapter;
      break;
    case 'paragraph':
      delegate = prisma.paragraph;
      break;
    case 'codesection':
      delegate = prisma.codeSection;
      break;
  }

  return delegate as unknown as UpdatableModelDelegate;
}
