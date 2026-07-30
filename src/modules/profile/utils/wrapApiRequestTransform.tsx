import type { ComponentType } from 'react';

export function wrapApiRequestTransform(
  Default: ComponentType<any>,
  props: Record<string, any>,
  transform: (data: unknown) => unknown | Promise<unknown>,
) {
  const { onSuccess, ...rest } = props;

  return (
    <Default
      {...rest}
      onSuccess={async (data: unknown) => {
        const transformed = await transform(data);
        await onSuccess?.(transformed);
      }}
    />
  );
}

export const apiRequestTransformOverride = (transform: (data: unknown) => unknown | Promise<unknown>) =>
  ({
    render: (_props: Record<string, any>, Default: ComponentType<any>) => wrapApiRequestTransform(Default, _props, transform),
  }) as any;
