import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void; theme?: string }
      ) => string;
      reset: (widgetId?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export type InquiryKind = "personal" | "corporate" | "academy";

export interface InquiryFormProps {
  kind: InquiryKind;
  workerUrl: string;
  turnstileSiteKey: string;
  /** ?source=color-quiz-spring 등 유입 추적. 미지정 시 URL query 에서 자동 읽음 */
  source?: string;
}

// URL query → 폼 prefill 매핑. SSG 환경이므로 클라이언트 측에서 직접 읽음 (§6.10 함정 재발 방지).
const PREFILL_FROM_QUERY: Record<InquiryKind, string[]> = {
  personal: [],
  corporate: ["service"], // ?service=corporate 등은 추적용으로만 (별도 prefill 없음)
  academy: ["course"],    // ?course=foundation 등 → preferredCourse 자동
};
const QUERY_TO_FIELD: Record<string, string> = {
  course: "preferredCourse",
};

interface FieldDef {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "number" | "select" | "textarea";
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

// §9.1 폼 필드 명세 — kind 별 fields
const FIELDS: Record<InquiryKind, FieldDef[]> = {
  personal: [
    { name: "name", label: "성함", type: "text", required: true },
    { name: "phone", label: "연락처", type: "tel", required: true, placeholder: "010-0000-0000" },
    { name: "email", label: "이메일", type: "email" },
    { name: "interest", label: "관심 영역", type: "select", options: ["VVIP 1:1", "그룹", "이벤트", "기타"] },
    { name: "schedule", label: "희망 시기", type: "text", placeholder: "예: 12월 둘째주" },
    { name: "message", label: "추가로 전하고 싶은 말", type: "textarea" },
  ],
  corporate: [
    { name: "company", label: "회사명", type: "text", required: true },
    { name: "name", label: "담당자 성함", type: "text", required: true },
    { name: "position", label: "직책", type: "text", required: true, placeholder: "예: HR 매니저" },
    { name: "phone", label: "연락처", type: "tel", required: true },
    { name: "email", label: "회사 이메일", type: "email", required: true },
    { name: "expectedCount", label: "예상 교육 인원", type: "number", required: true },
    { name: "topic", label: "교육 주제 / 목표", type: "textarea", required: true },
    { name: "schedule", label: "희망 일정", type: "text" },
    { name: "message", label: "추가 사항", type: "textarea" },
  ],
  academy: [
    { name: "name", label: "성함", type: "text", required: true },
    { name: "phone", label: "연락처", type: "tel", required: true },
    { name: "email", label: "이메일", type: "email", required: true },
    { name: "preferredCourse", label: "희망 과정", type: "text", required: true },
    { name: "schedule", label: "참여 가능 기수·시기", type: "text" },
    { name: "message", label: "수강 동기 (선택)", type: "textarea" },
  ],
};

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function InquiryForm({ kind, workerUrl, turnstileSiteKey, source: sourceProp }: InquiryFormProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [formLoadedAt] = useState(() => Date.now());
  const [values, setValues] = useState<Record<string, string>>({});
  const [source, setSource] = useState(sourceProp ?? "");
  const [state, setState] = useState<SubmitState>("idle");
  const [errMsg, setErrMsg] = useState("");

  const fields = FIELDS[kind];

  // URL query 자동 prefill — ?source=color-quiz-spring, ?course=foundation 등
  // (SSG 환경이라 서버에서 못 읽음 — §6.10 함정 회피)
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const urlSource = params.get("source");
    if (urlSource && !sourceProp) setSource(urlSource);

    const prefillKeys = PREFILL_FROM_QUERY[kind];
    const update: Record<string, string> = {};
    prefillKeys.forEach((k) => {
      const v = params.get(k);
      if (v) {
        const fieldName = QUERY_TO_FIELD[k] ?? k;
        update[fieldName] = v;
      }
    });
    if (Object.keys(update).length > 0) {
      setValues((prev) => ({ ...update, ...prev })); // 기존 입력이 있으면 우선
    }
  }, [kind, sourceProp]);

  // Turnstile widget 렌더 — script async 로딩이라 polling 으로 대기
  useEffect(() => {
    if (!widgetRef.current || !turnstileSiteKey) return;
    if (widgetIdRef.current) return;

    let intervalId: number | undefined;

    function tryRender() {
      if (window.turnstile && widgetRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey: turnstileSiteKey,
          callback: (t) => setToken(t),
        });
        if (intervalId !== undefined) clearInterval(intervalId);
      }
    }

    tryRender();
    if (!widgetIdRef.current) {
      intervalId = window.setInterval(tryRender, 200);
    }

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    };
  }, [turnstileSiteKey]);

  const setField = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;

    if (!agree) {
      setErrMsg("개인정보 수집·이용에 동의해주세요.");
      return;
    }
    if (!token) {
      setErrMsg("자동 가입 방지 확인이 완료되지 않았습니다.");
      return;
    }

    setState("submitting");
    setErrMsg("");

    try {
      const payload: Record<string, unknown> = {
        kind,
        ...values,
        agree,
        website,                  // honeypot
        turnstileToken: token,
        formLoadedAt,
        ...(source ? { source } : {}),  // URL query 또는 prop 으로 받은 유입 추적
      };

      const res = await fetch(`${workerUrl}/api/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "submit_failed");
      }
      setState("success");
    } catch (err) {
      console.error(err);
      setState("error");
      setErrMsg("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  if (state === "success") {
    return (
      <div className="border border-foreground p-12 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Received
        </p>
        <h3 className="mt-4 font-serif italic text-3xl text-foreground">
          문의가 정상 접수되었습니다.
        </h3>
        <p className="mt-4 text-sm text-muted">
          영업일 기준 1~2일 이내에 담당자가 연락 드리겠습니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-foreground p-8 md:p-12">
      {/* v1.3.15 — 2 col grid. textarea 만 풀폭 (col-span-2). */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {f.label}
              {f.required && <span className="ml-1 text-accent">*</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                name={f.name}
                required={f.required}
                rows={4}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className="mt-2 block w-full border border-line bg-background px-4 py-3 text-sm text-soft focus:border-foreground focus:outline-none"
              />
            ) : f.type === "select" ? (
              <select
                name={f.name}
                required={f.required}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className="mt-2 block w-full border border-line bg-background px-4 py-3 text-sm text-soft focus:border-foreground focus:outline-none"
              >
                <option value="">선택</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type}
                required={f.required}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className="mt-2 block w-full border border-line bg-background px-4 py-3 text-sm text-soft focus:border-foreground focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>

      {/* honeypot (CSS 로 사용자에게 안 보임) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
      />

      {/* 동의 */}
      <label className="mt-8 flex cursor-pointer items-center gap-3 text-sm text-soft">
        <input
          type="checkbox"
          required
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="h-4 w-4 border-line"
        />
        <span>
          개인정보 수집·이용에 동의합니다.{" "}
          <a href="/privacy" className="underline-offset-4 hover:text-accent hover:underline">
            전문 보기
          </a>
        </span>
      </label>

      {/* Turnstile */}
      <div className="mt-8" ref={widgetRef}></div>

      {/* Submit */}
      <button
        type="submit"
        disabled={state === "submitting" || !token || !agree}
        className="mt-8 w-full border border-foreground bg-foreground py-4 text-sm uppercase tracking-[0.18em] text-on-dark transition-[transform,background-color,color] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === "submitting" ? "전송 중..." : "문의 보내기 →"}
      </button>

      {errMsg && (
        <p className="mt-4 text-sm text-accent">{errMsg}</p>
      )}
    </form>
  );
}
