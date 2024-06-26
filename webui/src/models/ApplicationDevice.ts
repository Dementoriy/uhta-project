import {Device} from "./index";

declare type ApplicationDevice = {
  applicationNumber?: number,
  device: Device,
  count: number,
  receivedQuantity?: number,
  receiptDate?: number
}
export default ApplicationDevice
