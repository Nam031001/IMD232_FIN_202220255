// https://openprocessing.org/sketch/813503
//에서 영감을 받아 진행했습니다.
// 기능 =>
// 좌클릭 - 진행방향 전환
// 영타 a - 새로고침
// 마우스 윗쪽 - 파티클 크기 줄어듬
// 마우스 아래쪽 - 파티클 크기 늘어남
// 카메라 상에 비례한 색상을 파티클에 반영한다
// =노트북 카메라를 켜두고 색상을 비춰보면 위치에 따른 색 차이가 더 잘 보입니다.

const num = 3000;
// 랜덤 변화값
const noiseScale = 0.01 / 2;
let capture;

let particles = [];

function setup() {
  background(0, 10);
  setCanvasContainer('canvas', 1, 1, true);
  capture = createCapture(VIDEO);
  capture.hide();

  noStroke();
  for (let i = 0; i < num; i++) {
    particles.push({
      position: createVector(random(width), random(height)),
      color: color,
    });
  }

  // a키를 눌렀을 때 새로고침, addEventListener => 특정이벤트가 발생되었을 때  특정 함수 실행
  document.addEventListener('keydown', function (event) {
    if (event.key === 'a') {
      location.reload();
    }
  });

  window.addEventListener('resize', windowResized);
}

function draw() {
  background(0, 10);
  capture.loadPixels();
  // 각 파티클의 색상을 설정
  particles.forEach((p) => {
    if (!p.initialized) {
      const capX = floor(map(p.position.x, 0, -width, 0, capture.width));
      const capY = floor(map(p.position.y, 0, height, 0, capture.height));
      const capIdx = 4 * (capY * capture.width + capX);
      const rIdx = capIdx;
      const gIdx = capIdx + 1;
      const bIdx = capIdx + 2;
      p.color = color(
        capture.pixels[rIdx],
        capture.pixels[gIdx],
        capture.pixels[bIdx]
      );
      p.initialized = true;
    }
  });

  // 파티클 렌더링
  for (let i = 0; i < num; i++) {
    let p = particles[i];
    //mouseY를 0부터 canvas 높이까지의 범위에서 => 0.5부터 3까지의 범위로 매핑
    let cursorThickness = map(mouseY, 0, height, 1, 6);
    fill(p.color); // 파티클의 색상을 적용
    ellipse(p.position.x, p.position.y, cursorThickness);

    // 이동을 위한 노이즈 계산
    let n = noise(
      p.position.x * noiseScale,
      p.position.y * noiseScale,
      // 화면에 나타난 프레임의 개수 = frameCount
      // 시간이 변할 떄마다 노이즈가 변하도록 한다.
      frameCount * noiseScale * noiseScale
    );
    //계산 후 n => 0에서 1사이의 값
    //에 TAU(360도)를 곱해서 각도 a로 삼는다.
    let a = TAU * n;

    // 해당 각도만큼 파티클 이동
    p.position.x += cos(a);
    p.position.y += sin(a);

    // 화면을 벗어나면 랜덤한 위치로 재설정
    if (!onScreen(p.position)) {
      p.position.x = random(width);
      p.position.y = random(height);
      p.initialized = false; // 초기화 플래그 리셋
    }
  }
}

function mouseReleased() {
  //millis = 1000분의 1
  noiseSeed(millis());
  document.addEventListener('click', playAudio);
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
