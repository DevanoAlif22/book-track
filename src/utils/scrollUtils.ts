export class ScrollUtils {
  static scrollToTop(behavior: ScrollBehavior = "smooth"): void {
    window.scrollTo({ top: 0, behavior });
  }
}
