export interface GuideSection {
  id: string;
  headingAr: string;
  headingEn: string;
  paragraphsAr: string[];
  paragraphsEn: string[];
  codeExample?: string;
  bulletsAr?: string[];
  bulletsEn?: string[];
}

export interface GuideArticle {
  slug: string;
  categoryId: 'formatting' | 'math' | 'arabic-rtl';
  categoryAr: string;
  categoryEn: string;
  publishedAt: string;
  readingMinutes: number;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  authorAr: string;
  authorEn: string;
  sections: GuideSection[];
}

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: 'ai-markdown-to-word-guide',
    categoryId: 'formatting',
    categoryAr: 'إنتاجية المستندات',
    categoryEn: 'Document Workflows',
    publishedAt: '2026-10-18',
    readingMinutes: 6,
    titleAr: 'الدليل الشامل لتحويل نصوص ChatGPT وClaude وGemini إلى مستندات Word احترافية',
    titleEn: 'Complete Guide to Converting ChatGPT, Claude & Gemini Markdown into Word Documents',
    excerptAr:
      'تعرف على الأسباب التقنية لتشوه التنسيق عند النسخ المباشر من نماذج الذكاء الاصطناعي، وكيفية تصدير تقارير متكاملة مع العناوين والجداول والأكواد بضغطة زر.',
    excerptEn:
      'Learn why direct copy-pasting from AI assistants breaks formatting in Microsoft Word, and how to export clean reports with headings, tables, and code blocks.',
    authorAr: 'فريق التحرير التقني — مداد',
    authorEn: 'midadd Editorial Team',
    sections: [
      {
        id: 'why-copy-breaks',
        headingAr: '1. لماذا يتشوه التنسيق عند النسخ المباشر من نصوص الذكاء الاصطناعي؟',
        headingEn: '1. Why Direct Copy-Paste Breaks Document Layout',
        paragraphsAr: [
          'تعتمد معظم نماذج الذكاء الاصطناعي الحديثة مثل ChatGPT وClaude وGemini على صيغة Markdown لتنظيم المخرجات؛ وهي لغة توصيف نصية تستخدم علامات مثل (#) للعناوين و(**) للخط العريض و(|) لبناء الجداول. وعندما يقوم المستخدم بتحديد النص من المتصفح ولصقه مباشرة في Microsoft Word، ينسخ المتصفح أنماط HTML الخاصة بواجهة الدردشة نفسها، مثل ألوان الخلفية الداكنة، وإطارات الكود غير المتوافقة، وخطوط الويب الغريبة.',
          'الأهم من ذلك هو فقدان البنية الدلالية للمستند (Document Hierarchy)؛ فبدلاً من إنشاء أنماط عناوين حقيقية (Heading 1, Heading 2) يمكن الاعتماد عليها لتوليد فهرس المحتويات، تتحول العناوين إلى نصوص عادية مكبرة يدوياً. كما تفقد الجداول حدودها الواضحة وتلتف الأعمدة بطريقة تجعل التقرير غير صالح للطباعة أو التسليم الأكاديمي.',
        ],
        paragraphsEn: [
          'Modern AI assistants output responses structured in Markdown—using # for headings, ** for bold emphasis, and pipe syntax for tables. Copying directly from a browser chat window carries over web-specific CSS classes, dark backgrounds, and incompatible inline styles into Word.',
          'Even worse, semantic hierarchy is often lost: headings become manually enlarged paragraphs rather than native Heading 1/2 styles, breaking automatic tables of contents and print pagination.',
        ],
      },
      {
        id: 'clean-workflow',
        headingAr: '2. الخطوات العملية لتجهيز مستند Word متكامل من مخرجات الذكاء الاصطناعي',
        headingEn: '2. Practical Workflow for Clean AI-to-DOCX Exports',
        paragraphsAr: [
          'للحصول على ملف (.docx) جاهز للطباعة والتعديل دون الحاجة لإعادة التنسيق يدوياً، يُنصح بنسخ النص بصيغة Markdown الخام باستخدام زر النسخ المخصص في أسفل رد الذكاء الاصطناعي، ثم تمريره عبر محرك تحويل هيكلي يفصل بين البنية النصية والطبقة الشكلية.',
        ],
        paragraphsEn: [
          'Instead of highlighting rendered chat bubbles, always use the dedicated Copy button at the bottom of the AI message to capture raw Markdown, then pass it through a dedicated OOXML structure builder.',
        ],
        bulletsAr: [
          'استخدم زر النسخ الخام للمحادثة بدلاً من التحديد اليدوي بالفأرة للحفاظ على علامات الجداول والمعادلات.',
          'تأكد من مطابقة مستويات العناوين (#، ##، ###) لتظهر تلقائياً في جزء التنقل داخل Microsoft Word.',
          'حدد اتجاه المستند الأساسي (RTL للعربية أو LTR للإنجليزية) قبل التصدير لضبط محاذاة الترقيم والقوائم.',
          'راجع الهوامش وحجم الورق (A4 أو Letter) من شريط التخطيط لضمان تطابق المعاينة مع الطباعة.',
        ],
        bulletsEn: [
          'Copy raw Markdown via the assistant copy icon to preserve table delimiters and math blocks.',
          'Use consistent heading levels (#, ##, ###) so Word builds the Navigation Pane automatically.',
          'Set the base direction (RTL for Arabic, LTR for English) before export to align lists and numbering.',
          'Configure A4 margins and line spacing from the Layout Ribbon before saving as DOCX or PDF.',
        ],
      },
      {
        id: 'code-example',
        headingAr: '3. مثال عملي على بنية Markdown القياسية الصالحة للتصدير',
        headingEn: '3. Example of Clean Export-Ready Markdown Structure',
        paragraphsAr: [
          'يوضح المثال التالي كيف يمكنك تنظيم التقرير باستخدام Markdown قياسي ليتم تحويله إلى مستند Word يحتوي على عنوان رئيسي، قائمة مرقمة، وجدول بيانات منسق بحدود واضحة:',
        ],
        paragraphsEn: [
          'The snippet below demonstrates how clean Markdown converts directly into structured Word headings, lists, and bordered tables:',
        ],
        codeExample: `# التقرير الفصلي للأداء التقني\n\n## ملخص النتائج الرئيسية\n- تحسن سرعة الاستجابة بنسبة **34%** خلال الربع الثالث.\n- تقليص أخطاء المعالجة الطرفية إلى أقل من \`0.2%\`.\n\n| المؤشر | الربع الثاني | الربع الثالث |\n| :--- | :--- | :--- |\n| زمن المعالجة | 420ms | 275ms |\n| رضا المستخدمين | 91% | 97% |`,
      },
    ],
  },
  {
    slug: 'latex-omml-arabic-research-guide',
    categoryId: 'math',
    categoryAr: 'البحث العلمي والمعادلات',
    categoryEn: 'Academic & Math',
    publishedAt: '2026-10-25',
    readingMinutes: 7,
    titleAr: 'تحويل معادلات LaTeX إلى معادلات Word الأصلية (OMML) في الأبحاث العربية',
    titleEn: 'Converting LaTeX Equations into Native Editable Word Math (OMML)',
    excerptAr:
      'لماذا تفشل الطريقة التقليدية بلصق المعادلات كصور؟ وكيف يحول محرك OMML رموز التكامل والكسور والمصفوفات إلى معادلات قابلة للتعديل داخل Word.',
    excerptEn:
      'Why pasting equations as screenshots hurts academic papers, and how LaTeX-to-OMML conversion creates crisp, editable native Word math elements.',
    authorAr: 'د. سارة العتيبي — مستشارة النشر الأكاديمي',
    authorEn: 'Dr. Sara Al-Otaibi — Academic Publishing Advisor',
    sections: [
      {
        id: 'what-is-omml',
        headingAr: '1. الفرق بين الصور الثابتة ومعادلات Word الأصلية (OMML)',
        headingEn: '1. Static Screenshots vs. Native Office Math (OMML)',
        paragraphsAr: [
          'عندما يطلب الباحثون والطلاب من نماذج الذكاء الاصطناعي كتابة اشتقاقات رياضية أو معادلات فيزيائية، يتم توليد المعادلات بصيغة LaTeX محاطة بعلامات الدولار ($ أو $$). عند استخدام محولات بدائية، تُحوَّل هذه المعادلات إلى صور PNG منخفضة الدقة، مما يؤدي إلى تشوشها عند التكبير أو الطباعة، فضلاً عن استحالة تعديل رقم أو متغير داخل ملف Word لاحقاً.',
          'في المقابل، يعتمد معيار Microsoft Word (.docx) على لغة توصيف رياضية قياسية تُسمى Office Math Markup Language (OMML). عند تحويل معادلة LaTeX إلى عقد OMML حقيقية، يتعامل برنامج Word مع المعادلة ككائن رياضي أصيل يمكنك النقر عليه وتعديله باستخدام تبويب Equation مباشرة.',
        ],
        paragraphsEn: [
          'AI assistants emit mathematics using LaTeX syntax wrapped in $ or $$ delimiters. Basic converters rasterize formulas into low-DPI images that pixelate in print and cannot be edited by reviewers.',
          'Microsoft Word natively uses Office Math Markup Language (OMML). Converting LaTeX directly into OMML nodes turns every fraction, integral, and matrix into a first-class Word equation object.',
        ],
      },
      {
        id: 'inline-vs-block',
        headingAr: '2. قواعد كتابة المعادلات السطرية والمعادلات المستقلة',
        headingEn: '2. Best Practices for Inline vs. Display Equations',
        paragraphsAr: [
          'لضمان أقصى دقة في التحويل، يجب التمييز بين نوعين من الصيغ الرياضية داخل نصوص Markdown: الصيغ السطرية التي تندمج داخل الجملة العربية، والمعادلات المستقلة التي تتوسط السطر.',
        ],
        paragraphsEn: [
          'To ensure clean rendering, distinguish between inline notation embedded within prose and standalone display blocks centered on their own line.',
        ],
        bulletsAr: [
          'استخدم علامة دولار واحدة ($E = mc^2$) للمتغيرات والرموز المدمجة وسط الفقرة.',
          'استخدم علامتي دولار ($$ ... $$) في سطر مستقل للمعادلات الطويلة والكسور والمصفوفات.',
          'تجنب وضع نصوص عربية طويلة داخل أقواس \\text{} دون الحاجة؛ الأفضل فصل الشرح اللفظي في الفقرة.',
          'احرص على توازن الأقواس المعقوفة {} في أوامر الكسور \\frac{numerator}{denominator} والجذور \\sqrt{x}.',
        ],
        bulletsEn: [
          'Use single dollar signs ($E = mc^2$) for inline variables inside paragraphs.',
          'Use double dollar blocks ($$ ... $$) on separate lines for complex fractions, integrals, and matrices.',
          'Keep prose explanations outside math delimiters so bidirectional text wraps naturally.',
          'Verify matching curly braces in \\frac{a}{b} and \\sqrt{x} expressions.',
        ],
        codeExample: `$$\\int_{0}^{\\infty} e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}$$`,
      },
      {
        id: 'arabic-papers-tips',
        headingAr: '3. نصائح تنسيق الأبحاث العلمية والرسائل الجامعية باللغة العربية',
        headingEn: '3. Formatting Arabic Theses and Technical Papers',
        paragraphsAr: [
          'في الأبحاث المكتوبة بالعربية، تبقى الرموز الرياضية القياسية بحروفها اللاتينية ومن اليسار إلى اليمين حتى داخل فقرة عربية RTL. لذلك من المهم أن يظل كائن المعادلة محمياً بوسم اتجاه LTR مستقل حتى لا تنعكس حدود التكامل أو ترتيب البسط والمقام عند التصدير.',
        ],
        paragraphsEn: [
          'Even in Arabic RTL manuscripts, international mathematical expressions read left-to-right. Isolating OMML blocks in LTR direction prevents subscripts and fraction layouts from flipping.',
        ],
      },
    ],
  },
  {
    slug: 'fixing-arabic-rtl-tables-word-guide',
    categoryId: 'arabic-rtl',
    categoryAr: 'دعم العربية والـ RTL',
    categoryEn: 'Arabic & RTL Typography',
    publishedAt: '2026-11-02',
    readingMinutes: 5,
    titleAr: 'حل مشاكل اتجاه النص العربي (RTL) والجداول المنسوخة في Word وGoogle Docs',
    titleEn: 'Fixing Arabic RTL Alignment and Mixed-Direction Tables in Word & Google Docs',
    excerptAr:
      'معالجة جذرية لمشاكل انعكاس الترقيم، تداخل النصوص العربية والإنجليزية (Bidi)، وتنسيق خلايا الجداول في التقارير الإدارية والضريبية.',
    excerptEn:
      'Solve flipped punctuation, bidirectional Arabic/English text overlap, and broken table columns in business reports and official documents.',
    authorAr: 'م. طارق المنصور — مهندس تنسيق النصوص ثنائية الاتجاه',
    authorEn: 'Tariq Al-Mansour — Bidirectional Typography Engineer',
    sections: [
      {
        id: 'bidi-challenges',
        headingAr: '1. لماذا تنعكس علامات الترقيم والأقواس في النصوص ثنائية الاتجاه؟',
        headingEn: '1. Why Punctuation and Parentheses Flip in Mixed Arabic/English Text',
        paragraphsAr: [
          'من أكثر المشكلات شيوعاً في التقارير العربية المعاصرة ورود مصطلحات إنجليزية أو أرقام وإيميلات وسط الجملة العربية. إذا كانت الفقرة مضبوطة على اتجاه LTR الافتراضي رغم محاذاتها لليمين، فإن علامة النقطة أو الفاصلة تقفز إلى بداية السطر بدلاً من نهايته، وتنعكس الأقواس بشكل مشوه.',
          'يكمن الحل الحقيقي في تطبيق خاصية اتجاه الفقرة المنطقي (bidi / dir="rtl") على مستوى بنية الـ XML داخل ملف Word، وليس الاكتفاء بمحاذاة النص يميناً (align-right). فالمحاذاة تتحكم في موقع السطر فقط، بينما الاتجاه المنطقي يتحكم في ترتيب الكلمات وعلامات الترقيم والقوائم المرقمة.',
        ],
        paragraphsEn: [
          'Modern Arabic reports frequently mix Latin acronyms, code identifiers, and numbers inside Arabic sentences. Applying right alignment alone on an LTR paragraph causes periods and parentheses to jump to the wrong side.',
          'The true fix sets logical bidirectional direction (w:bidi in OOXML) on paragraphs and table rows—not just visual right alignment.',
        ],
      },
      {
        id: 'tables-in-arabic',
        headingAr: '2. ضبط اتجاه الجداول وترتيب الأعمدة في التقارير العربية',
        headingEn: '2. Configuring RTL Table Column Flow and Cell Padding',
        paragraphsAr: [
          'عند إنشاء جدول مقارنة أو تقرير مالي باللغة العربية، يجب أن يبدأ العمود الأول (مثل "البند" أو "التاريخ") من الجهة اليمنى، ويتجه التسلسل نحو اليسار. تتيح خصائص الجداول الثنائية (bidiVisual) في مستندات Word قلب ترتيب الأعمدة تلقائياً مع الحفاظ على محاذاة الأرقام المالية لسهولة القراءة.',
        ],
        paragraphsEn: [
          'In Arabic financial or comparative tables, the primary label column should anchor on the right edge and flow leftward. Enabling bidiVisual table semantics in Word ensures columns align naturally for Arabic readers.',
        ],
        bulletsAr: [
          'اختر خطوطاً عربية واضحة ومصممة للطباعة مثل Cairo أو Amiri أو Segoe UI.',
          'استخدم تباعد أسطر مريح (1.15 إلى 1.5) لتفادي تداخل التشكيل والحروف السفلية.',
          'فعّل الحدود الكاملة والهوامش الداخلية (Cell Padding) لمنع التصاق النص بحدود الخلية.',
          'تأكد من اختبار زر "نسخ لـ Google Docs" عند الرغبة في المتابعة السحابية دون فقدان حدود الجداول.',
        ],
        bulletsEn: [
          'Pair Arabic headings with legible fonts such as Cairo, Amiri, or Segoe UI.',
          'Use 1.15–1.5 line height to give Arabic diacritics and descenders clean breathing room.',
          'Add consistent cell padding and hairline table borders for executive readability.',
          'Use the dedicated Copy for Google Docs helper to preserve table borders in cloud documents.',
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDE_ARTICLES.find(article => article.slug === slug);
}

export function filterGuidesByCategory(
  categoryId: 'all' | GuideArticle['categoryId'],
  searchQuery = ''
): GuideArticle[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return GUIDE_ARTICLES.filter(article => {
    const matchesCategory = categoryId === 'all' || article.categoryId === categoryId;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      article.titleAr.toLowerCase().includes(normalizedQuery) ||
      article.titleEn.toLowerCase().includes(normalizedQuery) ||
      article.excerptAr.toLowerCase().includes(normalizedQuery) ||
      article.excerptEn.toLowerCase().includes(normalizedQuery)
    );
  });
}
