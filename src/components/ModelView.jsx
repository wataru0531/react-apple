
// モデル

// ⭐️@react-three/drei
// → 「drei」は、ドイツ語で「3」という意味
//    Reactで3Dシーンを構築する際に役立つ便利なツールやコンポーネントを提供
//    react-three-fiber を使った3D開発をより簡単に、効率的に行うための補助的なツールがたくさん詰まっている便利なライブラリ
//    ① 3Dシーンの管理を簡単にする View や PerspectiveCamera などのコンポーネント
//    ② よく使う3D効果やコンポーネント（OrbitControls, Sky, Loader など）を手軽に導入できる
//    ③ モデルやオブジェクトを簡単にロードするための useGLTF や useTexture フック
//    ④ よく使うライティング設定を簡単に実装できる Lights など

import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"
import PropTypes from 'prop-types'; // PropTypes をイ

import { Vector3 } from 'three'

import Lights from './Lights';
import Loader from './Loader';
import IPhone from './IPhone';
import { Suspense } from "react";

const ModelView = ({ 
  index, // smallが1。largeが2
  groupRef, // モデル（Group）の参照。これを使い3Dオブジェクトにアクセス
  gsapType, // smallがview1、largeがview2
  controlRef,  // OrbitControls の参照
  setRotationState, 
  item, // 現在表示する iPhone のデータ
  size, // small, large
  
}) => {
  // console.log(groupRef); // {current: Group}

  return (
    // Viewコンポーネント
    // → ⭐️Canvasタグの中のView.Portコンポーネントと紐づけて、複数のViewコンポーネントを
    //   1つのCanvasの中にレンダリングさせる
    //   Viewコンポーネントに切り分けることで、カメラ、ライトなどをモデルごとに変更できる。
    //   例えば、あるViewではカメラをPerspectiveCamera、あるViewではOrthographicCameraを使ったりできる

    // htmlには描画結果としてdivにレンダリングされる
    // → カメラなどが異なるため、違うシーンをレンダリング結果として保持して出力するために分ける
    // ⭐️1つ目のViewのレンダリング後のhtml
    // → <div id="view1" class="w-full h-full absolute " style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px); touch-action: none;"></div>
    // ⭐️2つ目のViewのランダリング後のhtml
    // → <div id="view2" class="w-full h-full absolute right-[-10%]" style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px); touch-action: none;"></div>
    <View
      index={index}
      id={gsapType}
      // largeサイズは右に100%ずらしておく
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      {/* PerspectiveCamera でカメラを設定し、OrbitControls でカメラ操作を可能にする */}
      {/* 
        ⭐️makeDefault 
          → ここでは、true にすると指定したカメラがそのシーンのデフォルトカメラとして設定される
            @react-three/fiber のキャンバスがどのカメラを使うべきかを決定します
        
          つまり、makeDefault を設定することで、そのコンポーネントがデフォルトの動作として認識され、
          他のカメラやコントロールを明示的に設定しない限り、これらが自動的に使用される
        
        ⭐️ Viewコンポーネントでカメラを設定しているので、makeDefaultの記述は必須
        → ここで記述しなかったらCanvasコンポーネントの中に直接記述する
      */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      {/* シーンのライトを設定 */}
      <Lights />

      {/* 
        ここでのmakeDefault
        → そのコントロールがデフォルトのカメラ操作用コントロールとして機能
      
        */}
      <OrbitControls 
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new Vector3(0, 0 ,0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      /> 

      {/* ここでrefにsmallかlargeの参照を渡して3Dオブジェクトにアクセスする */}
      <group ref={groupRef} name={`${index === 1} ? 'small' : 'large`} position={[0, 0 ,0]}>
        {/* ローディング中はLoader表示 */}
        <Suspense fallback={<Loader />}>
          <IPhone 
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  )
}

export default ModelView


// ⭐️Reactでは、prop-types を使ってコンポーネントのプロパティの型チェックを行うことが推奨
ModelView.propTypes = {
  index: PropTypes.number.isRequired,
  groupRef: PropTypes.object.isRequired,
  gsapType: PropTypes.string.isRequired,
  controlRef: PropTypes.object.isRequired,
  setRotationState: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired
};