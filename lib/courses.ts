import scrapedData from "../data/scraped-courses.json";

export type Course = {
  slug: string;
  title: string;
  provider: string;
  providerLogo?: string;
  description: string;
  longDescription: string;
  category: string;
  subcategory: string;
  language: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  format: "Video" | "Text" | "Interactive" | "Mixed";
  certificate: boolean;
  url: string;
  tags: string[];
  rating: number;
  students: number;
  updatedAt: string;
  featured: boolean;
  ukraineNote?: string;
};

export const CATEGORIES = [
  "Technology",
  "Business",
  "Design",
  "Languages",
  "Data Science",
  "Marketing",
  "Finance",
  "Personal Development",
  "Cybersecurity",
  "Engineering",
  "Healthcare",
  "Law",
  "Psychology",
  "HR",
  "Sales",
  "Education",
  "Architecture",
  "Science",
  "Media",
  "Art",
];

export const LANGUAGES = ["English", "Ukrainian", "Polish", "German", "French"];

export const LEVELS: Course["level"][] = ["Beginner", "Intermediate"];

const hardcodedCourses: Course[] = [
  {
    slug: "google-ux-design",
    title: "Google UX Design Professional Certificate",
    provider: "Coursera / Google",
    description: "Вивчіть основи UX-дизайну: емпатія, визначення проблем, генерація ідей, прототипування та тестування.",
    longDescription: "Ця програма від Google надає навички, необхідні для початку кар'єри UX-дизайнера. Ви навчитеся слідувати процесу дизайну: розуміти потреби користувачів, визначати больові точки, генерувати рішення, створювати вайрфрейми та прототипи, тестувати дизайн. Після завершення у вас буде портфоліо з трьох UX-проектів.",
    category: "Design",
    subcategory: "UX/UI",
    language: "English",
    duration: "6 months",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://coursera.org/professional-certificates/google-ux-design",
    tags: ["UX", "Design", "Google", "Portfolio", "Figma"],
    rating: 4.8,
    students: 412000,
    updatedAt: "2024-01",
    featured: true,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України. Потрібен паспорт або посвідчення.",
  },
  {
    slug: "cs50-harvard",
    title: "CS50: Introduction to Computer Science",
    provider: "Harvard / edX",
    description: "Легендарний вступний курс Гарварду з інформатики та програмування: C, Python, SQL та багато іншого.",
    longDescription: "CS50 — це вступ Гарвардського університету до інформатики та мистецтва програмування. Курс охоплює абстракцію, алгоритми, структури даних, безпеку, веб-розробку та багато іншого. Мови програмування: C, Python, SQL та JavaScript. Курс відомий своєю строгістю та глибиною.",
    category: "Technology",
    subcategory: "Computer Science",
    language: "English",
    duration: "12 weeks",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://cs50.harvard.edu/x",
    tags: ["CS", "Python", "C", "Algorithms", "Harvard"],
    rating: 4.9,
    students: 3500000,
    updatedAt: "2024-02",
    featured: true,
  },
  {
    slug: "prometheus-python",
    title: "Python для початківців",
    provider: "Prometheus",
    description: "Безкоштовний курс з основ програмування на Python українською мовою від провідної освітньої платформи.",
    longDescription: "Цей курс навчить вас основам програмування за допомогою мови Python. Ви навчитеся писати прості програми, працювати з даними, використовувати функції та модулі. Курс розроблений спеціально для тих, хто тільки починає програмувати. Всі матеріали доступні безкоштовно на платформі Prometheus.",
    category: "Technology",
    subcategory: "Programming",
    language: "Ukrainian",
    duration: "8 weeks",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://prometheus.org.ua",
    tags: ["Python", "Programming", "Ukrainian", "Prometheus"],
    rating: 4.7,
    students: 87000,
    updatedAt: "2023-11",
    featured: true,
    ukraineNote: "Безкоштовно для всіх українців. Сертифікат видається після завершення.",
  },
  {
    slug: "google-data-analytics",
    title: "Google Data Analytics Professional Certificate",
    provider: "Coursera / Google",
    description: "Підготуйтеся до роботи аналітиком даних за шість місяців або менше.",
    longDescription: "Отримайте глибоке розуміння практик молодшого аналітика даних. Вивчіть очищення, аналіз і візуалізацію даних, а також інструменти: таблиці, SQL, мову R та Tableau.",
    category: "Data Science",
    subcategory: "Data Analytics",
    language: "English",
    duration: "6 months",
    level: "Beginner",
    format: "Mixed",
    certificate: true,
    url: "https://coursera.org/professional-certificates/google-data-analytics",
    tags: ["Data", "SQL", "R", "Tableau", "Google", "Analytics"],
    rating: 4.8,
    students: 890000,
    updatedAt: "2024-01",
    featured: false,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України.",
  },
  {
    slug: "freecodecamp-web",
    title: "Responsive Web Design Certification",
    provider: "freeCodeCamp",
    description: "Вивчіть HTML, CSS та принципи адаптивного веб-дизайну через 300 годин навчального матеріалу.",
    longDescription: "У цій сертифікації ви вивчите мови розробки веб-сторінок: HTML для контенту та CSS для дизайну. Опануєте сучасні техніки: CSS-змінні, flexbox та grid. Проекти включають сторінку-трибут, форму опитування, лендинг, технічну документацію та портфоліо.",
    category: "Technology",
    subcategory: "Web Development",
    language: "English",
    duration: "300 hours",
    level: "Beginner",
    format: "Interactive",
    certificate: true,
    url: "https://freecodecamp.org/learn/2022/responsive-web-design",
    tags: ["HTML", "CSS", "Web", "Flexbox", "Grid", "Free"],
    rating: 4.7,
    students: 2100000,
    updatedAt: "2023-10",
    featured: false,
  },
  {
    slug: "mit-linear-algebra",
    title: "Linear Algebra (18.06)",
    provider: "MIT OpenCourseWare",
    description: "Легендарний курс лінійної алгебри професора Гілберта Стренга — один з найпопулярніших математичних курсів в Інтернеті.",
    longDescription: "Курс охоплює теорію матриць та лінійну алгебру з акцентом на практичне застосування. Теми: системи рівнянь, векторні простори, визначники, власні значення, сингулярний розклад та додатно визначені матриці.",
    category: "Data Science",
    subcategory: "Mathematics",
    language: "English",
    duration: "34 lectures",
    level: "Intermediate",
    format: "Video",
    certificate: false,
    url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011",
    tags: ["Math", "Linear Algebra", "MIT", "Matrices", "Eigenvalues"],
    rating: 4.9,
    students: 1200000,
    updatedAt: "2023-06",
    featured: false,
  },
  {
    slug: "prometheus-english",
    title: "Англійська мова для IT-спеціалістів",
    provider: "Prometheus",
    description: "Курс англійської для технічних спеціалістів — лексика, листування та профільна термінологія.",
    longDescription: "Цей курс створений спеціально для тих, хто працює або планує працювати в IT-галузі та хоче покращити свої навички англійської мови. Ви вивчите технічну лексику, навчитеся читати та писати технічну документацію, листуватися з іноземними колегами та брати участь у міжнародних командах.",
    category: "Languages",
    subcategory: "English",
    language: "Ukrainian",
    duration: "10 weeks",
    level: "Intermediate",
    format: "Video",
    certificate: true,
    url: "https://prometheus.org.ua",
    tags: ["English", "IT", "Language", "Ukrainian", "Business English"],
    rating: 4.6,
    students: 45000,
    updatedAt: "2023-09",
    featured: false,
    ukraineNote: "Безкоштовно для громадян України.",
  },
  {
    slug: "meta-frontend",
    title: "Meta Front-End Developer Professional Certificate",
    provider: "Coursera / Meta",
    description: "Розпочніть кар'єру фронтенд-розробника з офіційною програмою сертифікації від Meta.",
    longDescription: "Цей сертифікат від Meta підготує вас до роботи фронтенд-розробником початкового рівня. Ви вивчите React, HTML/CSS, JavaScript та UI-фреймворки. Програма завершується портфоліо-проектом, що демонструє ваші навички.",
    category: "Technology",
    subcategory: "Web Development",
    language: "English",
    duration: "7 months",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://coursera.org/professional-certificates/meta-front-end-developer",
    tags: ["React", "JavaScript", "HTML", "CSS", "Meta", "Frontend"],
    rating: 4.6,
    students: 210000,
    updatedAt: "2024-01",
    featured: false,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України.",
  },
  {
    slug: "khan-finance",
    title: "Personal Finance",
    provider: "Khan Academy",
    description: "Зрозумійте основи бюджетування, заощаджень, інвестування та фінансового планування для повсякденного життя.",
    longDescription: "Курс особистих фінансів від Khan Academy охоплює все: від складання щомісячного бюджету до розуміння складних відсотків, інвестування в акції та облігації та планування пенсії. Повністю безкоштовний — без реєстрації.",
    category: "Finance",
    subcategory: "Personal Finance",
    language: "English",
    duration: "Self-paced",
    level: "Beginner",
    format: "Interactive",
    certificate: false,
    url: "https://khanacademy.org/college-careers-more/personal-finance",
    tags: ["Finance", "Budgeting", "Investing", "Money", "Khan Academy"],
    rating: 4.5,
    students: 950000,
    updatedAt: "2023-08",
    featured: false,
  },
  {
    slug: "google-project-management",
    title: "Google Project Management Certificate",
    provider: "Coursera / Google",
    description: "Вивчіть основи управління проектами, методології та інструменти, які використовують PM-и в Google.",
    longDescription: "Цей шестикурсовий сертифікат від Google включає понад 140 годин навчання. Ви навчитеся створювати проектну документацію, управляти стейкхолдерами, складати бюджети, застосовувати Agile та Scrum. Понад 75% випускників відзначають кар'єрне зростання протягом шести місяців.",
    category: "Business",
    subcategory: "Project Management",
    language: "English",
    duration: "6 months",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://coursera.org/professional-certificates/google-project-management",
    tags: ["PM", "Agile", "Scrum", "Google", "Management"],
    rating: 4.8,
    students: 540000,
    updatedAt: "2024-01",
    featured: false,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України.",
  },
  {
    slug: "figma-design-basics",
    title: "Figma for Beginners",
    provider: "Figma / YouTube",
    description: "Офіційна серія туторіалів Figma для початківців: інтерфейсний дизайн, прототипування та командна робота.",
    longDescription: "Офіційна серія туторіалів Figma навчить вас основам векторного дизайну, auto-layout, компонентів, стилів та прототипування. Відео безкоштовні на YouTube та ідеально підходять для роботи у безкоштовному тарифі Figma.",
    category: "Design",
    subcategory: "UI Design",
    language: "English",
    duration: "4 hours",
    level: "Beginner",
    format: "Video",
    certificate: false,
    url: "https://youtube.com/c/Figma",
    tags: ["Figma", "UI", "Design", "Prototyping", "Free"],
    rating: 4.7,
    students: 350000,
    updatedAt: "2023-12",
    featured: false,
  },
  {
    slug: "hubspot-digital-marketing",
    title: "Digital Marketing Certification",
    provider: "HubSpot Academy",
    description: "Вивчіть стратегію цифрового маркетингу, SEO, соціальні мережі та контент-маркетинг від експертів HubSpot.",
    longDescription: "Сертифікація HubSpot Academy охоплює всі ключові компоненти цифрового маркетингу: SEO, контент-маркетинг, соціальні мережі, email-маркетинг та оптимізацію конверсій. Курс завершується іспитом і міжнародно визнаним сертифікатом для LinkedIn.",
    category: "Marketing",
    subcategory: "Digital Marketing",
    language: "English",
    duration: "4 hours",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://academy.hubspot.com/courses/digital-marketing",
    tags: ["Marketing", "SEO", "Social Media", "HubSpot", "Content"],
    rating: 4.5,
    students: 680000,
    updatedAt: "2023-10",
    featured: false,
  },
  {
    slug: "stanford-ml",
    title: "Machine Learning Specialization",
    provider: "Coursera / Stanford / DeepLearning.AI",
    description: "Оновлений курс ML від Ендрю Ина — найпопулярніша навчальна програма з машинного навчання у світі.",
    longDescription: "Спеціалізація з машинного навчання створена спільно DeepLearning.AI та Stanford Online. Ви вивчите основи ML та навчитеся будувати реальні AI-застосунки. Це оновлена версія знаменитого курсу Ендрю Ина.",
    category: "Data Science",
    subcategory: "Machine Learning",
    language: "English",
    duration: "3 months",
    level: "Intermediate",
    format: "Video",
    certificate: true,
    url: "https://coursera.org/specializations/machine-learning-introduction",
    tags: ["ML", "AI", "Python", "Stanford", "Andrew Ng", "Neural Networks"],
    rating: 4.9,
    students: 760000,
    updatedAt: "2023-12",
    featured: true,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України.",
  },
  {
    slug: "duolingo-german",
    title: "German Language Course",
    provider: "Duolingo",
    description: "Вивчіть німецьку з нуля з ігровими уроками Duolingo — корисно для українців у Німеччині.",
    longDescription: "Курс німецької мови Duolingo — один з найпопулярніших ресурсів для вивчення мов у світі. Від повного початківця до розмовного рівня через ігрові уроки, історії та подкасти. Особливо актуально для великої громади українців у Німеччині.",
    category: "Languages",
    subcategory: "German",
    language: "English",
    duration: "Self-paced",
    level: "Beginner",
    format: "Interactive",
    certificate: false,
    url: "https://duolingo.com/course/de/en/Learn-German",
    tags: ["German", "Language", "Duolingo", "Europe", "Diaspora"],
    rating: 4.5,
    students: 5000000,
    updatedAt: "2024-01",
    featured: false,
    ukraineNote: "Duolingo пропонує безкоштовний Super Duolingo для українців. Подайте заявку на duolingo.com/ukraine.",
  },
  {
    slug: "excel-for-everyone",
    title: "Excel Skills for Business",
    provider: "Coursera / Macquarie University",
    description: "Опануйте Microsoft Excel від початківця до просунутого рівня та станьте цінним спеціалістом у будь-якій бізнес-ролі.",
    longDescription: "У цій спеціалізації з чотирьох курсів ви опануєте Excel від базового до просунутого рівня: форматування таблиць, функції та формули, побудова діаграм, аналіз зведених таблиць та автоматизація за допомогою макросів.",
    category: "Business",
    subcategory: "Productivity",
    language: "English",
    duration: "4 months",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://coursera.org/specializations/excel",
    tags: ["Excel", "Spreadsheets", "Business", "Data", "Office"],
    rating: 4.8,
    students: 1100000,
    updatedAt: "2023-09",
    featured: false,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України.",
  },
  {
    slug: "prometheus-cyber",
    title: "Кібербезпека: основи",
    provider: "Prometheus",
    description: "Базовий курс з інформаційної безпеки: захист даних, основи криптографії та безпечна поведінка онлайн.",
    longDescription: "Курс познайомить вас із ключовими концепціями кібербезпеки: загрозами та вразливостями, захистом персональних даних, методами аутентифікації, основами криптографії та безпечною поведінкою в Інтернеті. Особливо актуальний в умовах підвищених кіберзагроз для України.",
    category: "Technology",
    subcategory: "Cybersecurity",
    language: "Ukrainian",
    duration: "6 weeks",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://prometheus.org.ua",
    tags: ["Cybersecurity", "Security", "Ukrainian", "Data Protection"],
    rating: 4.6,
    students: 32000,
    updatedAt: "2023-10",
    featured: false,
    ukraineNote: "Безкоштовно для всіх. Сертифікат після складання тестів.",
  },
  {
    slug: "mindshift-learning",
    title: "Mindshift: Break Through Obstacles to Learning",
    provider: "Coursera / McMaster University",
    description: "Відкрийте та застосуйте практичні техніки зміни мислення та покращення здатності до навчання.",
    longDescription: "Mindshift допоможе вам отримати максимум від власного навчального шляху. Курс досліджує нейронауку та когнітивну психологію: як вчитися ефективніше, боротися з прокрастинацією та впевнено підходити до складних предметів. Особливо корисний для тих, хто змінює кар'єру.",
    category: "Personal Development",
    subcategory: "Learning",
    language: "English",
    duration: "4 weeks",
    level: "Beginner",
    format: "Video",
    certificate: true,
    url: "https://coursera.org/learn/mindshift",
    tags: ["Learning", "Productivity", "Mindset", "Neuroscience", "Self-improvement"],
    rating: 4.7,
    students: 290000,
    updatedAt: "2023-07",
    featured: false,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України.",
  },
  {
    slug: "notion-productivity",
    title: "Notion Mastery",
    provider: "YouTube / Marie Poulin",
    description: "Побудуйте повноцінну систему особистої продуктивності в Notion: від управління завданнями до баз знань.",
    longDescription: "Notion Mastery — безкоштовна серія YouTube від Marie Poulin про побудову повної операційної системи в Notion. Навчіться створювати бази даних, шаблони, пов'язані представлення та автоматизовані робочі процеси. Ідеально для фрілансерів та тих, хто працює віддалено.",
    category: "Personal Development",
    subcategory: "Productivity",
    language: "English",
    duration: "10 hours",
    level: "Beginner",
    format: "Video",
    certificate: false,
    url: "https://youtube.com/@MariePoulin",
    tags: ["Notion", "Productivity", "PKM", "Organization", "Remote Work"],
    rating: 4.6,
    students: 120000,
    updatedAt: "2023-11",
    featured: false,
  },
  {
    slug: "aws-cloud-practitioner",
    title: "AWS Cloud Practitioner Essentials",
    provider: "AWS / Coursera",
    description: "Зрозумійте основні сервіси AWS, хмарні концепції, безпеку та ціноутворення — підготовка до сертифікації CLF-C02.",
    longDescription: "Курс для тих, хто хоче отримати загальне розуміння хмари Amazon Web Services. Ви вивчите концепції AWS, сервіси, безпеку, архітектуру та підтримку. Перший крок до сертифікації AWS Certified Cloud Practitioner.",
    category: "Technology",
    subcategory: "Cloud Computing",
    language: "English",
    duration: "6 hours",
    level: "Beginner",
    format: "Video",
    certificate: false,
    url: "https://coursera.org/learn/aws-cloud-practitioner-essentials",
    tags: ["AWS", "Cloud", "DevOps", "Amazon", "Certification"],
    rating: 4.7,
    students: 430000,
    updatedAt: "2023-12",
    featured: false,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України.",
  },
  {
    slug: "coursera-writing",
    title: "Writing in English at University",
    provider: "Coursera / Lund University",
    description: "Опануйте академічне письмо англійською — від побудови аргументів до оформлення джерел — для університету та роботи.",
    longDescription: "Курс надає інструменти для впевненого спілкування англійською в академічному середовищі: есе, дипломні роботи, листи та звіти. Ви розвинете розуміння процесу письма та структури чіткої аргументації. Ідеально для студентів та фахівців, для яких англійська є другою мовою.",
    category: "Languages",
    subcategory: "Academic English",
    language: "English",
    duration: "5 weeks",
    level: "Intermediate",
    format: "Mixed",
    certificate: true,
    url: "https://coursera.org/learn/writing-english-university",
    tags: ["Writing", "English", "Academic", "University", "Communication"],
    rating: 4.5,
    students: 180000,
    updatedAt: "2023-08",
    featured: false,
    ukraineNote: "Безкоштовно через програму доступу Coursera для України.",
  },
];

