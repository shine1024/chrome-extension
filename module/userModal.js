let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let tbodyUser, tbodyFav;

// 내부 함수: 즐겨찾기 저장
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// 내부 함수: 사용자 로그인
function changeLoginUser(usId) {
  fetch("/unicloud/admin/usermanage/changeLoginUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: usId }),
  })
    .then(() => {
      window.location = "/";
    })
    .catch((error) => {
      console.log(error);
    });
}

// 내부 함수: 사용자 목록 조회
async function getCompanyUserList() {
  const res = await fetch("/unicloud/admin/usermanage/getCompanyUserList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sUsName: "",
      usSts: "Y",
      sUseType: "ALL",
      fRegDateStart: "",
      fRegDateEnd: "",
      sUserStatus: "10",
    }),
  });
  return res.json();
}

// 내부 함수: 테이블 렌더링
function renderTables(users) {
  tbodyUser.innerHTML = users
    .map(
      (u, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><a class="add-fav" data-id="${u.usId}">${u.usId}</a></td>
        <td>${u.usName}</td>
        <td>${u.usDeptName}</td>
      </tr>
    `
    )
    .join("");

  const favUsers = users.filter((u) => favorites.includes(u.usId));
  tbodyFav.innerHTML = favUsers
    .map(
      (u, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><a class="change-login" data-id="${u.usId}">${u.usId}</a></td>
        <td>${u.usName}</td>
        <td>${u.usDeptName}</td>
        <td class="align-center">
          <a class="remove-fav" data-id="${u.usId}">[해제]</a>
        </td>
      </tr>
    `
    )
    .join("");

  // 일반 목록 클릭 이벤트
  tbodyUser.querySelectorAll(".add-fav").forEach((a) => {
    a.onclick = () => {
      const id = a.getAttribute("data-id");
      if (favorites.includes(id)) {
        changeLoginUser(id);
      } else {
        favorites.push(id);
        saveFavorites();
        renderTables(users);
      }
    };
  });

  // 즐겨찾기 목록 클릭 이벤트 (로그인)
  tbodyFav.querySelectorAll(".change-login").forEach((a) => {
    a.onclick = () => {
      const id = a.getAttribute("data-id");
      changeLoginUser(id);
    };
  });

  // 즐겨찾기 해제 버튼 이벤트
  tbodyFav.querySelectorAll(".remove-fav").forEach((a) => {
    a.onclick = () => {
      const id = a.getAttribute("data-id");
      favorites = favorites.filter((f) => f !== id);
      saveFavorites();
      renderTables(users);
    };
  });
}

// 공개 함수: 모달 표시
export async function showModal() {
  if (document.getElementById("uniflow-modal")) return;

  // HTML 로드
  const res = await fetch(chrome.runtime.getURL("module/userModal.html"));
  const html = await res.text();
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  // CSS 로드
  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href = chrome.runtime.getURL("module/userModal.css");
  document.head.appendChild(cssLink);

  // 엘리먼트 참조
  tbodyUser = document.getElementById("user-table-body");
  tbodyFav = document.getElementById("fav-table-body");

  // 닫기 버튼 이벤트
  document.getElementById("close-uniflow-modal").onclick = closeModal;

  // 사용자 목록 조회 후 렌더링
  const data = await getCompanyUserList();
  if (data.response) {
    renderTables(data.response);
  } else {
    renderTables([]);
  }
}

// 공개 함수: 모달 닫기
export function closeModal() {
  document.getElementById("uniflow-modal")?.remove();
}
