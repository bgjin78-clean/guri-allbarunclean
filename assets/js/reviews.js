(function () {
  const CASES_BASE = "/images/cases";

  const REVIEWS = [
    {
      area: "갈매동",
      service: "유품정리",
      title: "구리시 갈매동 아파트 유품정리",
      text: "갈매역 인근 대단지에서 상속 후 보관 상자를 먼저 나누고, 나머지 가구·의류를 화물 엘리베이터와 지하주차장 동선으로 반출한 현장입니다. 단지 반출 시간을 맞춰 당일 비웠습니다."
    },
    {
      area: "인창동",
      service: "유품정리",
      title: "구리시 인창동 빌라 유품정리",
      text: "구리역 생활권 다세대에서 서랍·옷장에 흩어진 서류와 사진을 가족이 지정한 뒤, 나머지 방을 분류·반출했습니다. 계단 운반이라 장롱은 분해해 내렸습니다."
    },
    {
      area: "교문2동",
      service: "유품정리",
      title: "구리시 교문2동 밀집 주거 유품정리",
      text: "상가 위층 빌라에서 가져갈 소량 유품만 상자에 담고 공간을 비운 사례입니다. 복도에 짐을 쌓지 않고 차량이 붙는 즉시 상차해 점포 출입을 막지 않았습니다."
    },
    {
      area: "수택1동",
      service: "유품정리",
      title: "구리시 수택1동 시장 인근 유품정리",
      text: "구리전통시장 위층 주거에서 제사 그릇과 서류를 표시해 둔 뒤 가구를 계단으로 내린 현장입니다. 장 시작 전 짧은 시간에 상차를 마쳤습니다."
    },
    {
      area: "동구동",
      service: "유품정리",
      title: "구리시 동구동 사노동 주택 유품정리",
      text: "사노동 단독주택 안채와 창고에 나뉜 유품을 방 단위로 분류했습니다. 왕숙천 방향 골목이 좁아 입구에 본차를 두고 나눠 운반했습니다."
    },
    {
      area: "수택3동",
      service: "쓰레기집청소",
      title: "구리시 수택3동 토평 쓰레기집청소",
      text: "토평동 빈집에 수년 쌓인 생활폐기물을 방부터 마당 순으로 제거한 현장입니다. 한강 방향 습기로 장판 상태가 나빠, 반출 후 오염 여부를 함께 확인했습니다."
    },
    {
      area: "교문1동",
      service: "쓰레기집청소",
      title: "구리시 교문1동 아천동 쓰레기집청소",
      text: "아천동 장기 방치 주택에서 환기 후 적치물을 마당으로 내 상차했습니다. 아차산로 경사 구간이라 대문 앞 도로 폭을 보고 차량을 정했습니다."
    },
    {
      area: "수택2동",
      service: "쓰레기집청소",
      title: "구리시 수택2동 고밀도 세대 쓰레기집청소",
      text: "현관이 반만 열리던 빌라 세대를 통로 확보부터 시작한 사례입니다. 이중 주차가 심해 포장분을 여러 차례 순환 상차했습니다."
    },
    {
      area: "갈매동",
      service: "쓰레기집청소",
      title: "구리시 갈매동 임대 전 쓰레기집청소",
      text: "갈매지구 아파트에서 이전 거주자 잔여 봉투와 매트리스를 세대 밖으로 낸 현장입니다. 관리사무소 반출 시간 안에 지하 하역까지 마쳤습니다."
    },
    {
      area: "인창동",
      service: "쓰레기집청소",
      title: "구리시 인창동 원룸 쓰레기집청소",
      text: "밀집 주거 원룸의 천장 높이 적치를 분류·포장·상차한 사례입니다. 골목 대기를 짧게 하려고 실내 포장을 먼저 끝냈습니다."
    }
  ];

  const CASE_NUM = {
    "갈매동|유품정리": 3,
    "인창동|유품정리": 11,
    "교문2동|유품정리": 18,
    "수택1동|유품정리": 27,
    "동구동|유품정리": 36,
    "수택3동|쓰레기집청소": 52,
    "교문1동|쓰레기집청소": 61,
    "수택2동|쓰레기집청소": 73,
    "갈매동|쓰레기집청소": 84,
    "인창동|쓰레기집청소": 95
  };

  function pad3(n) {
    return String(n).padStart(3, "0");
  }

  function isYupum(service) {
    return service === "유품정리";
  }

  function caseImages(review) {
    const num = CASE_NUM[review.area + "|" + review.service] || (isYupum(review.service) ? 1 : 51);
    const id = pad3(num);
    if (isYupum(review.service)) {
      return {
        before: CASES_BASE + "/before-" + id + ".jpg",
        after: CASES_BASE + "/after-" + id + ".jpg"
      };
    }
    return {
      before: CASES_BASE + "/waste-before-" + id + ".jpg",
      after: CASES_BASE + "/waste-after-" + id + ".jpg"
    };
  }

  function renderReviews(filterArea, filterService) {
    const list = document.getElementById("reviewList");
    if (!list) return;
    list.innerHTML = "";

    REVIEWS.forEach(function (review) {
      if (filterArea && review.area !== filterArea && filterArea.indexOf(review.area) === -1 && review.area.indexOf(filterArea) === -1) return;
      if (filterService && review.service !== filterService) return;

      const imgs = caseImages(review);
      const article = document.createElement("article");
      article.className = "review-card";
      article.setAttribute("data-area", review.area);
      article.setAttribute("data-service", review.service);
      article.innerHTML =
        '<span class="tag">' + review.service + " · " + review.area + "</span>" +
        "<strong>" + review.title + "</strong>" +
        '<div class="photo-row photo-row--pair" style="margin:14px 0">' +
        '<img src="' + imgs.before + '" alt="' + review.title + ' 작업 전" loading="lazy" />' +
        '<img src="' + imgs.after + '" alt="' + review.title + ' 작업 후" loading="lazy" />' +
        "</div>" +
        "<p>" + review.text + "</p>";
      list.appendChild(article);
    });
  }

  const params = new URLSearchParams(window.location.search);
  const area = params.get("area");
  const service = params.get("service");
  const label = document.getElementById("filterLabel");
  if (label) {
    if (service && area) label.textContent = area + " " + service + " 작업후기입니다.";
    else if (service) label.textContent = "구리시 " + service + " 작업후기입니다.";
    else if (area) label.textContent = area + " 작업후기입니다.";
  }

  renderReviews(area, service);
})();