// ── Scraped courses ───────────────────────────────────────────────────────────
// Loaded from data/scraped-courses.json (produced by `npm run scrape`).
// Only courses with review_status === "approved" are included.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scrapedCourses: Course[] = (scrapedData.courses as any[])
  .filter((c) => c.review_status === "approved")
  .map((c) => ({
    slug: c.slug,
    title: c.title,
    provider: c.provider,
    providerLogo: c.image ?? undefined,
    description: c.description,
    longDescription: c.longDescription,
    category: c.category,
    subcategory: c.subcategory,
    language: c.language,
    duration: c.duration,
    level: c.level as Course["level"],
    format: c.format as Course["format"],
    certificate: c.certificate,
    url: c.url,
    tags: c.tags,
    rating: c.rating ?? 0,
    students: c.students ?? 0,
    updatedAt: c.updatedAt,
    featured: false,
    ukraineNote:
      c.source === "prometheus"
        ? "Безкоштовно для всіх. Платформа Prometheus — найбільший безкоштовний MOOC в Україні."
        : c.source === "diia"
        ? "Безкоштовно для всіх. Державна платформа цифрової грамотності — Дія.Освіта."
        : c.source === "eduhub"
        ? "Безкоштовно для всіх. EduHub — безкоштовна освітня платформа для громадян України."
        : c.source === "vumonline"
        ? "Безкоштовно для всіх. VUM Online — Відкритий університет Майдану, безкоштовні онлайн-курси."
        : c.source === "ed-era"
        ? "Безкоштовно для всіх. EdEra — українська платформа онлайн-освіти."
        : undefined,
  }));

