
// モデルセクション

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react"
import gsap from "gsap";

import ModelView from "./ModelView";
import { yellowImg } from "../utils";

import { Group } from 'three';
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { models, sizes } from "../constants";
import { animateWithGsapTimeline } from "../utils/animations";


const Model = () => {
  const [ size, setSize ] = useState('small');
  const [ model, setModel ] = useState({
    title: 'iPhone 15 Pro in Natural Titanium',
    color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
    img: yellowImg,
  })

  // 
  const cameraControlSmall = useRef();
  const cameraControlLarge = useRef();

  // groupへの参照を持つ(IPhoneモデルはgroupで囲っている)
  const small = useRef(new Group());
  const large = useRef(new Group());

  // rotation
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  const tl = gsap.timeline();

  // 表示をsmallかlargeかで切り替える。
  useEffect(() => { 
    if(size === 'large') {
      animateWithGsapTimeline(tl, small, smallRotation, '#view1', '#view2', {
        transform: 'translateX(-100%)',
        duration: 2
      })
    }

    if(size ==='small') {
      animateWithGsapTimeline(tl, large, largeRotation, '#view2', '#view1', {
        transform: 'translateX(0)',
        duration: 2
      })
    }
  }, [size])

  useGSAP(() => {
    gsap.to('#heading', { y: 0, opacity: 1 })
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>

        <div className="flex flex-col items-center mt-5">
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            
            {/* 
              ⭐️ModelView コンポーネント
              → Canvas 内に配置する3Dオブジェクトやカメラの設定を管理する役割を果たす
                Canvas は react-three-fiber の レンダリングコンテナ として動作し、
                ModelView はその中で表示される 3Dオブジェクトやカメラ、ライトの設定 を行うためのコンポーネント
                として動作する

              ⭐️注意: htmlにはdivで挿入されてされて、そのdivにモデルがレンダリングされる
                → Viewコンポーネントは、異なるカメラやライトなどを設定して異なるモデルをレンダリングできるように
                  しているため描画結果を分ける必要がある。
                  なので、実際に描画されるのはcanvasだが、その表示を分岐させるためにdivにレンダリングしている
            */}
            <ModelView 
              index={1}
              groupRef={small} // モデル（Group）の参照。これを使い3Dオブジェクトにアクセス(groupオブジェクト)
              gsapType="view1" // idに渡す
              controlRef={cameraControlSmall} // OrbitControls の参照
              setRotationState={setSmallRotation} // カメラの回転(デフォルトは0)
              item={model} // 現在表示する iPhone のデータ
              size={size}
            />  

            <ModelView 
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              item={model}
              size={size}
            />

            {/* 
              ⭐️Canvasコンポーネント → 3Dシーン全体を描画するためのコンテナ。
                        3Dオブジェクトやカメラ、ライト、コントロール などを含めていく
            
              注意: htmlにレンダリングされるときには必ずdivタグ2つでラップされて出力される
              <div>
                <div>
                  <canvas>
                </div>
              </div>
            */}
            <Canvas
              className="w-[100%] h-full"
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden'
              }}
              eventSource={document.getElementById('root')}
              // eventSource → ここでは、id="root" そ指定したdivの範囲のみのクリックやマウスムーブのみを 
              //               eventSourseを設定してCanvasが受け取るイベントを制限してある
              //              目的 ①イベントの対象を絞ることで効率的にイベントを管理
              //                  ②メモリとパフォーマンスの最適化
              //                  ③イベントの伝播を制御する
            >
              {/* 
                ⭐️View.Portコンポーネント
                → Canvas内で3Dシーンが表示されるビューポートを管理するために使う
                  ModelViewコンポーネントのViewとをここで紐づけてレンダリング
                  ライト、カメラなどの設定は重複されないように最適化される → divタグに切り出してレンダリング
              */}
              <View.Port />
            </Canvas>
          </div>

          <div className="mx-auto w-full">
            <p className="text-sm font-light text-center mb-5">{model.title}</p>

            <div className="flex-center">
              <ul className="color-container">
                {/* 各モデルの切り替え ラジオボタン */}
                {models.map((item, idx) => {
                  // console.log(item); // {id: 1, title: 'iPhone 15 Pro in Natural Titanium', color: Array(3), img: '/assets/images/yellow.jpg'}
                  
                  return (
                    <li 
                      key={idx} 
                      className="w-6 h-6 rounded-full mx-2 cursor-pointer" 
                      style={{ backgroundColor: item.color[0] }} 
                      onClick={() => {
                        setModel(item);
                        // console.log(model);
                      }} 
                    />
                  )})
                }
              </ul>
              
              {/* ボタン  サイズの切り替え。 */}
              <button className="size-btn-container">
                {
                  sizes.map(({ label, value }) => {
                    // console.log(label, value)
                    return (
                      // value(smallかlarge)を切り替えて、spanのコンポーネントごとに色を変える
                      <span 
                        key={label} 
                        className="size-btn" 
                        // size → デフォルトは small
                        style={{ backgroundColor: size === value ? 'white' : 'transparent',
                                  color: size === value ? 'black' : 'white'
                              }} 
                        onClick={() => {
                          setSize(value);
                          // console.log(size);
                        }}
                      >
                        { label }
                      </span>
                    )})
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Model