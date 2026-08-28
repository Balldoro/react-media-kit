import type { ButtonAttributes } from "@/types";

export function Button(props: ButtonAttributes) {
  return <button type="button" {...props} />;
}