// Merge: hardcoded first (curated), scraped second.
// Dedup by URL so re-running the scraper never creates duplicates.
const seenUrls = new Set(hardcodedCourses.map((c) => c.url));
const uniqueScraped = scrapedCourses.filter((c) => !seenUrls.has(c.url));

export const courses: Course[] = [...hardcodedCourses, ...uniqueScraped].filter(
  (c) => c.language !== "English"
);

export const HOURS_MAX = 300;

export const PROVIDERS: string[] = Array.from(
  new Set(courses.map((c) => c.provider))
).sort((a, b) => a.localeCompare(b, "uk"));

export function toHoursNum(duration: string): number | null {
  const lower = duration.toLowerCase().trim();
  const n = parseFloat(lower);
  if (lower.includes("hour")) return n;
  if (lower.includes("month")) return Math.round(n * 20);
  if (lower.includes("week")) return Math.round(n * 5);
  if (lower.includes("lecture")) return Math.round(n * 0.75);
  return null; // self-paced
}

export const CATEGORY_LABELS: Record<string, string> = {
  Technology: "Технології",
  Business: "Бізнес",
  Design: "Дизайн",
  Languages: "Мови",
  "Data Science": "Наука про дані",
  Marketing: "Маркетинг",
  Finance: "Фінанси",
  "Personal Development": "Особистий розвиток",
  Cybersecurity: "Кібербезпека",
  Engineering: "Інженерія",
  Healthcare: "Охорона здоров'я",
  Law: "Право",
  Psychology: "Психологія",
  HR: "Управління персоналом",
  Sales: "Продажі",
  Education: "Педагогіка",
  Architecture: "Архітектура",
  Science: "Природничі науки",
  Media: "Медіа та журналістика",
  Art: "Мистецтво",
};

