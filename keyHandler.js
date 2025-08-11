(async () => {
  // 모듈 로드
  const { showModal, closeModal } = await import(
    chrome.runtime.getURL("module/userModal.js")
  );

  // 키 이벤트
  document.addEventListener("keydown", (e) => {
    if (e.key === "F2") {
      document.getElementById("id").value = "uniflow";
      document.getElementById("password").value = "unipost01@!";
      document.querySelector(".btn-login").click();
    }

    if (e.key === "F3") {
      const modal = document.getElementById("uniflow-modal");
      modal ? closeModal() : showModal();
    }

    if (e.key === "F4") {
      fetch("/unicloud/admin/usermanage/getCompanyUserList", {
        method: "POST", // GET이면 body 사용 불가
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sUsName: "",
          usSts: "Y",
          sUseType: "ALL",
          fRegDateStart: "",
          fRegDateEnd: "",
          sUserStatus: "10",
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }

    if (e.key === "Escape") {
      const modal = document.getElementById("uniflow-modal");
      if (modal) {
        modal.remove();
      }
    }
  });
})();
