// service heroImage fallback (v1.3.15)
// Sanity image 비어있을 때 코드 fallback 으로 사용.
// HOME ServiceCards · /consulting 인덱스 · /consulting/[slug] 상단 배너 3 곳에서 import.
export const SERVICE_HERO_FALLBACK: Record<string, string> = {
  corporate: "/images/services/corporate.png",
  executive: "/images/services/executive.png",
  personal: "/images/services/personal.png",
  public: "/images/services/public.png",
  media: "/images/services/media.png",
};
