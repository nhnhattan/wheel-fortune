let theWheel;
let wheelSpinning = false;
let usedPrizes = []; // Mảng lưu kết quả các phần quà đã trúng

// Sounds
const spinSound = new Audio("./assets/audio/spinSound.mp3"); 
const winSound = new Audio("./assets/audio/winSound.mp3"); 

spinSound.loop = true; 
spinSound.volume = 0.5; 
winSound.volume = 1; 

const prizes = [
  {
    name: "500k",
    image: "./assets/img/binhnuoc.png",
    fillStyle: "#FF6B6B",
  },
  {
    name: "200k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#4ECDC4",
  },
  {
    name: "100k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#45B7D1",
  },
  {
    name: "500k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#96CEB4",
  },
  {
    name: "100k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#FFEEAD",
  },
  {
    name: "100k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#D4A5A5",
  },
  {
    name: "200k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#9DC8C8",
  },
  {
    name: "200k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#58C9B9",
  },
  {
    name: "200k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#58C9B9",
  },
  {
    name: "200k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#58C9B9",
  },
  {
    name: "100k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#58C9B9",
  },
  {
    name: "100k",
    image:
      "https://cdn2.iconfinder.com/data/icons/web-interface-icons/66/Img-512.png",
    fillStyle: "#58C9B9",
  },
];

let prizeImages = [];
let imageWidth = 35;
let imageHeight = 35;
let radiusFromCenter = 70; // Khoảng cách từ tâm đến hình ảnh
let textFontSize = 12;
let textMargin = 15;

if (window.innerWidth >= 2150 && window.innerHeight >= 3800) {
  imageWidth = 200;
  imageHeight = 200;
  radiusFromCenter = 300;
  textFontSize = 70;
  textMargin = 25;
}

function wrapText(text, maxLength) {
  const words = text.split(" ");
  let wrappedText = "";
  let line = "";

  for (let i = 0; i < words.length; i++) {
    if ((line + words[i]).length > maxLength) {
      wrappedText += line + "\n";
      line = "";
    }
    line += words[i] + " ";
  }
  wrappedText += line;
  return wrappedText.trim();
}

function loadImages() {
  return Promise.all(
    prizes.map((prize) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = prize.image;
      });
    })
  );
}

// Vẽ hình ảnh cho mỗi phân đoạn
function drawSegmentImages() {
  if (!theWheel.ctx) return;

  const ctx = theWheel.ctx;
  const segmentAngle = 360 / prizes.length;

  ctx.save();
  ctx.translate(theWheel.centerX, theWheel.centerY); // Di chuyển đến tâm vòng quay

  prizeImages.forEach((img, index) => {
    const angle =
      ((segmentAngle * index + segmentAngle / 2 + theWheel.rotationAngle) *
        Math.PI) /
      180;

    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -theWheel.outerRadius + radiusFromCenter); // Dịch chuyển hình ảnh từ tâm ra ngoài
    ctx.drawImage(
      img,
      -imageWidth / 2,
      -imageHeight / 2,
      imageWidth,
      imageHeight
    );
    ctx.restore();
  });

  ctx.restore();
}

function checkAvailablePrizes() {
  return prizes.filter((prize) => !usedPrizes.includes(prize.name));
}

function addUsedPrize(prize) {
  usedPrizes.push(prize);
}

function checkUsedPrizes(result) {
  return usedPrizes.includes(result);
}

function showOutOfPrizes() {
  const modal = document.getElementById("outOfPrizesModal");
  modal.style.display = "block";
}

let canvasOuterRadius = 145;
let canvasCenterX = 145;
let canvasCenterY = 145;

if (window.innerWidth >= 2150 && window.innerHeight >= 3800) {
  canvasOuterRadius = 650;
  canvasCenterX = 650;
  canvasCenterY = 650;
}

async function initWheel() {
  try {
    prizeImages = await loadImages();

    theWheel = new Winwheel({
      numSegments: prizes.length,
      outerRadius: canvasOuterRadius,
      centerX: canvasCenterX,
      centerY: canvasCenterY,

      rotationAngle: 0,
      segments: prizes.map((prize, index) => ({
        text: wrapText(prize.name, 8),
        fillStyle: index % 2 === 0 ? "#FFFFFF" : "#FF0000",
        textFillStyle: index % 2 === 0 ? "#FF0000" : "#FFFFFF",
        textFontFamily: "Courier",
        textFontSize: textFontSize,
        textOrientation: "curved",
        textAlignment: "outer",
        strokeStyle: "#fff",
        textMargin: textMargin,
      })),
      animation: {
        type: "spinToStop",
        duration: 5,
        spins: 8,
        callbackFinished: alertPrize,
        callbackAfter: drawSegmentImages,
      },
    });
    theWheel.draw();
    drawSegmentImages();
  } catch (error) {
    console.error("Error loading images:", error);
  }
}

function checkUsedPrizes(result) {
  return usedPrizes.includes(result);
}

function addUsedPrize(prize) {
  usedPrizes.push(prize);
}

function startSpin() {
  if (!wheelSpinning) {
    const availablePrizes = checkAvailablePrizes();

    if (availablePrizes.length === 0) {
      showOutOfPrizes();
      return;
    }

    // Đặt lại góc quay về 0
    theWheel.rotationAngle = 0;

    spinSound.play();

    let stopAt;
    do {
      stopAt = Math.floor(Math.random() * 360);
      const segmentAngle = 360 / prizes.length;
      const adjustedStopAt =
        Math.floor(stopAt / segmentAngle) * segmentAngle + segmentAngle / 2;

      // Kiểm tra xem phần quà này đã trúng chưa
      const prizeIndex = Math.floor(adjustedStopAt / (360 / prizes.length));
      if (!checkUsedPrizes(prizes[prizeIndex].name)) {
        theWheel.animation.stopAngle = adjustedStopAt;
        addUsedPrize(prizes[prizeIndex].name); 
        break;
      }
    } while (true);

    document.querySelector(".spin-button").disabled = true;
    theWheel.startAnimation();
    wheelSpinning = true;
  }
}

window.onload = initWheel;

function alertPrize(indicatedSegment) {

  spinSound.pause();
  spinSound.currentTime = 0;

  winSound.play();
  
  const prizeIndex = prizes.findIndex(
    (prize) => wrapText(prize.name, 8) === indicatedSegment.text
  );
  document.getElementById(
    "prizeText"
  ).textContent = `Bạn đã nhận được phần quà là: ${indicatedSegment.text}`;
  document.getElementById("prizeImage").src = prizes[prizeIndex].image;
  document.getElementById("resultModal").style.display = "block";

  const prizeSegment = theWheel.getIndicatedSegment(); 
  prizeSegment.fillStyle = "#BEBEBE"; 

  wheelSpinning = false;
  document.querySelector(".spin-button").disabled = false;

  setTimeout(() => {
    theWheel.draw();
    drawSegmentImages();
  }, 100);
}

function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

function closeOutOfPrizesModal() {
  document.getElementById("outOfPrizesModal").style.display = "none";
}
