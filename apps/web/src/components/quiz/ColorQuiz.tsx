import { useState } from "react";
import { questions, calculateType } from "@/lib/color-quiz";

interface Props {
  /** 결과 페이지 prefix — default `/color-quiz/result` */
  resultBase?: string;
}

export default function ColorQuiz({ resultBase = "/color-quiz/result" }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, value: string) => {
    const next = { ...answers, [questionId]: value };
    setAnswers(next);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const type = calculateType(next);
      window.location.href = `${resultBase}/${type}`;
    }
  };

  const progress = ((step + 1) / questions.length) * 100;
  const q = questions[step];

  return (
    <div className="mx-auto max-w-2xl">
      {/* progress */}
      <div className="mb-12 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted">
        <span>
          {String(step + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="mb-16 h-px w-full bg-line">
        <div
          className="h-px bg-foreground transition-all duration-500 ease-[var(--ease-out-soft)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* question */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        Question {step + 1}
      </p>
      <h2
        className="mt-4 font-serif italic leading-[1.15] text-foreground"
        style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
      >
        {q.text}
      </h2>

      {/* options */}
      <div className="mt-12 space-y-3">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleAnswer(q.id, opt.value)}
            className="block w-full border border-line bg-background px-6 py-5 text-left text-base text-soft transition-[transform,background-color,color,border-color] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-[2px] hover:border-foreground hover:text-foreground"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* back */}
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-10 text-xs uppercase tracking-[0.18em] text-muted hover:text-foreground"
        >
          ← 이전
        </button>
      )}
    </div>
  );
}
