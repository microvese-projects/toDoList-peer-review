/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
function moreBtn() {
  const more = document.createElement('div');
  more.className = 'more';
  for (let i = 0; i < 3; i++) {
    const box = document.createElement('div');
    box.className = 'box';
    more.appendChild(box);
  }
  return more;
}

export default moreBtn;