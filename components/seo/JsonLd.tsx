// components/seo/JsonLd.tsx
// Structured data (Schema.org) — Google rich results uchun.
// Bu komponentni marketing layout yoki HomeView ichiga joylang.

const SITE_URL = "https://edumrx.uz";

export function OrganizationJsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "EduMRX",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description:
            "O'quv markazlari uchun zamonaviy CRM va boshqaruv tizimi.",
        sameAs: [
            "https://t.me/edumrx",
            "https://instagram.com/edumrx",
            // o'zingizning ijtimoiy tarmoq linklaringiz
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            availableLanguage: ["Uzbek", "Russian", "English"],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function SoftwareApplicationJsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "EduMRX",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "UZS",
            description: "Bepul sinov mavjud",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "120",
        },
        description:
            "O'quv markazlari uchun to'liq boshqaruv tizimi: qabul, davomat, baholar, to'lovlar va hisobotlar.",
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function WebSiteJsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "EduMRX",
        url: SITE_URL,
        inLanguage: ["uz", "ru", "en"],
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// FAQ structured data — agar FAQ bo'limingiz bo'lsa
export function FaqJsonLd({
    faqs,
}: {
    faqs: { question: string; answer: string }[];
}) {
    const data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}