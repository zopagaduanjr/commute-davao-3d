declare namespace JSX {
  interface IntrinsicElements {
    'gmp-map-3d': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      heading?: string;
      range?: string;
      tilt?: string;
      center?: string;
    };
    'gmp-polyline-3d': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      'altitude-mode'?: string;
      'stroke-color'?: string;
      'stroke-width'?: string;
    };
  }
}
