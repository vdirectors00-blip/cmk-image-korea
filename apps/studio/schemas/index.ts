import type { SchemaTypeDefinition } from "sanity";

// Objects (helpers)
import localeString from "./objects/localeString";
import localeText from "./objects/localeText";
import localeBlockContent from "./objects/localeBlockContent";
import seo from "./objects/seo";

// Documents
import siteSettings from "./documents/siteSettings";
import service from "./documents/service";
import academyCourse from "./documents/academyCourse";
import post from "./documents/post";
import labArticle from "./documents/labArticle";
import person from "./documents/person";
import clientLogo from "./documents/clientLogo";
import stat from "./documents/stat";
import contactInquiry from "./documents/contactInquiry";
import page from "./documents/page";

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects first so documents can reference them
  localeString,
  localeText,
  localeBlockContent,
  seo,
  // documents
  siteSettings,
  service,
  academyCourse,
  post,
  labArticle,
  person,
  clientLogo,
  stat,
  contactInquiry,
  page,
];
