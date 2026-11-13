import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GUIDE_ARTICLES, getGuideBySlug } from '@/lib/guides-data';
import { GuideArticleView } from '@/components/GuideArticleView';

interface GuideDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map(article => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  if (!article) {
    return {
      title: 'الدليل غير موجود',
    };
  }

  return {
    title: article.titleAr,
    description: article.excerptAr,
    keywords: [article.categoryAr, article.categoryEn, 'مداد', 'midadd', 'Word', 'Markdown'],
    alternates: {
      canonical: `https://midadd.com/guides/${article.slug}`,
    },
    openGraph: {
      title: article.titleAr,
      description: article.excerptAr,
      type: 'article',
      publishedTime: article.publishedAt,
      url: `https://midadd.com/guides/${article.slug}`,
    },
  };
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const article = getGuideBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.titleAr,
    description: article.excerptAr,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.authorAr,
    },
    publisher: {
      '@type': 'Organization',
      name: 'مداد | midadd',
      url: 'https://midadd.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <GuideArticleView article={article} />
    </>
  );
}
