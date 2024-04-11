import { Subscription } from "rxjs";
import Samp from "./samp";

/**
 * Init samp to get server stats later
 *
 * @type {Samp}
 */
export const samp: Samp = new Samp(20000);
export const serverInfo: Subscription = new Subscription();