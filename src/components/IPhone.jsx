
// iPhone

import { Color } from 'three';
import { useEffect, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";

function Model({ scale, item, size }) {
  // nodes → 各メッシュの形状、materials → 各パーツのマテリアルを取得
  // ⭐️ useGLTFで読み込んだらパーツごとに分かれていて、それをnodes, materialsで別れているパーツをgroupを使いまとめる

  const { nodes, materials } = useGLTF("/models/scene.glb");
  // ⭐️nodes → GLTFモデルの中のすべてのメッシュやノード(オブジェクト)を含むオブジェクト
  //         GLTFファイルはシーン内で3Dオブジェクトを階層的に管理しているので、nodes にはその階層に基づいた各オブジェクトが格納されている
  //         例えば、nodes.ttmRoLdJipiIOmf や nodes.DjsDkGiopeiEJZK などのプロパティは、
  //          GLTFモデル内で定義されている各メッシュ（ジオメトリ）を指しており、それぞれに関連する 3D オブジェクトを取り出せる
  // console.log(nodes); // {Sketchfab_Scene: Group, ttmRoLdJipiIOmf: Mesh, DjsDkGiopeiEJZK: Mesh, buRWvyqhBBgcJFo: Mesh, MrMmlCAsAxJpYqQ_0: Mesh, …}
  
  // ⭐️materials → materials は、GLTFモデル内で使用されているマテリアル(素材)を含むオブジェクト
  //             マテリアルは、オブジェクトの外観や質感を決める要素で、色やテクスチャ、反射などの設定を持っている
  //             materialsの各プロパティは、GLTFファイル内で定義されたマテリアルに対応している。
  //              例えば、materials.hUlRcbieVuIiOXG や materials.PaletteMaterial001 などのプロパティには、
  //              実際に使われているマテリアルオブジェクトが格納されていて、
  //              このマテリアルオブジェクトを操作することで、色を変更したり、テクスチャを設定したりできる  
  // console.log(materials); // {hUlRcbieVuIiOXG: MeshStandardMaterial, PaletteMaterial001: MeshStandardMaterial, PaletteMaterial002: MeshStandardMaterial, dxCVrUCvYhjVxqy: MeshStandardMaterial, MHFGNLrDQbTNima: MeshStandardMaterial, …}

  const texture = useTexture(item.img);

  useEffect(() => {
    // Object.entries() → プロパティ: 値; を 配列にする
    // console.log(materials); // {hUlRcbieVuIiOXG: MeshStandardMaterial, PaletteMaterial001: MeshStandardMaterial, PaletteMaterial002: MeshStandardMaterial, dxCVrUCvYhjVxqy: MeshStandardMaterial, MHFGNLrDQbTNima: MeshStandardMaterial, …}
    // console.log(Object.entries(materials)); // (31) [['hUlRcbieVuIiOXG', MeshStandardMaterial], Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
    Object.entries(materials).forEach((material) => {

      // 5つのマテリアルを 除外 し、それ以外のマテリアルの 色を変更。
      if (
        material[0] !== "zFdeDaGNRwzccye" &&
        material[0] !== "ujsvqBWRMnqdwPx" &&
        material[0] !== "hUlRcbieVuIiOXG" &&
        material[0] !== "jlzuBkUzuJqgiAK" &&
        material[0] !== "xNrofRCqOXXHVZt"
      ) {
        // console.log(item.color); // (3) ['#8F8A81', '#FFE7B9', '#6F6C64']
        material[1].color = new Color(item.color[0]);
      }

      // three.js に「マテリアルの変更を適用する」よう通知
      material[1].needsUpdate = true;
    });
  }, [materials, item]);
  
  return (
    // この中で各パーツを１つにしてiPhoneを形作る
    // ⭐️ GLTF のモデルには すでに各パーツの位置情報が含まれている ので、
    //   特に位置を指定しなくても、パーツが正しい位置に配置されて iPhone の形になる 
    <group scale={scale} item={item} size={size} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ttmRoLdJipiIOmf.geometry}
        material={materials.hUlRcbieVuIiOXG}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DjsDkGiopeiEJZK.geometry}
        material={materials.PaletteMaterial001}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.buRWvyqhBBgcJFo.geometry}
        material={materials.PaletteMaterial002}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.MrMmlCAsAxJpYqQ_0.geometry}
        material={materials.dxCVrUCvYhjVxqy}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.wqbHSzWaUxBCwxY_0.geometry}
        material={materials.MHFGNLrDQbTNima}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.QvGDcbDApaGssma.geometry}
        material={materials.kUhjpatHUvkBwfM}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.vFwJFNASGvEHWhs.geometry}
        material={materials.RJoymvEsaIItifI}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.evAxFwhaQUwXuua.geometry}
        material={materials.KSIxMqttXxxmOYl}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.USxQiqZgxHbRvqB.geometry}
        material={materials.mcPrzcBUcdqUybC}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TvgBVmqNmSrFVfW.geometry}
        material={materials.pIhYLPqiSQOZTjn}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.GuYJryuYunhpphO.geometry}
        material={materials.eShKpuMNVJTRrgg}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pvdHknDTGDzVpwc.geometry}
        material={materials.xdyiJLYTYRfJffH}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.CfghdUoyzvwzIum.geometry}
        material={materials.jpGaQNgTtEGkTfo}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DjdhycfQYjKMDyn.geometry}
        material={materials.ujsvqBWRMnqdwPx}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.usFLmqcyrnltBUr.geometry}
        material={materials.sxNzrmuTqVeaXdg}
        scale={0.01}
      />

      {/* 裏面部分のパーツ */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.xXDHkMplTIDAXLN.geometry}
        material={materials.pIJKfZsazmcpEiU}
        scale={0.01}
      >
        <meshStandardMaterial roughness={1} map={texture} />
      </mesh>

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.vELORlCJixqPHsZ.geometry}
        material={materials.zFdeDaGNRwzccye}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.EbQGKrWAqhBHiMv.geometry}
        material={materials.TBLSREBUyLMVtJa}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.EddVrWkqZTlvmci.geometry}
        material={materials.xNrofRCqOXXHVZt}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.KSWlaxBcnPDpFCs.geometry}
        material={materials.yQQySPTfbEJufve}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.TakBsdEjEytCAMK.geometry}
        material={materials.PaletteMaterial003}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.IykfmVvLplTsTEW.geometry}
        material={materials.PaletteMaterial004}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.wLfSXtbwRlBrwof.geometry}
        material={materials.oZRkkORNzkufnGD}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.WJwwVjsahIXbJpU.geometry}
        material={materials.yhcAXNGcJWCqtIS}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.YfrJNXgMvGOAfzz.geometry}
        material={materials.bCgzXjHOanGdTFV}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.DCLCbjzqejuvsqH.geometry}
        material={materials.vhaEJjZoqGtyLdo}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.CdalkzDVnwgdEhS.geometry}
        material={materials.jlzuBkUzuJqgiAK}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.NtjcIgolNGgYlCg.geometry}
        material={materials.PpwUTnTFZJXxCoE}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pXBNoLiaMwsDHRF.geometry}
        material={materials.yiDkEwDSyEhavuP}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.IkoiNqATMVoZFKD.geometry}
        material={materials.hiVunnLeAHkwGEo}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.rqgRAGHOwnuBypi.geometry}
        material={materials.HGhEhpqSBZRnjHC}
        scale={0.01}
      />
    </group>
  );
}

export default Model;

useGLTF.preload("/models/scene.glb");
// →　GLTFモデルを事前にプリロード（読み込み）するための関数。
//    このコードを追加することで、コンポーネントが描画される前に、
//    指定したGLTFファイル（この場合は/models/scene.glb）をバックグラウンドで読み込んでおくことができる