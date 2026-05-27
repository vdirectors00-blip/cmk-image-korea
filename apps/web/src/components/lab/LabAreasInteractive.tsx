// Image Lab 3 영역 카드 + 클릭 시 분야별 labArticle 펼침 (v1.3.15)
// consulting AxesCards 패턴 변형. React island.
import {useState} from "react";
import {LAB_AREAS} from "@/lib/lab-areas";
import type {LabArticle, LabField} from "@/types/sanity";

interface Props {
  articles: LabArticle[];
}

function pickKo(field: {ko?: string} | undefined): string {
  return field?.ko ?? "";
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function LabAreasInteractive({articles}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const filteredArticles =
    selected !== null
      ? articles.filter((a) => a.field && LAB_AREAS[selected].match.includes(a.field as LabField))
      : [];

  return (
    <div>
      {/* 3 영역 카드 grid */}
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 md:gap-8">
        {LAB_AREAS.map((area, i) => {
          const isOpen = selected === i;
          return (
            <button
              key={area.label}
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
                {area.label}
              </h3>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                {area.korean}
              </p>
              <p className="mt-6 break-keep text-base leading-[1.7] text-soft">
                {area.copy}
              </p>
              <p className="mt-auto pt-8 text-right text-[10px] uppercase tracking-[0.18em] text-faint">
                {isOpen ? "▾ 관련 글 닫기" : "▸ 관련 글 보기"}
              </p>
            </button>
          );
        })}
      </div>

      {/* 펼침 영역 — 선택된 분야의 articles */}
      {selected !== null && (
        <div className="relative mt-16 border-t border-foreground pt-12">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-0 top-12 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-foreground"
            aria-label="관련 글 닫기"
          >
            ✕ 닫기
          </button>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {LAB_AREAS[selected].label} · Latest Notes
          </p>
          <h4
            className="mt-3 font-serif italic text-foreground"
            style={{fontSize: "clamp(28px, 3.5vw, 44px)"}}
          >
            {LAB_AREAS[selected].korean} 연구 노트
          </h4>

          {filteredArticles.length === 0 ? (
            <div className="mt-12 py-16 text-center">
              <p className="font-serif italic text-3xl text-faint">
                Articles coming soon
              </p>
              <p className="mt-3 text-sm text-muted break-keep">
                이 분야의 연구 노트는 곧 추가됩니다.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
              {filteredArticles.map((article) => (
                <a
                  key={article._id}
                  href={`/image-lab/${article.slug.current}`}
                  className="group block"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    {article.field ?? ""} · {formatDate(article.publishedAt)}
                  </p>
                  <h5 className="mt-3 font-serif text-2xl leading-tight text-foreground transition-colors group-hover:text-accent break-keep">
                    {pickKo(article.title)}
                  </h5>
                  {article.excerpt?.ko && (
                    <p className="mt-3 line-clamp-3 text-sm leading-[1.7] text-muted break-keep">
                      {pickKo(article.excerpt)}
                    </p>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
