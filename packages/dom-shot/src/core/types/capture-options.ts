/**
 * Options for capturing an HTML element to a PNG data URL.
 *
 * Every field is optional: sensible defaults are derived from the element's
 * live computed styles so that captures always blend into their host UI.
 */
export interface CaptureElementOptions {
  /** File name used by `downloadElementAsImage` (sanitized, `.png` enforced). */
  fileName?: string
  /** Frame background paint. Defaults to the nearest opaque ancestor background. */
  backgroundColor?: string
  /** Frame border color. Defaults to the nearest visible ancestor border (theme-variable aware). */
  borderColor?: string
  /**
   * Frame border thickness in CSS pixels.
   * The painted frame replaces the element's own border ring when enabled.
   * Defaults to `1`.
   */
  borderWidth?: number
  /** Device pixel-ratio multiplier for the output canvas. Defaults to `min(devicePixelRatio, 2)`. */
  pixelRatio?: number
  /**
   * CSS custom properties consulted (in order) when deriving the default border color.
   * Defaults to the theme variables the pipeline was built for
   * (`--ant-color-border`, `--ant-color-border-secondary`).
   */
  borderColorVariables?: readonly string[]
  /**
   * Extra class names treated as "do not capture" inside the tree.
   * The built-in skip list (`no-export`, `zeugma-dev-footer`) always applies.
   */
  extraSkipClasses?: readonly string[]
}
