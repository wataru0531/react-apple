
// PostCSS というツールに対して どのプラグインを使うかを設定
// PostCSS は CSS を処理するツールで、例えば Sass や Tailwind CSS のような CSS の自動生成、変換 を行うことがでる

// 具体的には、下記のようにtailwindのクラスがついたものをビルド時にcssに変換してくれる
{/* 
  <div class="bg-blue-500 text-white p-4 rounded">
    This is a Tailwind-styled div!
  </div> 
*/}


export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
