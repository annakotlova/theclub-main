declare module 'vue-the-mask' {
  import {
    AsyncComponent,
    Component,
    DirectiveFunction,
    DirectiveOptions,
    PluginFunction,
  } from 'vue';

  const TheMask: Component<any, any, any, any> | AsyncComponent<any, any, any, any>;
  const mask: DirectiveFunction | DirectiveOptions;
  const VueTheMask: PluginFunction<any> & {
    TheMask: Component<any, any, any, any> | AsyncComponent<any, any, any, any>;
    mask: DirectiveFunction | DirectiveOptions;
  };

  export { TheMask, mask };
  export default VueTheMask;
}
