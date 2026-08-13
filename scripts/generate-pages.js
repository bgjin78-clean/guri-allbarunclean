const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "data/regions.json"), "utf8"));
const imageData = JSON.parse(fs.readFileSync(path.join(__dirname, "data/images.json"), "utf8"));
const pageContent = require("./data/page-content");
const { city, brandName, phone, siteUrl, districts } = data;
const { pageSets, schema, schemaBase, ogImage } = imageData;

function relPrefix(depth) {
  return depth === 0 ? "" : "../".repeat(depth);
}

function jsonLd(obj) {
  return JSON.stringify(obj, null, 2);
}

function businessSchema(canonical, placeName) {
  const services = Object.values(schema);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brandName,
    url: canonical,
    telephone: phone,
    image: services.map((s) => `${siteUrl}${schemaBase}/${s.file}`),
    description: `${placeName} 유품정리, 쓰레기집청소, 고독사청소, 특수청소, 폐기물처리 전문 상담`,
    areaServed: {
      "@type": "AdministrativeArea",
      name: placeName
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "구리시",
      addressRegion: "경기도",
      addressCountry: "KR"
    },
    sameAs: [
      "https://www.allbarunclean.com/",
      "https://yupum.allbarunclean.com/regions/guri/",
      "https://waste.allbarunclean.com/gyeonggi/guri.html"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${brandName} 서비스`,
      itemListElement: services.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.name,
          areaServed: placeName,
          provider: { "@type": "LocalBusiness", "name": brandName },
          image: `${siteUrl}${schemaBase}/${s.file}`
        }
      }))
    }
  };
}

function faqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  };
}

function breadcrumbSchema(parts) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: parts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      item: p.item
    }))
  };
}

function webPageSchema(canonical, title, description, placeName) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: canonical,
    description,
    inLanguage: "ko-KR",
    about: [
      { "@type": "Thing", name: `${placeName} 유품정리` },
      { "@type": "Thing", name: `${placeName} 쓰레기집청소` }
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".hero p", ".seo-article", ".faq"]
    },
    isPartOf: {
      "@type": "WebSite",
      name: brandName,
      url: `${siteUrl}/`
    }
  };
}

function relatedCards() {
  return `
        <a href="https://www.allbarunclean.com/" class="related-card" target="_blank" rel="noopener">
          <h3>올바른수거</h3>
          <p>서울·경기 전 지역 유품정리·폐기물처리 종합 안내</p>
          <span>allbarunclean.com →</span>
        </a>
        <a href="https://yupum.allbarunclean.com/regions/guri/" class="related-card" target="_blank" rel="noopener">
          <h3>경기 올바른유품</h3>
          <p>구리시 유품정리, 고독사청소, 특수청소 안내</p>
          <span>yupum.allbarunclean.com →</span>
        </a>
        <a href="https://waste.allbarunclean.com/gyeonggi/guri.html" class="related-card" target="_blank" rel="noopener">
          <h3>경기 올바른폐기물</h3>
          <p>구리시 쓰레기집청소, 빈집정리, 가정·이사폐기물</p>
          <span>waste.allbarunclean.com →</span>
        </a>
        <a href="https://namyangju.allbarunclean.com/" class="related-card" target="_blank" rel="noopener">
          <h3>남양주 올바른정리</h3>
          <p>다산·별내와 맞닿은 남양주 유품정리·폐기물처리</p>
          <span>namyangju.allbarunclean.com →</span>
        </a>
        <a href="https://uijeongbu.allbarunclean.com/" class="related-card" target="_blank" rel="noopener">
          <h3>의정부 올바른정리</h3>
          <p>의정부시 민락·호원·녹양 유품정리·폐기물처리</p>
          <span>uijeongbu.allbarunclean.com →</span>
        </a>
        <a href="https://pocheon.allbarunclean.com/" class="related-card" target="_blank" rel="noopener">
          <h3>포천 올바른정리</h3>
          <p>포천시 소흘·포천동·면 지역 유품정리·폐기물처리</p>
          <span>pocheon.allbarunclean.com →</span>
        </a>`;
}

function areaLinksHtml(pageDepth, currentGu, currentDong) {
  const toRegions = pageDepth === 3 ? "../../" : "../";
  let html = '<div class="area-grid">';
  for (const gu of districts) {
    const guPath = `${toRegions}${gu.slug}/`;
    const isCurrentGu = gu.slug === currentGu;
    html += `<div class="area-card"><h3>${gu.name}</h3><div class="chips">`;
    html += `<a href="${guPath}"${isCurrentGu && !currentDong ? ' aria-current="page"' : ""}>${gu.name} 전체</a>`;
    for (const dong of gu.dongs) {
      const dongPath = `${toRegions}${gu.slug}/${dong.slug}/`;
      const isCurrent = isCurrentGu && dong.slug === currentDong;
      html += `<a href="${dongPath}"${isCurrent ? ' aria-current="page"' : ""}>${dong.name}</a>`;
    }
    html += "</div></div>";
  }
  html += "</div>";
  return html;
}

function faqHtml(faq) {
  return faq.map((item) => `
        <article class="faq">
          <strong>${item.q}</strong>
          <p>${item.a}</p>
        </article>`).join("");
}

function buildPage({ placeName, isSubRegion, parentGu, guSlug, dongSlug, depth, mainSet, contentKey }) {
  const copy = pageContent[contentKey];
  if (!copy) throw new Error("Missing page content: " + contentKey);

  const prefix = relPrefix(depth);
  const imgBase = `${prefix}images/main/`;
  const fullPlace = `${city} ${placeName}`;
  const canonicalPath = isSubRegion
    ? `regions/${guSlug}/${dongSlug}/`
    : `regions/${guSlug}/`;
  const canonical = `${siteUrl}/${canonicalPath}`;
  const iconPath = `${prefix}images/favicon.png`;

  let breadcrumb = `<div class="breadcrumb"><a href="${prefix}">${brandName}</a>`;
  const crumbParts = [
    { name: brandName, item: `${siteUrl}/` }
  ];
  if (isSubRegion) {
    breadcrumb += ` › <a href="${prefix}regions/${guSlug}/">${parentGu}</a> › ${placeName}`;
    crumbParts.push({ name: parentGu, item: `${siteUrl}/regions/${guSlug}/` });
    crumbParts.push({ name: placeName, item: canonical });
  } else {
    breadcrumb += ` › ${placeName}`;
    crumbParts.push({ name: placeName, item: canonical });
  }
  breadcrumb += "</div>";

  const serviceOptions = [
    `${fullPlace} 유품정리`,
    `${fullPlace} 쓰레기집청소`,
    `${fullPlace} 고독사청소`,
    `${fullPlace} 특수청소`,
    `${fullPlace} 빈집정리`,
    `${fullPlace} 가정폐기물처리`,
    `${fullPlace} 이사폐기물처리`,
    `${fullPlace} 폐업폐기물처리`
  ].map((s) => `<option value="${s}">${s}</option>`).join("\n            ");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${copy.title}</title>
  <meta name="description" content="${copy.description}" />
  <meta name="keywords" content="${copy.keywords}" />
  <meta name="robots" content="index,follow,max-image-preview:large" />
  <meta property="og:title" content="${copy.title}" />
  <meta property="og:description" content="${copy.ogDescription}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${siteUrl}${ogImage}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" href="${iconPath}" />
  <link rel="apple-touch-icon" href="${iconPath}" />
  <link rel="stylesheet" href="${prefix}assets/css/style.css" />
  <script type="application/ld+json">
  ${jsonLd(businessSchema(canonical, fullPlace))}
  </script>
  <script type="application/ld+json">
  ${jsonLd(faqSchema(copy.faq))}
  </script>
  <script type="application/ld+json">
  ${jsonLd(breadcrumbSchema(crumbParts))}
  </script>
  <script type="application/ld+json">
  ${jsonLd(webPageSchema(canonical, copy.title, copy.description, fullPlace))}
  </script>
</head>
<body>

<header>
  <div class="nav">
    <a href="${prefix}" class="logo">${brandName}</a>
    <nav class="nav-links">
      <a href="#service">서비스</a>
      <a href="#pricing">비용안내</a>
      <a href="#seo">정보안내</a>
      <a href="#faq">질문답변</a>
      <a href="#reviews">작업후기</a>
      <a href="#contact">상담접수</a>
    </nav>
    <a href="tel:01043932414" class="call-btn">전화 ${phone}</a>
  </div>
</header>

${breadcrumb}

<main>
  <section class="hero">
    <div class="hero-inner">
      <span class="badge">${copy.badge}</span>
      <h1>${copy.h1Html}</h1>
      <p>${copy.hero}</p>
      <div class="hero-actions">
        <a href="#contact" class="btn btn-primary">상담 접수하기</a>
        <a href="tel:01043932414" class="btn btn-outline">전화 상담 ${phone}</a>
      </div>
    </div>
  </section>

  <section id="service">
    <div class="wrap">
      <div class="title">
        <span>SERVICE</span>
        <h2>${fullPlace}에서 맡기는 작업</h2>
        <p>${copy.serviceLead}</p>
      </div>
      <div class="service-grid">
        <div class="service-card">
          <small>유품정리</small>
          <h3>${copy.yupumTitle}</h3>
          <p>${copy.yupumBody}</p>
          <div class="tags">
            <span>유품정리</span><span>고독사청소</span><span>특수청소</span>
          </div>
        </div>
        <div class="service-card">
          <small>쓰레기집청소</small>
          <h3>${copy.wasteTitle}</h3>
          <p>${copy.wasteBody}</p>
          <div class="tags">
            <span>쓰레기집청소</span><span>빈집정리</span><span>이사폐기물</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="pricing" id="pricing">
    <div class="wrap">
      <div class="title">
        <span>PRICE</span>
        <h2>${placeName} 비용이 달라지는 지점</h2>
        <p>${copy.priceNote}</p>
      </div>
      <div class="price-note">* 부가세 별도 · 시작가이며 현장 확인 후 확정</div>
      <div class="price-grid">
        <div class="price-card">
          <strong>유품정리</strong>
          <div class="price">45만원 <span>부터~</span></div>
          <p>${copy.priceYupum}</p>
        </div>
        <div class="price-card">
          <strong>고독사 특수청소</strong>
          <div class="price">80만원 <span>부터~</span></div>
          <p>${copy.priceSpecial}</p>
        </div>
        <div class="price-card">
          <strong>쓰레기집·일반폐기물</strong>
          <div class="price">30만원 <span>부터~</span></div>
          <p>${copy.priceWaste}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="seo">
    <div class="wrap">
      <div class="title">
        <span>GUIDE</span>
        <h2>${copy.guideTitle}</h2>
        <p>${copy.guideLead}</p>
      </div>
      <div class="seo-article">${copy.seoHtml}
      </div>
    </div>
  </section>

  <section class="why" id="process">
    <div class="wrap">
      <div class="title">
        <span>PROCESS</span>
        <h2>${placeName} 작업 순서</h2>
        <p>${copy.processLead}</p>
      </div>
      <div class="process-grid">
        <div class="process-card"><div class="step">STEP 01</div><strong>${copy.steps[0].title}</strong><p>${copy.steps[0].body}</p></div>
        <div class="process-card"><div class="step">STEP 02</div><strong>${copy.steps[1].title}</strong><p>${copy.steps[1].body}</p></div>
        <div class="process-card"><div class="step">STEP 03</div><strong>${copy.steps[2].title}</strong><p>${copy.steps[2].body}</p></div>
      </div>
      <div style="margin-top:28px" class="photo-row">
        <img src="${imgBase}before-${mainSet}.jpg" alt="${fullPlace} 작업 전 현장" loading="lazy" />
        <img src="${imgBase}process-${mainSet}.jpg" alt="${fullPlace} 작업 중" loading="lazy" />
        <img src="${imgBase}after-${mainSet}.jpg" alt="${fullPlace} 작업 후" loading="lazy" />
      </div>
    </div>
  </section>

  <section id="faq">
    <div class="wrap">
      <div class="title">
        <span>FAQ</span>
        <h2>${placeName}에서 자주 묻는 질문</h2>
        <p>검색·AI 답변에 쓰일 수 있도록 이 지역 기준으로 짧게 정리했습니다.</p>
      </div>
      <div class="faq-grid">${faqHtml(copy.faq)}
      </div>
    </div>
  </section>

  <section id="reviews">
    <div class="wrap">
      <div class="title">
        <span>REVIEW</span>
        <h2>${placeName} 관련 후기</h2>
        <p>${copy.reviewLead}</p>
      </div>
      <div class="review-grid">
        <div class="review-card">
          <span class="tag">유품정리 후기</span>
          <strong>갈매·인창·교문·수택 유품정리 5건</strong>
          <p>아파트·빌라·시장 위층·주택형 유품 분류 현장을 모았습니다.</p>
          <a href="${prefix}reviews/?service=${encodeURIComponent("유품정리")}" class="card-btn" style="margin-top:14px">유품정리 후기</a>
        </div>
        <div class="review-card">
          <span class="tag">쓰레기집청소 후기</span>
          <strong>토평·교문·수택·갈매 적치 현장 5건</strong>
          <p>장기 방치와 고밀도 세대 쓰레기집청소 과정을 확인할 수 있습니다.</p>
          <a href="${prefix}reviews/?service=${encodeURIComponent("쓰레기집청소")}" class="card-btn" style="margin-top:14px">쓰레기집청소 후기</a>
        </div>
      </div>
    </div>
  </section>

  <section class="gallery-block" id="area">
    <div class="wrap">
      <div class="title">
        <span>REGION</span>
        <h2>${city} 서비스 지역</h2>
        <p>갈매·동구권, 인창·교문권, 수택권 행정동 단위 안내입니다.</p>
      </div>
      ${areaLinksHtml(isSubRegion ? 3 : 2, guSlug, dongSlug || null)}
    </div>
  </section>

  <section class="contact-section" id="contact">
    <div class="wrap contact-box">
      <div class="contact-info">
        <h2>${fullPlace} 상담</h2>
        <p>${placeName} 주소, 유품정리/쓰레기집청소 구분, 사진을 남겨 주시면 범위부터 안내합니다.</p>
        <a href="tel:01043932414" class="phone-large">${phone}</a>
      </div>
      <form id="contactForm">
        <select name="service" required>
          <option value="">필요한 서비스를 선택하세요</option>
          ${serviceOptions}
        </select>
        <input type="text" name="from_name" placeholder="성함" required />
        <input type="tel" name="phone" placeholder="연락처" required />
        <input type="text" name="region" placeholder="지역" value="${fullPlace}" required />
        <textarea name="message" placeholder="동·호수, 엘리베이터, 적치 정도를 적어 주세요"></textarea>
        <label class="agree">
          <input type="checkbox" id="privacyCheck" />
          <span>개인정보 수집 및 이용에 동의합니다. 수집항목은 성함, 연락처, 지역, 상담내용이며 상담 및 견적 안내 목적으로만 사용됩니다.</span>
        </label>
        <button type="submit">상담 신청하기</button>
      </form>
    </div>
  </section>

  <section class="related-section" id="related">
    <div class="wrap">
      <div class="title">
        <span>올바른 관련 서비스</span>
        <h2>서울·경기 올바른 바로가기</h2>
      </div>
      <div class="related-grid">${relatedCards()}
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="footer-inner">
    <div><strong>${brandName}</strong><br />${city} 유품정리 · 쓰레기집청소 전문</div>
    <div class="footer-links">
      대표 상담 : <a href="tel:01043932414">${phone}</a>
      <a href="${prefix}llms.txt">AI 검색용 요약</a>
      <a href="https://www.allbarunclean.com/" target="_blank" rel="noopener">올바른수거</a>
      <a href="https://yupum.allbarunclean.com/regions/guri/" target="_blank" rel="noopener">올바른 유품정리 · 구리</a>
      <a href="https://waste.allbarunclean.com/gyeonggi/guri.html" target="_blank" rel="noopener">올바른 폐기물처리 · 구리</a>
    </div>
  </div>
</footer>

<a href="tel:01043932414" class="floating-call">전화 상담 ${phone}</a>

<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script src="${prefix}assets/js/contact.js?v=3"></script>
</body>
</html>`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writePage(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

for (const gu of districts) {
  const guDir = path.join(ROOT, "regions", gu.slug);
  writePage(
    path.join(guDir, "index.html"),
    buildPage({
      placeName: gu.name,
      isSubRegion: false,
      parentGu: gu.name,
      guSlug: gu.slug,
      depth: 2,
      mainSet: pageSets[gu.slug] || pageSets.index,
      contentKey: gu.slug
    })
  );

  for (const dong of gu.dongs) {
    writePage(
      path.join(guDir, dong.slug, "index.html"),
      buildPage({
        placeName: dong.name,
        isSubRegion: true,
        parentGu: gu.name,
        guSlug: gu.slug,
        dongSlug: dong.slug,
        depth: 3,
        mainSet: pageSets[dong.slug] || pageSets.index,
        contentKey: dong.slug
      })
    );
  }
}

console.log("Region pages generated.");
