
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { heroVideo, smallHeroVideo } from "../utils";

const Hero = () => {
  // スマホとpcでvideoを出し分ける
  const [ videoSrc, setVideoSrc ] = useState(
    window.innerWidth < 769 ? smallHeroVideo : heroVideo
  );

  // setTimeoutのidを保持
  // useRefであれば、値が更新されてコンポーネントの再レンダリングを防げる
  const timerIdRef = useRef(null);
  // console.log(timerIdRef); // {current: null}

  const handleVideoSet = () => {
    if (window.innerWidth < 760) {
      // スマホ時
      setVideoSrc(smallHeroVideo);
    } else {
      // PC時
      setVideoSrc(heroVideo);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // console.log("resize running");
      clearTimeout(timerIdRef.current);

      timerIdRef.current = setTimeout(() => {
        // console.log("resize done!!");
        handleVideoSet();
      }, 500);
    };

    window.addEventListener("resize", handleResize);

    // ⭐️ クリーンアップ関数
    //    → アンマウント時に発火(ページ遷移や条件によるコンポーネントの非表示などのタイミング)
    //      useEffect の依存配列が変わると、前のエフェクトがクリーンアップされる
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timerIdRef.current);
    };
  }, []);

  // GSAPのReact用のフック
  // → ・自動的にクリーンアップしてくれる(useEffectでは記述が必要)
  //   ・コンポーネントがアンマウントされたときに自動的にアニメーションがクリーンアップされるので、gsap.killTweensOf() を書く必要がない。
  //   ・内部でGSAPのContext API を使っているため、GSAP のスコープが適切に管理され、kill() の管理をしなくても良くなる。
  //    ・domの取得もuseRefを使わなくてもいい(Context APIを使っているため)
  // 第２引数 → useEffectと同様、初回に発火
  //           配列に含んだステートの更新がされるたびに発火
  useGSAP(() => {
    gsap.to("#hero", { opacity: 1, delay: 2 });
    gsap.to("#cta", { opacity: 1, y: -50, delay: 2 });
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="w-full h-5/6 flex-center flex-col">
        <p id="hero" className="hero-title">iPhone 15 pro</p>

        <div className="md:w-10/12 w-9/12">
          {/* 
            ⭐️key → videoSrc が変わると、新しい video 要素として再レンダリング

            ⭐️<source> → <video>（または <audio>）要素の 動画や音声のファイルを指定する 
            <video> は mp4 だけでなく webm や ogg などの形式にも対応しているので、
            ブラウザによって対応しているフォーマットが違うため、複数の <source> を指定すると安全
            
            type → type="video/mp4" は、<source> タグが提供する 動画ファイルの MIME タイプ（メディアタイプ） 
                  をブラウザに伝えるための属性
          */}
          <video
            className="pointer-events-none"
            autoPlay
            muted
            playsInline={true} // iOS（特に iPhone）で動画をフルスクリーンではなく、ページ内で再生する ための属性
            key={ videoSrc }
          >
            <source src={videoSrc} type="video/mp4" />
            {/* <source src={vide2Src} type="video/webm" /> */}
            {/* <source src={vide3Src} type="video/ogg" /> */}
          </video>
        </div>
      </div>
      <div id="cta" className="flex flex-col items-center opacity-0 translate-y-20">
        <a href="#highlights" className="btn">Buy</a>
        <p className="font-normal text-xl">From $199/month or $999</p>
      </div>
      


    </section>
  );
};

export default Hero;
