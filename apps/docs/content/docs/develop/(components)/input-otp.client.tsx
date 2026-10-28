"use client";

import { OTPField, OTPFieldSlot } from "@/components/myds";
import { useState } from "react";

export function InputOTPControlledExample() {
  const [value, setValue] = useState("");

  return (
    <OTPField
      length={4}
      value={value}
      onValueChange={(value) => {
        setValue(value.toUpperCase());
      }}
    >
      <OTPFieldSlot />
      <OTPFieldSlot />
      <OTPFieldSlot />
      <OTPFieldSlot />
    </OTPField>
  );
}
