import { randomUUID } from "crypto";
import type { RawCourse, ScrapedCourse } from "./schema";

// ── Slug ──────────────────────────────────────────────────────────────────────

/** Ukrainian official transliteration (CMU 2010) for slug generation. */
const CYR_MAP: Record<string, string> = {
  а:"a", б:"b", в:"v", г:"h", ґ:"g", д:"d", е:"e", є:"ie", ж:"zh", з:"z",
  и:"y", і:"i", ї:"i", й:"i", к:"k", л:"l", м:"m", н:"n", о:"o", п:"p",
  р:"r", с:"s", т:"t", у:"u", ф:"f", х:"kh", ц:"ts", ч:"ch", ш:"sh",
  щ:"shch", ь:"", ю:"iu", я:"ia", ё:"yo", э:"e", ъ:"", ы:"y",
};

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((c) => CYR_MAP[c] ?? c)
    .join("");
}

function toSlug(title: string, provider: string): string {
  // Normalize title: strip newlines/extra whitespace before processing
  const cleanTitle = title.replace(/\s+/g, " ").trim();
  const base = transliterate(`${cleanTitle}-${provider}`)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .slice(0, 80)
    .replace(/^-+|-+$/g, ""); // strip leading/trailing hyphens
  return base || randomUUID();
}

// ── Level ─────────────────────────────────────────────────────────────────────

const LEVEL_MAP: [string, ScrapedCourse["level"]][] = [
  ["beginner", "Beginner"],
  ["introductory", "Beginner"],
  ["intro", "Beginner"],
  ["basic", "Beginner"],
  ["undergraduate", "Beginner"],
  ["початківц", "Beginner"],
  ["базов", "Beginner"],
  ["intermediate", "Intermediate"],
  ["середн", "Intermediate"],
  ["advanced", "Advanced"],
  ["graduate", "Advanced"],
  ["expert", "Advanced"],
  ["просунут", "Advanced"],
];

function normalizeLevel(raw?: string): ScrapedCourse["level"] {
  if (!raw) return "Beginner";
  const lower = raw.toLowerCase();
  for (const [key, value] of LEVEL_MAP) {
    if (lower.includes(key)) return value;
  }
  return "Beginner";
}

// ── Format ────────────────────────────────────────────────────────────────────

function normalizeFormat(raw?: string): ScrapedCourse["format"] {
  if (!raw) return "Mixed";
  const lower = raw.toLowerCase();
  if (/video|lecture|watch/.test(lower)) return "Video";
  if (/interactive|exercise|challenge|lab|hands.on/.test(lower)) return "Interactive";
  if (/text|reading|article/.test(lower)) return "Text";
  return "Mixed";
}

// ── Language ──────────────────────────────────────────────────────────────────

function normalizeLanguage(raw?: string, url = ""): string {
  const lower = (raw ?? "").toLowerCase();
  if (/ukrainian|укр/.test(lower)) return "Ukrainian";
  if (/polish|pl\b/.test(lower)) return "Polish";
  if (/german|deutsch|de\b/.test(lower)) return "German";
  if (/french|français|fr\b/.test(lower)) return "French";
  if (/english|en\b/.test(lower)) return "English";
  // Infer from known Ukrainian domains
  const ukrainianDomains = [
    "prometheus.org.ua",
    "osvita.diia.gov.ua",
    "ed-era.com",
    "eduhub.in.ua",
    "vumonline.ua",
  ];
  if (ukrainianDomains.some((d) => url.includes(d))) return "Ukrainian";
  return "English";
}

// ── Category ──────────────────────────────────────────────────────────────────

type CategoryRule = { keywords: string[]; category: string; subcategory: string };

/**
 * Rules are evaluated in order — first match wins.
 * Corpus = title + description + tags (all lowercased).
 *
 * ORDERING PRINCIPLES:
 *  1. Specific beats general (Cybersecurity before Technology, HR before Business).
 *  2. Ukrainian keywords mirror each English rule so Cyrillic-title courses match.
 *  3. The final fallback is "Personal Development / General" (not Technology)
 *     so unmatched civic/soft-skills courses land somewhere reasonable.
 */
