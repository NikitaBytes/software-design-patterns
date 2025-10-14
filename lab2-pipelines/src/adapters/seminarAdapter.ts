import { FunctionStep } from "../core/steps";
import type { SeminarContext } from "../contexts/seminar";
import type { IPipelineStep } from "../core/types";

/**
 * Стратегия изменения докладчика семинара.
 * @param name - новое имя докладчика
 */
const changeSpeaker = (name: string) => (ctx: SeminarContext) => {
  const prev = ctx.seminar.speaker;
  if (prev) ctx.seminar.previousSpeakers.push(prev);
  ctx.seminar.speaker = name;
};

/**
 * Стратегия изменения темы семинара.
 * @param topic - новая тема
 */
const changeTopic = (topic: string) => (ctx: SeminarContext) => {
  ctx.seminar.topic = topic;
};

/**
 * Стратегия печати истории докладчиков.
 */
const printSpeakers = () => (ctx: SeminarContext) => {
  ctx.log.push(`SpeakersHistory: ${ctx.seminar.previousSpeakers.join(" -> ") || "—"}`);
};

/**
 * Стратегия печати информации о семинаре.
 */
const printSeminar = () => (ctx: SeminarContext) => {
  ctx.log.push(`Seminar{topic="${ctx.seminar.topic}", speaker="${ctx.seminar.speaker ?? "—"}"}`);
};

/**
 * Guard (Chain of Responsibility): останавливает пайплайн для черновиков.
 */
const stopIfDraft = () => (ctx: SeminarContext) => {
  if (ctx.seminar.topic.startsWith("[DRAFT]")) ctx.isDone = true;
};

/**
 * Набор шагов для работы с SeminarContext.
 */
export const SeminarSteps = {
  ChangeSpeaker: (n: string): IPipelineStep<SeminarContext> =>
    new FunctionStep(`ChangeSpeaker("${n}")`, changeSpeaker(n)),

  ChangeTopic: (t: string): IPipelineStep<SeminarContext> =>
    new FunctionStep(`ChangeTopic("${t}")`, changeTopic(t)),

  PrintSpeakers: (): IPipelineStep<SeminarContext> =>
    new FunctionStep("PrintSpeakers", printSpeakers()),

  PrintSeminar: (): IPipelineStep<SeminarContext> =>
    new FunctionStep("PrintSeminar", printSeminar()),

  StopIfDraft: (): IPipelineStep<SeminarContext> =>
    new FunctionStep("StopIfDraft", stopIfDraft()),
};