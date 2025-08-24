import React from 'react'
import { useThemeStore } from '~/store/useThemeStore'
import { THEMES } from '~/utils/constant'
// import CircelColor from './CircelColor'
import { PaletteIcon } from 'lucide-react'

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore()
  const onChangeTheme = (theme) => {
    setTheme(theme)
  }
  return (
    <div className='dropdown'>
      <div tabIndex={0} role='button' className='btn btn-ghost btn-circle m-1'>
        {/* <CircelColor /> */}
        <PaletteIcon className='size-5' />
      </div>
      <div
        tabIndex={0}
        className='dropdown-content mt-2  p-1 right-3 shadow-2xl bg-base-200 backdrop-blur-lg
        w-72 border boder-base-content/80 max-h-80 overflow-y-auto'
      >
        <div className='space-y-1'>
          {THEMES.map((newTheme) => (
            <button
              className={` ${
                theme === newTheme.name
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-base-content/5'
              } w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors`}
              key={newTheme.name}
              onClick={() => onChangeTheme(newTheme.name)}
            >
              <PaletteIcon className='min-w-5 min-h-5' />
              {/* <CircelColor themeName={newTheme.name} colors={newTheme.colors} /> */}
              <span className='text-sm font-medium'>{newTheme.name}</span>
              <div className='ml-auto flex gap-1'>
                {newTheme.colors.map((color, i) => (
                  <span
                    key={i}
                    className=' rounded-full size-2 '
                    style={{
                      backgroundColor: color
                    }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
