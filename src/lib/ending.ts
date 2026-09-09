// src/lib/endings.ts

export interface Ending {
  key: string;
  title: string;
  text: string;
  maxPercent: number; // верхняя граница диапазона, включительно (0..1)
}

const ASSUMED_MAX_WEIGHT_PER_QUESTION = 2;

export const endings: Ending[] = [
  {
    key: "clean",
    title: "Субъект признан человеком",
    text: "Отклонений не зафиксировано. Плёнка архивируется без пометок. Повторная проверка не требуется в течение 6 месяцев.",
    maxPercent: 0.12,
  },
  {
    key: "human",
    title: "Субъект признан условно человеком",
    text: "Незначительные отклонения зафиксированы. Повторная проверка назначена через 72 часа. Не покидайте зону видимости камер наблюдения.",
    maxPercent: 0.3,
  },
  {
    key: "watch",
    title: "Установлено наблюдение",
    text: "Профиль ответов на грани допустимого. Субъект переведён в категорию «под наблюдением» до следующего протокола.",
    maxPercent: 0.45,
  },
  {
    key: "recheck",
    title: "Требуется повторная оценка",
    text: "Ответы содержат противоречия. Протокол О.С.М.О.Т.Р. активирован частично. Ожидайте прибытия комиссии.",
    maxPercent: 0.6,
  },
  {
    key: "flagged",
    title: "Субъект отмечен как аномальный",
    text: "Более половины ответов совпадают с известными паттернами альтернатов. Запись изъята для детального анализа.",
    maxPercent: 0.75,
  },
  {
    key: "mismatch",
    title: "Совпадение не обнаружено",
    text: "Профиль ответов не соответствует ни одному known-шаблону. Запись остановлена по требованию Отдела Оценки Угроз.",
    maxPercent: 0.9,
  },
  {
    key: "critical",
    title: "КРИТИЧЕСКОЕ ОТКЛОНЕНИЕ",
    text: "Субъект не прошёл ни одного контрольного пункта протокола. Дальнейший контакт не рекомендован. Кассета подлежит немедленному уничтожению.",
    maxPercent: 1,
  },
];

// срабатывает вне зависимости от баллов, если субъект молчал
// на большинстве вопросов дольше 10 секунд
const TIMEOUT_MAJORITY_RATIO = 0.5;

export const timeoutEnding: Ending = {
  key: "unresponsive",
  title: "Реакция субъекта нехарактерна",
  text: "Задержка ответа зафиксирована на большинстве вопросов. Протокол №88 однозначно классифицирует такое поведение как умственное вмешательство. Требуется очный осмотр.",
  maxPercent: 1,
};

export function resolveEnding(
  score: number,
  totalQuestions: number,
  timedOutCount: number = 0,
): Ending {
  if (
    totalQuestions > 0 &&
    timedOutCount / totalQuestions >= TIMEOUT_MAJORITY_RATIO
  ) {
    return timeoutEnding;
  }

  const maxPossible = totalQuestions * ASSUMED_MAX_WEIGHT_PER_QUESTION;
  const percent = maxPossible > 0 ? Math.min(score / maxPossible, 1) : 0;

  return (
    endings.find((e) => percent <= e.maxPercent) ?? endings[endings.length - 1]
  );
}
