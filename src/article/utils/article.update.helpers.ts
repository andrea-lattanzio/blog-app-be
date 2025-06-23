import { Prisma } from '@prisma/client';
import {
  UpdateChapterDto,
  UpdateCodeSectionDto,
  UpdateParagraphDto,
} from '../dto/update-article.dto';

/**
 * These functions are used to create the nested data structure for updating an article.
 * The functions are moved to this seperate file to keep service method more readable.
 */

export const updateChapters = (chapters: UpdateChapterDto[]): Prisma.ChapterUpdateWithWhereUniqueWithoutArticleInput[] => {
  return chapters?.map((chapter) => ({
    where: { id: chapter.id },
    data: {
      ...(chapter.title ? { title: chapter.title } : {}),
      ...(chapter.paragraphs
        ? { paragraphs: { update: updateParagraphs(chapter.paragraphs) } }
        : {}),
    },
  }));
};

export const updateParagraphs = (paragraphs: UpdateParagraphDto[]): Prisma.ParagraphUpdateWithWhereUniqueWithoutChapterInput[] => {
  return paragraphs.map((paragraph) => ({
    where: { id: paragraph.id },
    data: {
      ...(paragraph.text ? { text: paragraph.text } : {}),
      ...(paragraph.codeSections
        ? {
            codeSections: {
              update: updateCodeSections(paragraph.codeSections),
            },
          }
        : {}),
    },
  }));
};

export const updateCodeSections = (codeSections: UpdateCodeSectionDto[]): Prisma.CodeSectionUpdateWithWhereUniqueWithoutParagraphInput[] => {
  return codeSections.map((section) => ({
    where: { id: section.id },
    data: {
      ...(section.language ? { language: section.language } : {}),
      ...(section.code ? { code: section.code } : {}),
      ...(section.caption ? { caption: section.caption } : {}),
    },
  }));
};
