// 行星資料包含示意軌道半徑、公轉速率與繁體中文介紹。
const planets = [
  { name: "水星", color: "#a9a8a6", size: 7, radius: .084, speed: .95, distance: "0.39 AU", description: "離太陽最近的小型岩石行星，白天與夜晚溫差極大。" },
  { name: "金星", color: "#e5b874", size: 11, radius: .132, speed: .72, distance: "0.72 AU", description: "濃厚大氣讓金星成為太陽系中最炙熱的行星。" },
  { name: "地球", color: "#4b9bea", size: 12, radius: .180, speed: .58, distance: "1.00 AU", description: "我們熟悉的藍色家園，位於太陽系的宜居地帶。" },
  { name: "火星", color: "#e46e4f", size: 9, radius: .228, speed: .47, distance: "1.52 AU", description: "帶著紅色外表的岩石行星，是人類探索的下一站。" },
  { name: "木星", color: "#d7a77e", size: 23, radius: .284, speed: .27, distance: "5.20 AU", description: "體積最大的行星，雲層中有著巨大的紅色風暴。" },
  { name: "土星", color: "#e5cd92", size: 20, radius: .340, speed: .20, distance: "9.58 AU", description: "壯觀的冰與岩石光環，讓土星成為最醒目的行星之一。" },
  { name: "天王星", color: "#8ed9dc", size: 15, radius: .396, speed: .14, distance: "19.2 AU", description: "冰巨行星以近乎側躺的姿態繞著太陽公轉。" },
  { name: "海王星", color: "#5677e9", size: 15, radius: .452, speed: .11, distance: "30.1 AU", description: "遙遠的深藍色冰巨行星，擁有強勁高速的風。" }
];

const scene = document.querySelector("#scene");
const layer = document.querySelector("#planet-layer");
const list = document.querySelector("#planet-list");
const planetElements = [];
const orbitElements = [...document.querySelectorAll(".orbit")];
let angles = planets.map((_, index) => (index * 47 + 15) % 360);
let paused = false;
let speedMultiplier = 1;
let selectedIndex = 2;
let previousTime = 0;

// 以固定亂數種子產生星點，讓每次開啟頁面的星空分布保持一致。
let seed = 203;
function random() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}
const stars = document.querySelector("#stars");
for (let i = 0; i < 105; i++) {
  const star = document.createElement("i");
  star.className = "star";
  star.style.left = `${random() * 100}%`;
  star.style.top = `${random() * 100}%`;
  star.style.width = `${random() * 1.6 + .7}px`;
  star.style.height = star.style.width;
  star.style.opacity = `${random() * .6 + .2}`;
  star.style.setProperty("--twinkle", `${random() * 4 + 2}s`);
  stars.append(star);
}

// 按軌道半徑調整軌道圓圈，並建立可點選的行星與導覽按鈕。
planets.forEach((planet, index) => {
  orbitElements[index].style.width = `${planet.radius * 200}%`;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "planet";
  button.dataset.index = index;
  button.setAttribute("aria-label", `選擇${planet.name}`);
  button.style.setProperty("--planet-color", planet.color);
  button.style.width = `${planet.size}px`;
  button.style.height = `${planet.size}px`;
  button.style.marginLeft = `${-planet.size / 2}px`;
  button.style.marginTop = `${-planet.size / 2}px`;
  button.innerHTML = `<span class="planet-label">${planet.name}</span>`;
  button.addEventListener("click", () => selectPlanet(index));
  layer.append(button);
  planetElements.push(button);

  const choice = document.createElement("button");
  choice.type = "button";
  choice.className = "planet-choice";
  choice.dataset.index = index;
  choice.style.setProperty("--planet-color", planet.color);
  choice.innerHTML = `<span class="swatch"></span>${planet.name}`;
  choice.addEventListener("click", () => selectPlanet(index));
  list.append(choice);
});

function selectPlanet(index) {
  selectedIndex = index;
  const planet = planets[index];
  document.querySelector("#detail-name").textContent = planet.name;
  document.querySelector("#detail-description").textContent = planet.description;
  document.querySelector("#detail-distance").textContent = planet.distance;
  document.querySelector("#detail-dot").style.background = planet.color;
  planetElements.forEach((element, i) => element.classList.toggle("selected", i === index));
  list.querySelectorAll(".planet-choice").forEach((element, i) => {
    element.classList.toggle("active", i === index);
    element.setAttribute("aria-pressed", String(i === index));
  });
}

// 每幀依照時間增量更新位置；速度滑桿會同步調整所有行星的動畫速率。
function animate(time) {
  if (!previousTime) previousTime = time;
  const delta = Math.min(time - previousTime, 50);
  previousTime = time;
  if (!paused) {
    planets.forEach((planet, index) => {
      angles[index] = (angles[index] + delta * .006 * planet.speed * speedMultiplier) % 360;
    });
  }
  const center = scene.clientWidth / 2;
  planets.forEach((planet, index) => {
    const radians = angles[index] * Math.PI / 180;
    const radius = center * planet.radius;
    planetElements[index].style.left = `${center + Math.cos(radians) * radius}px`;
    planetElements[index].style.top = `${center + Math.sin(radians) * radius}px`;
  });
  requestAnimationFrame(animate);
}

document.querySelector("#play-button").addEventListener("click", (event) => {
  paused = !paused;
  document.querySelector("#play-icon").textContent = paused ? "▶" : "Ⅱ";
  document.querySelector("#play-label").textContent = paused ? "播放" : "暫停";
  event.currentTarget.setAttribute("aria-label", paused ? "播放動畫" : "暫停動畫");
});
document.querySelector("#reset-button").addEventListener("click", () => {
  angles = planets.map((_, index) => (index * 47 + 15) % 360);
});
document.querySelector("#speed-range").addEventListener("input", (event) => {
  speedMultiplier = Number(event.target.value);
  document.querySelector("#speed-value").textContent = `${speedMultiplier}×`;
});
selectPlanet(selectedIndex);
requestAnimationFrame(animate);
