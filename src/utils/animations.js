
// "数値" 指定時間後にトゥイーン。タイムラインの先頭からの時間（秒）で開始
// "+=1"  直前のトゥイーンの終了後に何秒だけ離すか delay: 1 と同じ
// "-=1"  直前のトゥイーンの終了に何秒だけ重ねるか delay: -1　と同じ

// ">"    直前のトゥイーンの終了時
// ">3"   直前のトゥイーンの終了後に何秒だけ離すか。3秒後にトゥイーンする
// "<"    直前のトゥイーンの開始時
// "<4"   直前のトゥイーンの開始時の何秒後か。4秒後にトゥイーン

// "ラベル名"  指定したラベルと同じタイミングでトゥイーン
// "ラベル名 += 数値"
// "ラベル名 -= 数値"

// stagger... each   ... デフォルト、1つ１つの要素に効く
//            amount ... 全体で何秒か

// Custom ease の使用例
// gsap.registerPlugin(CustomEase)
// CustomEase.create(
//   "hop",
//   "M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0"
// );

// //now you can reference the ease by ID (as a string):
// gsap.to(element, { duration: 1, y: -100, ease: "hop" });

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// scrollTriggerを備えたトゥイーン処理
export const animateWithGsap = (
  _target, 
  _animationProps, 
  _scrollProps    // scrollTriggerに渡すオブジェクト
) => {

  gsap.to(_target, {
    ..._animationProps,

    scrollTrigger: {
      trigger: _target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%", // trigger要素 ブラウザ
      ..._scrollProps,
    }
  })
}

// useRefで取得しているDOM(_rotationRef)へのタイムライン処理
export const animateWithGsapTimeline = (
  _timeline, 
  _rotationRef, // 回転させるDOMへの参照
  _rotationState, // 回転。デフォルトは0
  _firstTarget, // "view1"
  _secondTarget, // "view2"
  _animationProps, // { ...アニメーションのデータ }
) => {
  _timeline.to(_rotationRef.current.rotation, {
    y: _rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  _timeline.to(_firstTarget, {
    ..._animationProps,
    ease: "ease2.inOut",
  }, "<"); // 直前のtweenの開始時

  _timeline.to(_secondTarget, {
    ..._animationProps,
    ease: "ease2.inOut",
  }, "<")
}