import {
  CreateChapterDto,
  CreateCodeSectionDto,
  CreateParagraphDto,
} from '../dto/create-article.dto';

/**
 * These functions are used to create the nested data structure for creating an article.
 * The functions are moved to this seperate file to keep service method more readable.
 */

export const createChapters = (chapters: CreateChapterDto[]) => {
  return chapters.map((chapter) => ({
    title: chapter.title,
    paragraphs: { create: createChapterContent(chapter.paragraphs) },
  }));
};

const createChapterContent = (paragraphs: CreateParagraphDto[]) => {
  return paragraphs.map((paragraph) => ({
    text: paragraph.text,
    codeSections: { create: createCodeSection(paragraph.codeSections) },
  }));
};

const createCodeSection = (sections: CreateCodeSectionDto[]) => {
  return sections.map((section) => ({
    language: section.language,
    code: section.code,
    caption: section.caption,
  }));
};
