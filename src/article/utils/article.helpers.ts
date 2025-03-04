import {
  CreateChapterDto,
  CreateCodeSectionDto,
  CreateParagraphDto,
} from '../dto/create-article.dto';

export const createChapters = (chapters: CreateChapterDto[]) => {
  return chapters.map((chapter) => ({
    title: chapter.title,
    paragraphs: { create: createChapterContent(chapter.paragraphs) },
  }));
};

const createChapterContent = (paragraphs: CreateParagraphDto[]) => {
  return paragraphs.map((paragraph) => ({
    text: paragraph.text,
    style: paragraph.style,
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