const CATEGORY_RULES: CategoryRule[] = [
  // ── Cybersecurity ────────────────────────────────────────────────────────────
  {
    keywords: [
      "cybersecurity", "security", "cryptography", "hacking", "pentest",
      "кібербезпека", "кіберзахист", "кібергігієна", "кіберзагроз", "кібератак",
      "захист персональних даних", "dpo", "фішинг", "осінт", "osint",
      "онлайн-загроз", "онлайн-безпека", "women in cyber", "аналітик із кібер",
      "проєкт стандартів національної кібер", "персональна кібер",
      "кібергігієна для", "базові знання з кібер", "кейси кібер",
    ],
    category: "Cybersecurity",
    subcategory: "Cybersecurity",
  },

  // ── Data Science ─────────────────────────────────────────────────────────────
  {
    keywords: [
      "machine learning", "deep learning", "neural", "artificial intelligence", " ai ",
      "nlp", "natural language",
      "штучний інтелект", " ші ", "chatgpt", "gpt", "майбутні лідери ші",
      "ai у", "ші у", "ші:", "ai:",
    ],
    category: "Data Science",
    subcategory: "Machine Learning",
  },
  {
    keywords: ["data analytics", "data analysis", "tableau", "power bi", "visualization"],
    category: "Data Science",
    subcategory: "Data Analytics",
  },
  {
    keywords: [
      "linear algebra", "calculus", "statistics", "probability", "mathematics", "math",
      "математика", "математик", "арифметик", "алгебра",
    ],
    category: "Data Science",
    subcategory: "Mathematics",
  },

  // ── Programming / CS ─────────────────────────────────────────────────────────
  {
    keywords: [
      "computer science", "cs50", "algorithms", "data structures", "operating system",
      "python", "javascript", "typescript", "java", "rust", "golang",
      "programming", "web dev", "html", "css", "react", "node.js",
      "веб-розробк", "основи веб-розробки", "програмування", "it-продукт",
      "створення та розвиток іт-продукт", "sql", "database",
    ],
    category: "Technology",
    subcategory: "Programming",
  },
  {
    keywords: ["cloud", "aws", "azure", "gcp", "devops", "docker", "kubernetes"],
    category: "Technology",
    subcategory: "Cloud Computing",
  },

  // ── Technology (general digital literacy) ────────────────────────────────────
  {
    keywords: [
      "цифрова трансформ", "цифрова освіта", "цифровий учитель", "цифрова політична",
      "регіональна цифрова", "відкриті дан", "вебдоступність",
      "комп'ютерних систем і мереж", "інженер із комп",
      "кар'єрні шляхи в іт", "відкрий для себе кар'єрні шляхи в іт",
      "веб3", "блокчейн", "криптограмотність", "кар'єра у веб",
      "технологі що формують", "технологи, що формують",
      "як розпочати навчання в cdto",
      "як навчитися друкувати", "друкувати наосліп",
    ],
    category: "Technology",
    subcategory: "Digital Literacy",
  },

  // ── Finance ──────────────────────────────────────────────────────────────────
  {
    keywords: [
      "finance", "accounting", "investing", "budgeting", "economics", "financial",
      "фінанс", "бухгалтер", "головний бухгалтер", "облігацій", "інвестиц",
      "закупівлі", "публічні закупівлі", "бюджет", "податк", "валютн розрахунк",
      "міжнародні розрахунки", "автострахув", "особистих фінансів",
      "фін грамотн", "базові принципи фін", "як інвестувати",
      "краудфандинг",
    ],
    category: "Finance",
    subcategory: "Finance",
  },

  // ── Law ───────────────────────────────────────────────────────────────────────
  {
    keywords: [
      "law", "legal", "compliance",
      "право", "правосудд", "правозахист", "юридич", "законодавств",
      "антикорупц", "доброчесність", "уповноважен", "корупц", "стоп корупція",
      "викривання корупції", "антикорупційн",
      "гуманітарне право", "міжнародне право", "захист прав",
      "бізнес і права людини", "права людини", "права підлітків",
      "виконавч провадж", "слідство веде набу", "набу",
      "виконавче провадж", "судд", "правові", "персональних даних (dpo)",
      "правосуддя, дружнього до дитини",
      "стандарти досудового розслідування",
    ],
    category: "Law",
    subcategory: "Law",
  },

  // ── Education ────────────────────────────────────────────────────────────────
  {
    keywords: [
      "вчитель", "учитель", "учительств", "педагог", "тьютор", "наставниц",
      "ментор для школяр", "ментор для учн",
      "класний виклик", "початок учителювання",
      "освітнє середовище", "школа без цькувань",
      "навчай безпечно", "онлайн-безпека у школі", "вчимося разом",
      "дитячий садок", "якісне освітнє", "дистанційне навчання",
      "про.школу для вчителів", "онлайн-курс для вчителів",
      "як навчати супергероїв", "навчання дітей",
      "викладання", "змішане та дистанційне навчання", "blend_it",
      "з учнями про освіту", "підготовка до нмт",
      "проф", "school", "teacher",
    ],
    category: "Education",
    subcategory: "Teaching",
  },

  // ── HR ────────────────────────────────────────────────────────────────────────
  {
    keywords: [
      "hr ", "human resources", "recruitment", "hiring",
      "управління людьми", "управління персоналом", "школа hr",
      "управління людьми і проєктами",
      "публічна служба", "публічної влади",
      "залученість і доступність у роботі",
      "організація стажування",
      "молодіжна робота", "інклюзивна молодіжна",
    ],
    category: "HR",
    subcategory: "Human Resources",
  },

  // ── Project Management → Business ────────────────────────────────────────────
  {
    keywords: [
      "project management", "agile", "scrum", "waterfall", "kanban", "pmp",
      "проєктний менеджмент", "проектний менеджмент", "управління проєктами",
      "від ідеї до змін", "вступ до проєктів соціальних інновацій",
    ],
    category: "Business",
    subcategory: "Project Management",
  },

  // ── Marketing ────────────────────────────────────────────────────────────────
  {
    keywords: [
      "marketing", "seo", "content marketing", "social media", "branding",
      "маркетинг", "бренд", "директор з маркетингу", "digital marketing",
      "книжковий маркетинг", "менеджер із цифрового маркетингу",
      "етика в pr", "smm", "pr комунікац", "як будувати сильний бренд",
    ],
    category: "Marketing",
    subcategory: "Digital Marketing",
  },

  // ── Sales ─────────────────────────────────────────────────────────────────────
  {
    keywords: [
      "продажі", "продажів", "збут", "sales",
      "продажі і комунікації", "менеджер із продажів",
      "акаунт-менеджер",
    ],
    category: "Sales",
    subcategory: "Sales",
  },

  // ── Business (broad — after more specific rules) ──────────────────────────────
  {
    keywords: [
      "business", "management", "leadership", "entrepreneurship",
      "бізнес", "менеджмент", "управління організацією", "підприємниц",
      "бізнес-стратегія", "стратегія", "стартап", "як відкрити власну справу",
      "цифровий бізнес", "цифровізація бізнесу", "enterprise",
      "дотичні", "постачальник зсу", "гранти для ветеранів",
      "лідерство в командах", "командна культура",
      "цінність бізнес-моделей", "проєктування організацій",
      "мистецтво готельного бізнесу",
      "соціальне підприємництво", "експорт", "smart exporter",
    ],
    category: "Business",
    subcategory: "Business",
  },

  // ── Psychology ───────────────────────────────────────────────────────────────
  {
    keywords: [
      "psychology", "mental health",
      "психолог", "психологічн", "ментальн", "стресост", "психотерап",
      "відновлення ментального", "ментального здоров",
      "який метод психотерапії", "підтримка після звільнення",
      "психологічна підтримка дітей", "психологічна допомога",
    ],
    category: "Psychology",
    subcategory: "Psychology",
  },

  // ── Healthcare ───────────────────────────────────────────────────────────────
  {
    keywords: [
      "health", "medicine", "первая помощь", "first aid", "nurse",
      "здоров", "медицин", "лікар", "охорона здоров", "домедичн",
      "реабілітац", "перша допомог", "домедична допомога",
      "основи здорового харчування", "сучасний догляд за новонародженими",
      "все про епілепсію", "вступ до раннього втручання",
      "як діяти в надзвичайних ситуаціях",
      "безпека за відсутності світла", "адаптивні тренування",
      "протимінна безпека",
    ],
    category: "Healthcare",
    subcategory: "Health",
  },

  // ── Languages ────────────────────────────────────────────────────────────────
  {
    keywords: [
      "english", "german", "french", "spanish", "language learning", "linguistics",
      "академічне письмо", "academic writing",
      "українська мова", "лайфхаки з укр", "мовит", "МовиТи",
      "мови національних меншин", "lingva", "вивчення мови",
      "лайфхаки з української мови", "лайфхаки з української літератур",
      "українська мова. від фонетики", "англійська мова на ізі",
      "викладання української", "мовознавств",
    ],
    category: "Languages",
    subcategory: "Language Learning",
  },

  // ── Design ───────────────────────────────────────────────────────────────────
  {
    keywords: [
      "ux design", "ui design", "figma", "prototype", "wireframe", "user experience",
      "graphic design", "illustration", "photoshop", "visual design",
      "дизайн", "ux", "ui ",
    ],
    category: "Design",
    subcategory: "Design",
  },

  // ── Media ────────────────────────────────────────────────────────────────────
  {
    keywords: [
      "journalism", "media literacy", "fake news",
      "журналіст", "фактчек", "дезінформ", "фейк", "медіаграмотн",
      "медіа", "дезінfakeція", "цифрова журналістика", "кризові комунікац",
      "як розуміти соціальні мережі", "як захиститися від фейків",
      "сексуальне насильство в інтернеті",
      "основа комунікацій для нуо",
      "мобільний фотограф",
    ],
    category: "Media",
    subcategory: "Media & Journalism",
  },

  // ── Science ──────────────────────────────────────────────────────────────────
  {
    keywords: [
      "ecology", "biology", "chemistry", "physics",
      "екологі", "природ", "біологі", "хімі", "фізик", "ботаніка",
      "екологічні аспекти розмінування",
      "автостопом по біологі",
      "фізика. механіка", "біологія. ботаніка", "географія",
    ],
    category: "Science",
    subcategory: "Natural Sciences",
  },

  // ── Engineering ──────────────────────────────────────────────────────────────
  {
    keywords: [
      "engineering", "electrical", "mechanical",
      "резервне живлення", "pon: інтернет без електрики",
      "як залишатися зі світлом та на зв'язку",
    ],
    category: "Engineering",
    subcategory: "Engineering",
  },

  // ── Architecture / Urban ─────────────────────────────────────────────────────
  {
    keywords: [
      "architecture", "urban planning",
      "архітектур", "урбан", "туризм", "туристичн", "туристичні ініціативи",
      "як туристичні ініціативи змінюють громади",
      "створення ефективних dmo",
    ],
    category: "Architecture",
    subcategory: "Urban Planning",
  },

  // ── Art / Culture ─────────────────────────────────────────────────────────────
  {
    keywords: [
      "art", "culture", "music", "film",
      "мистецтв", "культур", "музей", "театр", "кіно", "мебляр",
      "черліденг", "конструктор меблів", "оператор верстатів меблевого",
      "музей для людей",
    ],
    category: "Art",
    subcategory: "Arts & Culture",
  },

  // ── Agriculture ──────────────────────────────────────────────────────────────
  {
    keywords: ["agro", "агро", "врожай", "сільськ", "фермер", "aгро 360"],
    category: "Science",
    subcategory: "Agriculture",
  },

  // ── Personal Development (broad — after more specific rules) ─────────────────
  {
    keywords: [
      "productivity", "habits", "learning how to learn", "mindset", "time management",
      "емоційний інтелект", "персональна ефективність", "наставництво",
      "пошук роботи", "резюме", "сучасне резюме", "працевлаштування",
      "кар'єр", "soft skills", "покоління зумерів",
      "лідерство жінок", "жіноче лідерство", "гендерна рівність",
      "базові принципи працевлаштування",
      "адвокація", "громад", "волонтер", "ради впо", "відбудова",
      "соціальний проєкт у громаді", "моніторинг відновлення",
      "молодіжна", "інклюзивн", "громадянськ", "civic",
      "гендерно-чутливе", "базові знання про гендер",
      "ґендерна", "бізнес і права людини",
      "пласт", "скаутинг",
      "люди з досвідом війни",
      "знай свою україну",
    ],
    category: "Personal Development",
    subcategory: "Personal Development",
  },
];

