// Consulting 3 축 카드 + 클릭 시 형식별 details 펼침 (v1.3.15)
// cardToggleLabel — executive 처럼 형식 1개 카드별로 다른 카테고리는 "세부 내용" 같은 다른 라벨 사용.
// 펼침 제목 동적 — 1 form 이면 format.name (예: "맞춤형 TASTE PROGRAM"), 2 form 이면 "두 가지 형식으로".
import {useState} from "react";
import type {CategoryAxes} from "@/lib/consulting-axes";

interface Props {
  data: CategoryAxes;
  cardToggleLabel?: string; // default "진행 형식"
}

export default function ConsultingAxes({data, cardToggleLabel = "진행 형식"}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div>
      {/* 3 축 카드 grid — items-stretch 로 카드 동일 높이 */}
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-8">
        {data.axes.map((axis, i) => {
          const isOpen = selected === i;
          return (
            <button
              key={axis.label}
              type="button"
              onClick={() => setSelected(isOpen ? null : i)}
              className={`group flex h-full w-full flex-col border bg-background p-8 text-left transition-colors duration-200 ease-[var(--ease-out-soft)] ${
                isOpen
                  ? "border-foreground bg-cream/40"
                  : "border-line hover:border-foreground hover:bg-cream/20"
              }`}
            >
              <h3
                className={`font-serif italic leading-tight tracking-[-0.01em] transition-colors ${
                  isOpen ? "text-accent" : "text-foreground group-hover:text-accent"
                }`}
                style={{fontSize: "clamp(28px, 3.5vw, 44px)"}}
              >
                {axis.label}
              </h3>
              <p className="mt-4 text-sm leading-[1.7] text-soft whitespace-pre-line">
                {axis.copy}
              </p>
              <ul className="mt-6 space-y-1.5 break-keep">
                {axis.contents.map((c) => (
                  <li key={c} className="text-[13px] leading-snug text-muted">
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-8 text-right text-[10px] uppercase tracking-[0.18em] text-faint">
                {isOpen ? `▾ ${cardToggleLabel} 닫기` : `▸ ${cardToggleLabel} 보기`}
              </p>
            </button>
          );
        })}
      </div>

      {/* 펼침 영역 — 선택된 축의 형식별 details + 닫기 버튼 */}
      {selected !== null && (() => {
        const axis = data.axes[selected];
        const singleForm = axis.formats.length === 1;
        const sectionTitle = singleForm ? axis.formats[0].name : "두 가지 형식으로";

        return (
          <div className="relative mt-16 border-t border-foreground pt-12">
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-0 top-12 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground"
              aria-label={`${cardToggleLabel} 닫기`}
            >
              ✕ 닫기
            </button>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {axis.label} · {cardToggleLabel}
            </p>
            <h4
              className="mt-3 font-serif italic text-foreground"
              style={{fontSize: "clamp(28px, 3.5vw, 44px)"}}
            >
              {sectionTitle}
            </h4>

            <div
              className={`mt-12 grid grid-cols-1 gap-12 md:gap-16 ${
                singleForm ? "" : "md:grid-cols-2"
              }`}
            >
              {axis.formats.map((format) => (
                <div key={format.name}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {format.duration}
                  </p>
                  {/* 1 form 일 때 펼침 제목과 동일하므로 format.name 생략 */}
                  {!singleForm && (
                    <h5 className="mt-2 font-serif italic text-2xl text-foreground">
                      {format.name}
                    </h5>
                  )}
                  {format.feature && (
                    <p className="mt-4 break-keep text-sm leading-[1.7] text-soft">
                      {format.feature}
                    </p>
                  )}
                  <ul className="mt-8 space-y-6 break-keep">
                    {format.modules.map((m) => (
                      <li key={m.name}>
                        <p className="font-serif text-xl leading-tight text-foreground break-keep">
                          {m.name}
                        </p>
                        {m.description && (
                          <p className="mt-2 text-sm leading-[1.65] text-muted break-keep">
                            {m.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
