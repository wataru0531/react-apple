
// Tailwind CSS の設定ファイル


/** @type {import('tailwindcss').Config} */
// → TypeScript型注釈で、tailwind.config.js が Tailwind CSSの設定ファイル であることを明示
//   これにより、エディタの補完機能が効き、型チェックが可能になる。
//   TypeScriptを使っていない場合でも、エディタやIDEが設定ファイルを適切に認識できるようになる

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // どのファイルを対象にスタイルを適用するか
  theme: {
    extend: {
      colors: {
        blue: "#2997FF",
        gray: {
          DEFAULT: "#86868b",
          100: "#94928d",
          200: "#afafaf",
          300: "#42424570",
        },
        zinc: "#101010",
      },
    },
  },
  plugins: [],
};