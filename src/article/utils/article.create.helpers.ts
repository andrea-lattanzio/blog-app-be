import { Prisma } from '@prisma/client';
import {
  CreateChapterDto,
  CreateCodeSectionDto,
  CreateParagraphDto,
} from '../dto/create-article.dto';

/**
 * These functions are used to create the nested data structure for creating an article.
 * The functions are moved to this separate file to keep service method more readable.
 */

export const createChapters = (chapters: CreateChapterDto[]): Prisma.ChapterCreateWithoutArticleInput[] => {
  return chapters.map((chapter) => ({
    title: chapter.title,
    paragraphs: { create: createChapterContent(chapter.paragraphs) },
  }));
};

const createChapterContent = (paragraphs: CreateParagraphDto[]): Prisma.ParagraphCreateWithoutChapterInput[] => {
  return paragraphs.map((paragraph) => ({
    text: paragraph.text,
    codeSections: { create: createCodeSection(paragraph.codeSections) },
  }));
};

const createCodeSection = (sections: CreateCodeSectionDto[]): Prisma.CodeSectionCreateWithoutParagraphInput[] => {
  return sections.map((section) => ({
    language: section.language,
    code: section.code,
    caption: section.caption,
  }));
};
