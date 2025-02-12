
// ライト

import { Environment, Lightformer } from "@react-three/drei";

const Lights = () => {
  return (
    <group name="lights">

      {/* 
        Environment → シーンに環境光を追加するために使用
        esolution={256} → 環境マップの解像度
      */}
      <Environment resolution={256}>
        <group>
          {/* 
            ⭐️ Lightformer は環境光を形成するために使われるライトの一種
              form="rect" を指定することで、矩形の光源を作成できる
          
          */}
          <Lightformer
            form="rect"
            intensity={10}
            position={[-1, 0, -10]}
            scale={10}
            color={"#495057"}
          />
          <Lightformer
            form="rect"
            intensity={10}
            position={[-10, 2, 1]}
            scale={10}
            rotation-y={Math.PI / 2}
          />
          <Lightformer
            form="rect"
            intensity={10}
            position={[10, 0, 1]}
            scale={10}
            rotation-y={Math.PI / 2}
          />
        </group>
      </Environment>

      {/* 
        ⭐️ spotLight は焦点を当てるタイプのライト
            シーン内の特定の場所を照らすために使う 
      */}
      <spotLight
        position={[-2, 10, 5]}
        angle={0.15} // ライトの広がり
        penumbra={1} // 車道の柔らかさ
        decay={0}  // ライトの減衰具合
        intensity={Math.PI * 0.2} // ライトの強さ
        color={"#f8f9fa"}
      />
      <spotLight
        position={[0, -25, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI * 0.2}
        color={"#f8f9fa"}
      />
      <spotLight
        position={[0, 15, 5]}
        angle={0.15}
        penumbra={1}
        decay={0.1}
        intensity={Math.PI * 3}
      />
    </group>
  );
};

export default Lights;
