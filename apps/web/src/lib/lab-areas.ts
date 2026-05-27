// Image Lab 3 영역 카드 데이터 (v1.3.15)
// audit §4 결정 3 — 한 줄 카피 1차 노출.
import type {LabField} from "@/types/sanity";

export interface LabArea {
  label: string;    // 영문 — 카드 큰 italic 제목
  korean: string;   // 한글 — 카드 부제
  copy: string;     // 한 줄 카피
  match: LabField[]; // labArticle.field 매칭 (펼침 영역 필터용)
}

export const LAB_AREAS: LabArea[] = [
  {
    label: "Personal Color",
    korean: "퍼스널 컬러",
    copy: "자연적인 색채조화로 사람에게 어울리는 색을 진단하는 프로그램",
    match: ["퍼스널컬러"],
  },
  {
    label: "Style",
    korean: "스타일",
    copy: "바디 타입 진단을 통해 자신만의 어울리는 소재·실루엣·패턴을 알 수 있는 시스템",
    match: ["스타일"],
  },
  {
    label: "Body & Hair",
    korean: "골격·헤어",
    copy: "얼굴형과 골격에 따라 헤어 스타일과 헤어 웨어를 연출하는 프로그램",
    match: ["골격", "헤어"],
  },
];
