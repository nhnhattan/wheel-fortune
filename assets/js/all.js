const dialogRegister = document.getElementById("dialog-register");
const dialogLogin = document.getElementById("dialog-login_body");
const captureBtn = document.getElementById("capture-btn");
const registerBtn = document.getElementById("register-btn");

// responsive
if (window.innerWidth >= 2150 && window.innerHeight >= 3800) {
  document.getElementById("canvas").width = 1300;
  document.getElementById("canvas").height = 1300;
}

document.getElementById("start_btn").addEventListener("click", () => {
  dialogRegister.style.display = "flex";
  dialogRegister.style.opacity = 1;
  dialogLogin.style.display = "flex";
  setTimeout(() => {
    dialogLogin.style.scale = 1;
  }, 200);
});

document.getElementById("change-register_btn").addEventListener("click", () => {
  dialogLogin.style.display = "none";
  dialogRegister.querySelector(".dialog-register_body").style.display = "flex";
  setTimeout(() => {
    dialogRegister.querySelector(".dialog-register_body").style.scale = 1;
  }, 200);
});

window.addEventListener("click", (e) => {
  if (e.target === document.getElementById("dialog-register")) {
    dialogRegister.style.display = "none";
    dialogRegister.style.opacity = 0;
    dialogRegister.querySelector(".dialog-register_body").style.display =
      "none";
    dialogRegister.querySelector(".dialog-register_body").style.scale = 0;
    dialogLogin.style.scale = 0;
    dialogRegister.querySelector(".content-dialog").style.display = "flex";
    captureBtn.style.display = "block";
    registerBtn.style.display = "none";
    dialogRegister
      .querySelector(".dialog-register_body")
      .querySelector(".register-form").style.display = "none";
  }
});

const video = document.getElementById("video");
const canvas = document.getElementById("canvas-capture");
const photo = document.getElementById("photo");
const context = canvas.getContext("2d");
// const rotateButton = document.getElementById("rotate");
const countdown = document.getElementById("countdown");

// Access the user's webcam
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing camera: ", err);
  });

captureBtn.addEventListener("click", () => {});

registerBtn.addEventListener("click", () => {
  dialogRegister.style.display = "none";
  document.querySelector(".home").style.display = "none";
  document.querySelector(".luckywheel-page").style.display = "flex";
});

// Paginations
const winners = Array.from({ length: 30 }, (_, i) => ({
  name: `Người chơi ${i + 1}`,
  time: `${10 + i}:00 - 11/11`,
  avatar: "./assets/img/user-avatar.png",
  prize: "./assets/img/prize.png",
}));

const itemsPerPage = 4;
let currentPage = 1;

const ulElement = document.getElementById("user-list");
const nextButton = document.getElementById("next-list-btn");
const prevButton = document.getElementById("prev-list-btn");
const paginationContainer = document.getElementById("pagination");

const totalPages = Math.ceil(winners.length / itemsPerPage);

function renderItems(page) {
  ulElement.innerHTML = "";

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = winners.slice(startIndex, endIndex);

  paginatedItems.forEach((winner) => {
    const div = document.createElement("div");
    div.className = "table-item";
    div.innerHTML = `
        <div class="table-left">
            <div class="user-avatar">
                <img src="${winner.avatar}" alt="User Avatar" />
            </div>
            <div class="user-info">
                <p class="winner-name">${winner.name}</p>
                <p class="winner-time">${winner.time}</p>
            </div>
        </div>
        <div class="table-right">
            <div class="winner-prize_img">
                <img src="${winner.prize}" alt="Prize" />
            </div>
        </div>
    `;
    ulElement.appendChild(div);
  });

  prevButton.disabled = page === 1;
  nextButton.disabled = page === totalPages;

  updatePagination();
}

function updatePagination() {
  paginationContainer.innerHTML = "";

  const maxPagesToShow = 4;
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage <= 2) {
    startPage = 1;
    endPage = Math.min(maxPagesToShow, totalPages);
  } else if (currentPage > totalPages - 2) {
    startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    endPage = totalPages;
  }

  if (startPage > 1) {
    addPageButton(1);
    if (startPage > 2) addEllipsis();
  }

  for (let i = startPage; i <= endPage; i++) {
    addPageButton(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) addEllipsis();
    addPageButton(totalPages);
  }
}

function addPageButton(page) {
  const li = document.createElement("li");
  li.textContent = page;

  if (page === currentPage) {
    li.classList.add("active");
  }

  li.addEventListener("click", () => {
    currentPage = page;
    renderItems(currentPage);
  });

  paginationContainer.appendChild(li);
}

// Thêm dấu ...
function addEllipsis() {
  const li = document.createElement("li");
  li.textContent = "...";
  li.classList.add("disabled");
  paginationContainer.appendChild(li);
}

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderItems(currentPage);
  }
});

// Nút Previous
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderItems(currentPage);
  }
});

renderItems(currentPage);

// // Capture photo
let rotation = 0;

// Access the user's webcam
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing camera: ", err);
  });

// Rotate camera
// rotateButton.addEventListener("click", () => {
//   rotation = (rotation + 90) % 360;
//   video.style.transform = `rotate(${rotation}deg)`;
// });

captureBtn.addEventListener("click", () => {
  let count = 3;
  countdown.style.display = "block";
  countdown.textContent = count;

  const startTime = Date.now();
  const duration = 3000; // 3 seconds

  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / duration;

    if (elapsed >= duration) {
      clearInterval(timer);
      countdown.style.display = "none";

      // Adjust canvas size to match video aspect ratio
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Rotate and capture photo
      context.save();
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((rotation * Math.PI) / 180); // Rotate the canvas
      context.drawImage(
        video,
        -(canvas.width / 2),
        -(canvas.height / 2),
        canvas.width,
        canvas.height
      );
      context.restore();

      // Create circular crop
      const circularCanvas = document.createElement("canvas");
      const circularContext = circularCanvas.getContext("2d");
      circularCanvas.width = 200;
      circularCanvas.height = 200;

      circularContext.beginPath();
      circularContext.arc(100, 100, 100, 0, Math.PI * 2);
      circularContext.closePath();
      circularContext.clip();

      const sx = (canvas.width - canvas.height) / 2;
      const sy = 0;
      const sSize = Math.min(canvas.width, canvas.height);

      circularContext.drawImage(canvas, sx, sy, sSize, sSize, 0, 0, 200, 200);

      const imageData = circularCanvas.toDataURL("image/png");
      photo.src = imageData;
      video.style.display = "none";
      photo.style.display = "block";
      dialogRegister.querySelector(".content-dialog").style.display = "none";
      captureBtn.style.display = "none";
      registerBtn.style.display = "block";
      dialogRegister
        .querySelector(".dialog-register_body")
        .querySelector(".register-form").style.display = "flex";
    } else {
      countdown.textContent = Math.ceil((duration - elapsed) / 1000);
    }
  }, 16);
});
