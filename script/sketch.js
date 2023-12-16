let capture;
const tileSize = 10;

let particles = [];
const num = 2200;
// 랜덤 변화값
const noiseScale = 0.01 / 2;

function setup() {
  createCanvas(800, 800);

  //w : h = cam w : cam h
  // => (w * camH) / camW = h
  capture = createCapture(VIDEO);
  capture.hide();
  //   비디오를 만들어서 화면상에서 숨기기

  console.log(capture);

  noStroke();
  //---
  setCanvasContainer('canvas', 1, 1, true);
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }

  stroke(255);
  clear();
  // a키를 눌렀을 때 새로고침, addEventListener => 특정이벤트가 발생되었을 때  특정 함수 실행
  document.addEventListener('keydown', function (event) {
    if (event.key === 'a') {
      location.reload();
    }
  });
}

function draw() {
  capture.loadPixels();

  for (let y = 0; y < capture.height; y += tileSize) {
    for (let x = 0; x < capture.width; x += tileSize) {
      // 가로로 일렬, 그다음 세로 두번쨰 줄부터 이어지는 인덱스 배열(색배열) 만들기
      //해당 방법에는 투명도 개념(알파a)이 있다.
      const idx = (capture.width * y + x) * 4;

      //   rIdx,g,b,a를 총 합쳐서 총 100개의 픽셀이 있다고 가정하면 출력 시 400개의 픽셀이 출력된다.
      //=> 이를 이용해 색값을 출력할 수 있다.
      const rIdx = idx;
      const gIdx = idx + 1;
      const bIdx = idx + 2;
      const aIdx = idx + 3;
      //   rgb 색값을 3으로 나눠서 밝기로 삼는다.
      const brightness =
        capture.pixels[rIdx] + capture.pixels[gIdx] + capture.pixels[bIdx] / 3;

      //받아온 색값을 컬러로 칠한다.
      stroke(capture.pixels[rIdx], capture.pixels[gIdx], capture.pixels[bIdx]);

      //   capture.width - x => 비디오 좌우반전
    }
  }
  //mouseY를 0부터 canvas 높이까지의 범위에서 => 0.5부터 3까지의 범위로 매핑
  let cursorThickness = map(mouseY, 0, canvas.height, 0.7, 3);
  strokeWeight(cursorThickness);

  background(0, 10);

  // 입자가 초기에 설정한 입자개수보다 작을시
  for (let i = 0; i < num; i++) {
    //현재 입자를 변수 p에 저장
    let p = particles[i];
    //p를 화면에 그린다
    point(p.x, p.y);

    // 입자의 이동 방향을 결정하는 노이즈 값을 계산
    let n = noise(
      p.x * noiseScale,
      p.y * noiseScale,
      // frameCount => draw의 첫번째 반복이 끝나면 1씩 증가
      frameCount * noiseScale * noiseScale
    );

    // 진행 각도계산
    let a = TAU * n;

    //입자를 이동
    p.x += cos(a);
    p.y += sin(a);

    // 만약 입자가 화면을 벗어나면 랜덤한 위치로 재설정
    if (!onScreen(p)) {
      p.x = random(width);
      p.y = random(height);
    }
  }
}
// 마우스를 떼면 노이즈의 시드를 현재 시간으로 변경하여 무작위성을 추가
// mouseReleased => 마우스 버튼이 놓일 때마다 한 번씩 호출
function mouseReleased() {
  noiseSeed(millis());
  document.addEventListener('click', playAudio);
}

// function playSound(audioName) {
//   let audio = new Audio(audioName);
//   audio.play();
// }
// playSound('../finals/sound/FX_piano01.mp3');

// document.addEventListener('click', playSound);

// 벡터 v가 화면 안에 있는지 여부를 반환하는 함수
function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

// ___ 파티클 움직임 구현
