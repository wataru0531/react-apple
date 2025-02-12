
// スライダー

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useEffect, useRef, useState } from "react";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";


const VideoCarousel = () => {
  const videoRefs = useRef([]);
  const indicatorOuterRefs = useRef([]); // spanのラッパー
  const indicatorInnerRefs = useRef([]); // 内側のspan
  
  // 動画の状態。初期表示
  const [ video, setVideo ] = useState({
    isEnd: false,       // 1つの動画が再生し終わったか
    startPlay: false,   // スタートさせるか
    videoId: 0,         // 現在どのスライドか
    isLastVideo: false, // 4つの動画の内最後の動画か
    isPlaying: false,   // 再生中か
  });
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  // 動画のメタデータ(基本情報(解像度、フォーマットなど))を読み込んだ時に発火するonLoadedMetadataを使い、
  // 読み込んだメタデータを配列に格納する。
  const [ loadedData, setLoadedData ] = useState([]);

  // 初回、ステートが切り替わった時に発火
  useGSAP(() => {
    // useGSAP → useEffectとは違い、不要なクリーンアップ処理が不要
    //           useRefでDOMを取得しなくていいい
    //           内部でContext APIが動くため、自動クリーンアップしてくれる(kill())
    
    // 全て(4つ)のスライダー(#slider)全体に適用させる
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      // → 0の時は動かない。1の時は左に100%ずれる
      duration: 2,
      ease: "power2.inOut", // show visualizer https://gsap.com/docs/v3/Eases
    });

    // 動画に対しての処理。動画が画面に入った時に発火。
    // 終わればステートを更新
    gsap.to("#video", {
      // scrollTrigger → この設定は、#video が画面内に入ったときに発火
      //                 ここではビューポートに入ってきたタイミングをgsapに通知するだけ。
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
        // → ⭐️スクロール時の動作を制御
        //   onEnter onLeave onEnterBack onLeaveBack の4つの設定
        //   → この場合、onEnter時(画面に要素が入った時にrestart(最初から実行させる))
      },
      onComplete: () => {
        // ⭐️ここでvideoのstartPlayがtrueになるので、アニメーションがスタート
        setVideo((prevState) => ({
          ...prevState,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });

    // isEnd → 1つの動画が終わった時にtrue
    // videoId → 0 1 2 3 で変化
  }, [ isEnd, videoId ]);

  // 
  useEffect(() => {
    let currentProgress = 0;
    let innerSpan = indicatorInnerRefs.current; // インジケーターの内側のspan

    if (innerSpan[videoId]) {
      // インジケーターの処理
      let animation = gsap.to(innerSpan[videoId], {
        // 更新処理
        onUpdate: () => {
          // console.log(animation.progress()) // 0 〜 1
          // animation.progress() このtweenの進行状況 0 〜 1
          const progress = Math.ceil(animation.progress() * 100); // ceil 少数切り上げ
          // → 0 〜 100 に変換

          if(progress != currentProgress) {
            currentProgress = progress;

            // 外側のspanの幅を伸ばす
            // デフォルトで.5のdurationがつく
            gsap.to(indicatorOuterRefs.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // スマホ
                  : window.innerWidth < 1200
                  ? "10vw" // タブレット
                  : "4vw", // pc
            });

            // 内側のspanを伸ばしていく
            gsap.to(innerSpan[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        // 外側のspanと内側のspanを元に戻す
        onComplete: () => {
          if(isPlaying) { // videoの再生中
            gsap.to(indicatorOuterRefs.current[videoId], {
              width: "12px",
            });
            gsap.to(innerSpan[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if(videoId == 0) { // 1つ目のvideoに戻ったら再生開始
        // restart。最初から再生し直す(progress(0)にして play())
        // play() → 現在の位置から再生
        animation.restart();
      }

      // 実際のビデオの進行状況(経過時間)を取得。0 〜 1
      const animUpdate = () => {
        // currentTime → 実際の動画の進捗を取得
        // console.log(videoRefs.current[videoId].currentTime);

        // animation.progress() 
        // → 現在の進行状況を取得するだけでなく、引数に0から1の値を渡すことで進行位置を直接設定することも可能
        animation.progress(
          videoRefs.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      // gsapのrafと動画ごとの進捗を同期させる
      if(isPlaying) {
        // 指定した関数をアニメーションフレームごとに実行する処理
        // ⭐️ → これはgsapがrequestAnimationFrameを内部で使っているからそれと同期させるため
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [ videoId, startPlay ]);

  // ４つの動画のメタデータが読み込まれた発火。
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRefs.current[videoId].pause();
      } else {
        startPlay && videoRefs.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // 動画の制御ボタン
  // 動画をスタートさせたい時、停止したい時、ステートをリセットしたいときなどで出し分ける
  const handleProcess = (_type, _idx) => {
    switch (_type) {
      case "video-end": // 1つの動画の生成が終わった時に発火
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: _idx + 1 }));
        break;

      case "video-last": // 最後の動画(ここでは4つ目)が終わったっ時に発火
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset": // 最後のスライドの時。idを元に戻して初めに戻す
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause": // 停止。isPlayingを反転
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play": // 再生させる。pre.isPlayingでtrueにする(デフォルトはfalse);
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  // 動画のメタデータ(基本情報)が読み込まれたら発火。ステートに保持
  const handleLoadedMetaData = (idx, e) => setLoadedData((prevState) => {
    // console.log(prevState); // (3)[SyntheticBaseEvent, SyntheticBaseEvent, SyntheticBaseEvent]
    // console.log(e)

    // ... スプレッド演算子。配列の要素を展開して新しい配列をつくる。
    // カンマで区切ればその新しい配列に要素を追加できrる
    return [...prevState, e];
  });

  return (
    <>
      <div className="flex items-center">
        { 
          // スライド(動画)を１つづつ展開
          hightlightsSlides.map((list, idx) => {
            // console.log(list); 
            // {id: 1, textLists: Array(3), video: '/assets/videos/highlight-first.mp4', videoDuration: 4}
            
            return (
              <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                <div className="video-carousel_container">
                  <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                    <video
                      id="video"
                      playsInline={ true } // safariで通常画面で再生させる
                      className={`${
                        list.id === 2 && "translate-x-44"
                      } pointer-events-none`}
                      preload="auto" // できるだけ事前にデータを読み込む。metadata, none
                      muted
                      ref={(el) => (videoRefs.current[idx] = el)}
                      onEnded={() => // 動画が最後まで再生された時に発火
                        idx !== 3 // 最後の動画ではない時
                          ? handleProcess("video-end", idx) // 次の動画へ進める処理
                          : handleProcess("video-last") // 最後の動画の時に発火
                      }
                      onPlay={() => // 動画が再生された時
                        setVideo((pre) => ({ ...pre, isPlaying: true }))
                      }
                      // onLoadedMetadata → 動画のメタデータ(長さ・解像度など)が読み込まれたときに発火
                      //                    ただし、動画のすべてのデータが完全にロードされたわけではない
                      onLoadedMetadata={(e) => {
                        // console.log(e); // SyntheticBaseEvent {_reactName: 'onLoadedMetadata', _targetInst: null, type: 'loadedmetadata', nativeEvent: Event, target: video#video.translate-x-44.pointer-events-none, …}
                        handleLoadedMetaData(idx, e)
                      }}
                      
                    >
                      <source src={list.video} type="video/mp4" />
                    </video>
                  </div>

                  <div className="absolute top-12 left-[5%] z-10">
                    {list.textLists.map((text, idx) => (
                      <p key={idx} className="md:text-2xl text-xl font-medium">{text}</p>
                    ))}
                  </div>
                </div>
              </div>
          )})
        }
      </div>

      {/* インジケーター */}
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRefs.current.map((_, _idx) => (
            // ラッパーのspan → active時は長くなる
            // 内側のspan → active時に動画の再生時間と共に進むプログレス
            <span
              key={_idx}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              // コールバックを使いDOMを取得
              ref={(el) => (indicatorOuterRefs.current[_idx] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (indicatorInnerRefs.current[_idx] = el)}
              />
            </span>
          ))}
        </div>
        
        {/* 
          再生ボタン 
          replayImg → 円の矢印、playImg → 右矢印、pauseImg → ２本線
        */}
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying // 再生中でないならば、
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
