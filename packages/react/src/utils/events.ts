import mitt from "mitt";
import type { ToastEvent } from "../components/core/toast";
/*========================================================================================================================*/

type Events = {
  "toast.add": ToastEvent;
};

export const emitter = mitt<Events>();
