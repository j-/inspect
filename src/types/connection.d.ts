interface NetworkInformation extends EventTarget {
  /**
   * Returns the type of connection a device is using to communicate with the network. It will be one of the following values:
   * - `bluetooth`
   * - `cellular`
   * - `ethernet`
   * - `none`
   * - `wifi`
   * - `wimax`
   * - `other`
   * - `unknown`
   */
  readonly type: string;

  /** Returns the effective type of the connection meaning one of 'slow-2g', '2g', '3g', or '4g'. This value is determined using a combination of recently observed round-trip time and downlink values. */
  readonly effectiveType: string;

  /** Returns the maximum downlink speed, in megabits per second (Mbps), for the underlying connection technology. */
  readonly downlinkMax: number;

  /** Returns the effective bandwidth estimate in megabits per second, rounded to the nearest multiple of 25 kilobits per seconds. */
  readonly downlink: number;

  /** Returns the estimated effective round-trip time of the current connection, rounded to the nearest multiple of 25 milliseconds. */
  readonly rtt: number;

  /** Returns true if the user has set a reduced data usage option on the user agent. */
  readonly saveData: boolean;
}

interface Navigator {
  readonly connection: NetworkInformation;
}