export const LEVEL_LABELS: Record<string, string> = {
  Beginner: "Початківець",
  Intermediate: "Середній",
  Advanced: "Просунутий",
};

export const FORMAT_LABELS: Record<string, string> = {
  Video: "Відео",
  Text: "Текст",
  Interactive: "Інтерактивний",
  Mixed: "Змішаний",
};

export const LANGUAGE_LABELS: Record<string, string> = {
  English: "Англійська",
  Ukrainian: "Українська",
  Polish: "Польська",
  German: "Німецька",
  French: "Французька",
};

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getFeaturedCourses(): Course[] {
  return courses.filter((c) => c.featured);
}

export function searchCourses(query: string, filters: {
  category?: string;
  language?: string;
  level?: string;
  provider?: string;
  hoursMin?: number;
  hoursMax?: number;
}): Course[] {
  let results = [...courses];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.provider.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    results = results.filter((c) => c.category === filters.category);
  }
  if (filters.language) {
    results = results.filter((c) => c.language === filters.language);
  }
  if (filters.level) {
    results = results.filter((c) => c.level === filters.level);
  }
  if (filters.provider) {
    results = results.filter((c) => c.provider === filters.provider);
  }
  if (filters.hoursMin !== undefined || filters.hoursMax !== undefined) {
    const min = filters.hoursMin ?? 0;
    const max = filters.hoursMax ?? HOURS_MAX;
    results = results.filter((c) => {
      const h = toHoursNum(c.duration);
      if (h === null) return true; // always include self-paced
      return h >= min && h <= max;
    });
  }

  return results.sort((a, b) => b.rating - a.rating);
}
