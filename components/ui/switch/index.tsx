"use client";
import React from "react";
import { Switch as RNSwitch, Platform } from "react-native";
import { createSwitch } from "@gluestack-ui/switch";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { withStyleContext } from "@gluestack-ui/nativewind-utils/withStyleContext";
import { withStyleContextAndStates } from "@gluestack-ui/nativewind-utils/withStyleContextAndStates";
import { cssInterop } from "nativewind";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";

const SwitchWrapper = React.forwardRef<
  React.ElementRef<typeof RNSwitch>,
  React.ComponentProps<typeof RNSwitch>
>(({ ...props }, ref) => {
  return <RNSwitch {...props} ref={ref} />;
});

const UISwitch = createSwitch({
  Root:
    Platform.OS === "web"
      ? withStyleContext(SwitchWrapper)
      : withStyleContextAndStates(SwitchWrapper),
});

cssInterop(SwitchWrapper, { className: "style" });

const switchStyle = tva({
  base: "disabled:cursor-not-allowed web:cursor-pointer data-[invalid=true]:rounded-xl data-[invalid=true]:border-2 data-[invalid=true]:border-error-700 data-[focus=true]:outline-0 data-[focus=true]:ring-2 data-[focus=true]:ring-indicator-primary data-[disabled=true]:opacity-40",

  variants: {
    size: {
      sm: "scale-75",
      md: "",
      lg: "scale-125",
    },
  },
});

type ISwitchProps = React.ComponentProps<typeof UISwitch> &
  VariantProps<typeof switchStyle>;
const Switch = React.forwardRef<
  React.ElementRef<typeof UISwitch>,
  ISwitchProps
>(({ className, size = "md", ...props }, ref) => {
  return (
    <UISwitch
      ref={ref}
      {...props}
      className={switchStyle({ size, class: className })}
    />
  );
});

Switch.displayName = "Switch";
export { Switch };