export function inferCategory(
  title: string,
  description: string,
  tags: string[],
): Pick<ScrapedCourse, "category" | "subcategory"> {
  const corpus = `${title} ${description} ${tags.join(" ")}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => corpus.includes(kw.toLowerCase()))) {
      return { category: rule.category, subcategory: rule.subcategory };
    }
  }
  return { category: "Personal Development", subcategory: "General" };
}

// ── Confidence ────────────────────────────────────────────────────────────────

const CONFIDENCE_FIELDS: (keyof RawCourse)[] = [
  "title", "url", "description", "language", "duration", "level", "format", "image",
];

function calcConfidence(raw: RawCourse): number {
  const filled = CONFIDENCE_FIELDS.filter((f) => {
    const v = raw[f];
    return v != null && v !== "" && v !== "Self-paced";
  }).length;
  return parseFloat((filled / CONFIDENCE_FIELDS.length).toFixed(2));
}

// ── Main export ───────────────────────────────────────────────────────────────

export function normalize(raw: RawCourse): ScrapedCourse {
  // Clean title: collapse newlines/extra whitespace (e.g. from Diia innerText)
  const title = raw.title.replace(/\s+/g, " ").trim();
  const tags = raw.tags ?? [];
  const { category, subcategory } = inferCategory(title, raw.description, tags);
  const now = new Date();

  return {
    slug: toSlug(title, raw.provider),
    title,
    provider: raw.provider,
    url: raw.url,
    description: raw.description.slice(0, 200).trim(),
    longDescription: raw.description.trim(),
    category,
    subcategory,
    language: normalizeLanguage(raw.language, raw.url),
    duration: raw.duration ?? "Self-paced",
    level: normalizeLevel(raw.level),
    format: normalizeFormat(raw.format),
    certificate: raw.certificate ?? false,
    tags,
    rating: 0,    // placeholder — fill in after human review
    students: 0,  // placeholder — fill in after human review
    updatedAt: now.toISOString().slice(0, 7), // YYYY-MM
    featured: false,
    image: raw.image ?? null,
    deadline: raw.deadline ?? null,
    source: raw.source,
    review_status: "pending",
    confidence: calcConfidence(raw),
    last_checked: now.toISOString(),
  };
}
