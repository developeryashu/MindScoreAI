import * as React from "react"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[]
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      onValueChange?.([newValue])
    }

    return (
      <input
        type="range"
        ref={ref}
        value={value?.[0] || 0}
        onChange={handleChange}
        className={`h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted ${className || ''}`}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
