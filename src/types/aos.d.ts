declare module "aos" {
  export interface AosOptions {
    duration?: number;
    easing?: string;
    once?: boolean;
    offset?: number;
  }

  const AOS: {
    init: (options?: AosOptions) => void;
    refresh: () => void;
  };

  export default AOS;
}
