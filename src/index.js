
import Moven from './moven'

window.Moven = Moven;

// document.addEventListener('click', (event) => {
//     console.log('click:', event);
//
//     let targetDomPath = getDomPath(event.target).join('>'); // can be used by document.querySelector
//
//     console.log('targetDomPath:', targetDomPath);
//
// });

/*
* 应该记录的内容：
*    - 时间，这个时间具体是页面打开的时间还是开始记录的时间，有待考虑
*    - target
*    - action
*    - url 这个比较重要并且容易忽视
*
* */