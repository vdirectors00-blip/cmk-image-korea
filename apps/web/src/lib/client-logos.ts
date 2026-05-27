// 정적 클라이언트 로고 데이터.
// LogoWall (HOME 8-cap) + ClientsBoard (/about/clients 전체) 공유.
// 파일 위치: /images/clients/{section}/{slug}.png

export interface ClientLogoEntry {
  name: string;
  slug: string;
}

export interface ClientLogoGroup {
  label: string;
  section: string;
  items: ClientLogoEntry[];
  /** 카테고리 그리드에서 제외 — 이름만 페이지 하단 텍스트로 처리 */
  unmapped?: string[];
}

export const CLIENT_LOGO_GROUPS: ClientLogoGroup[] = [
  {
    label: "공공·관공서",
    section: "public-affairs",
    items: [
      { name: "검찰청", slug: "prosecution" },
      { name: "경기도", slug: "gyeonggi" },
      { name: "경기도교원단체총연합회", slug: "gyeonggi-teachers" },
      { name: "경찰청", slug: "police" },
      { name: "공정거래위원회", slug: "ftc" },
      { name: "국가경쟁력강화위원회", slug: "pcnc" },
      { name: "국가정보원", slug: "nis" },
      { name: "국무총리비서실", slug: "pm-office" },
      { name: "국무총리실", slug: "pmo" },
      { name: "국민건강보험", slug: "nhis" },
      { name: "국방부", slug: "mnd" },
      { name: "국토해양부", slug: "moct" },
      { name: "문화체육관광부", slug: "mcst" },
      { name: "민주통합당", slug: "udp" },
      { name: "법무부", slug: "moj" },
      { name: "산업통상자원부", slug: "motie" },
      { name: "새누리당", slug: "snr" },
      { name: "서울도시철도", slug: "smrt" },
      { name: "서울메트로", slug: "seoul-metro" },
      { name: "세종연구소", slug: "sejong-inst" },
      { name: "여성가족부", slug: "mogef" },
      { name: "전국경제인연합회", slug: "fki" },
      { name: "조달청", slug: "pps" },
      { name: "중소기업중앙회", slug: "kbiz" },
      { name: "지역발전위원회", slug: "prdc" },
      { name: "통계청", slug: "kostat" },
      { name: "한국가스안전공사", slug: "kgs" },
      { name: "한국도로공사", slug: "ex" },
      { name: "한국여성경제인협회", slug: "kwea" },
      { name: "한국여성정책연구원", slug: "kwdi" },
      { name: "한전", slug: "kepco" },
      { name: "합동참모본부", slug: "jcs" },
      { name: "행정안전부", slug: "mois" },
    ],
  },
  {
    label: "럭셔리·대기업",
    section: "luxury-corporate",
    items: [
      { name: "AMOREPACIFIC", slug: "amorepacific" },
      { name: "CHAUMET", slug: "chaumet" },
      { name: "Christian Dior", slug: "dior" },
      { name: "CJMALL", slug: "cjmall" },
      { name: "GSSHOP", slug: "gsshop" },
      { name: "GUCCI", slug: "gucci" },
      { name: "Guerlain", slug: "guerlain" },
      { name: "ING", slug: "ing" },
      { name: "KT", slug: "kt" },
      { name: "LOTTE", slug: "lotte" },
      { name: "LOUIS VUITTON", slug: "lv" },
      { name: "LVMH", slug: "lvmh" },
      { name: "MARC JACOBS", slug: "marc" },
      { name: "SK", slug: "sk" },
      { name: "TOBACCO", slug: "tobacco" },
      { name: "금호아시아나", slug: "kumho" },
      { name: "대구MBC", slug: "daegu-mbc" },
      { name: "롱샴", slug: "longchamp" },
      { name: "모토로라", slug: "motorola" },
      { name: "삼성전자", slug: "samsung" },
      { name: "아워홈", slug: "ourhome" },
      { name: "에듀윌", slug: "eduwill" },
      { name: "코오롱인더스트리", slug: "kolon" },
      { name: "현대", slug: "hyundai" },
    ],
  },
  {
    label: "금융",
    section: "finance",
    items: [
      { name: "IBK기업은행", slug: "ibk" },
      { name: "KDB생명", slug: "kdb" },
      { name: "KEB외환은행", slug: "keb" },
      { name: "LIG손해보험", slug: "lig" },
      { name: "NH농협", slug: "nh" },
      { name: "PRUDENTIAL", slug: "prudential" },
      { name: "SC제일은행", slug: "sc" },
      { name: "동양생명", slug: "dongyang" },
      { name: "롯데손보", slug: "lotte-ins" },
      { name: "메리츠화재", slug: "meritz" },
      { name: "미래에셋", slug: "miraeasset" },
      { name: "삼성CS", slug: "samsung-cs" },
      { name: "삼성생명", slug: "samsung-life" },
      { name: "새마을금고", slug: "kfcc" },
      { name: "신한생명", slug: "shinhan-life" },
      { name: "에이스생명", slug: "ace-life" },
      { name: "하나은행", slug: "hana" },
      { name: "한국투자", slug: "kis" },
      { name: "흥국", slug: "heungkuk" },
    ],
  },
  {
    label: "학교",
    section: "school",
    items: [
      { name: "건국대학교", slug: "konkuk" },
      { name: "경기대", slug: "kyonggi" },
      { name: "고려대학교", slug: "korea-u" },
      { name: "광운대", slug: "kw" },
      { name: "국민대학교", slug: "kookmin" },
      { name: "동국대학교", slug: "dongguk" },
      { name: "동덕여자대학교", slug: "dongduk" },
      { name: "명지대학교", slug: "myongji" },
      { name: "서울여대", slug: "swu" },
      { name: "성균관대학교", slug: "skku" },
      { name: "숙명여자대학교", slug: "sookmyung" },
      { name: "숭실대학교", slug: "ssu" },
      { name: "연세대학교", slug: "yonsei-u" },
      { name: "이화여자대학교", slug: "ewha" },
      { name: "인하대학교", slug: "inha" },
      { name: "중앙대학교", slug: "cau" },
      { name: "차의과학대학교", slug: "cha" },
      { name: "한국외국어대학교", slug: "hufs" },
      { name: "한양대학교", slug: "hanyang" },
      { name: "한양여대", slug: "hywoman" },
    ],
    // "그외 학교.png" — 별도 이미지 1장에 모인 학교들. 사용자가 이름 목록 제공 시 채움.
    unmapped: [],
  },
];

export function getLogoPath(group: ClientLogoGroup, item: ClientLogoEntry): string {
  return `/images/clients/${group.section}/${item.slug}.png`;
}
