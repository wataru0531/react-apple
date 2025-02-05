

import { appleImg, bagImg, searchImg } from '../utils';
import { navLists } from '../constants';


const Navbar = () => {
  return (
    <header className="px-5 sm:px-10 py-5 w-full flex justify-between items-center">
      <nav className="screen-max-width w-full flex">
        <img src={ appleImg } alt="apple" width={14} height={18} />
        <div className="flex flex-1 justify-center max-sm:hidden">
          {/* max-sm:hidden 画面幅が 640px 以下（= スマホサイズ）ではこの要素を非表示 */}
          {
            navLists.map(nav => {
              // console.log(nav)
              return (
                <div key={ nav } className="px-5 text-sm text-gray cursor-pointer hover:text-white transition-all">
                  { nav }
                </div>
              )
            })
          }
        </div>
        <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
          <img src={ searchImg } alt="search" width={18} height={18} />
          <img src={ bagImg } alt="bag" width={18} height={18} />
        </div>

      </nav>
    </header>
  )
}

export default Navbar