import { FunctionStep } from "../core/steps";
import type { PostContext } from "../contexts/post";
import type { IPipelineStep } from "../core/types";

/**
 * Стратегия изменения автора поста.
 * @param author - новое имя автора
 */
const changeAuthor = (author: string) => (ctx: PostContext) => {
  const prev = ctx.post.author;
  if (prev) ctx.post.previousAuthors.push(prev);
  ctx.post.author = author;
};

/**
 * Стратегия изменения заголовка поста.
 * @param title - новый заголовок
 */
const changeTitle = (title: string) => (ctx: PostContext) => {
  ctx.post.title = title;
};

/**
 * Стратегия печати истории авторов.
 */
const printAuthors = () => (ctx: PostContext) => {
  ctx.log.push(`AuthorsHistory: ${ctx.post.previousAuthors.join(" -> ") || "—"}`);
};

/**
 * Стратегия печати информации о посте.
 */
const printPost = () => (ctx: PostContext) => {
  ctx.log.push(`Post{title="${ctx.post.title}", author="${ctx.post.author ?? "—"}"}`);
};

/**
 * Guard (Chain of Responsibility): останавливает пайплайн для черновиков.
 */
const stopIfDraft = () => (ctx: PostContext) => {
  if (ctx.post.title.startsWith("[DRAFT]")) ctx.isDone = true;
};

/**
 * Стратегия изменения содержимого поста.
 * @param appendText - текст для добавления к содержимому
 */
const appendContent = (appendText: string) => (ctx: PostContext) => {
  if (!ctx.post.content) ctx.post.content = "";
  ctx.post.content += appendText;
  ctx.log.push(`ContentAppended: "${appendText}"`);
};

/**
 * Набор шагов для работы с PostContext.
 */
export const PostSteps = {
  ChangeAuthor: (author: string): IPipelineStep<PostContext> =>
    new FunctionStep(`ChangeAuthor("${author}")`, changeAuthor(author)),

  ChangeTitle: (title: string): IPipelineStep<PostContext> =>
    new FunctionStep(`ChangeTitle("${title}")`, changeTitle(title)),

  PrintAuthors: (): IPipelineStep<PostContext> =>
    new FunctionStep("PrintAuthors", printAuthors()),

  PrintPost: (): IPipelineStep<PostContext> =>
    new FunctionStep("PrintPost", printPost()),

  StopIfDraft: (): IPipelineStep<PostContext> =>
    new FunctionStep("StopIfDraft", stopIfDraft()),

  AppendContent: (appendText: string): IPipelineStep<PostContext> =>
    new FunctionStep(`AppendContent("${appendText}")`, appendContent(appendText)),
};

/**
 * Singleton для stateless шага печати поста.
 */
export const PRINT_POST_SINGLETON = PostSteps.PrintPost();