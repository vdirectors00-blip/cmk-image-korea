// 단순 tagged template — IDE에서 GROQ 구문 강조 받기 위한 식별자.
// (@sanity/client 7.x는 별도 groq export를 제공하지 않으므로 자체 정의)
export function groq(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}
