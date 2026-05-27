import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./sanity";

const builder = createImageUrlBuilder(sanityClient);

// v1.3.14 — sub-path import (`@sanity/image-url/lib/types/types`) 가 TS module resolution 경고.
// 공식 export 가 main 패키지에 없어, builder.image 시그니처에서 타입 추출 (외부 dep 안전).
type ImageSource = Parameters<typeof builder.image>[0];

/**
 * Sanity 이미지 URL 빌더.
 * 사용 예:
 *   urlFor(image).width(800).height(1000).fit("crop").url()
 *   urlFor(image).width(1200).quality(80).url()
 */
export function urlFor(source: ImageSource) {
  return builder.image(source);
}
