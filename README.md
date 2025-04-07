# 넷플릭스 클론 v3

**넷플릭스 슬라이더 완성!**
20250407

v2의 scrollIntoView의 한계점을 파악하고
스크롤 로직을 transform으로 변경

---

스크롤이 필요하지 않을 만큼의 짧은 슬라이더는 따로 분리해서 구현함.
이제 `Slider` 는 아이템 개수에 맞게 `ScrollableSlider`와 `StaticSlider`로 나타남.

추가로 컴포넌트 단위로 잘 분리해서 정리해놓음

---

`onMouseLeave` 이벤트가 화면 스크롤해서 컴포넌트를 벗어날때 작동하지 않는 버그가 있어서
window의 `mousemove` 이벤트로 처리함

---

모든 브라우저에서 잘 작동하는 것 확인함
