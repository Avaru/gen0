export function scrollToContent(
  element: HTMLElement | undefined,
  block: ScrollLogicalPosition = 'start',
) {
  element?.scrollIntoView({
    block,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}
