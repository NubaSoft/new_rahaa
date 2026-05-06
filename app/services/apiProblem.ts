export type GeneralApiProblem =
  /**
   * Times up.
   */
  | { kind: "timeout"; temporary: true }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: "cannot-connect"; temporary: true }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: "server" }
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: "unauthorized"; data: any }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: "forbidden"; data: any }
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: "not-found"; data: any }
  /**
   * All other 4xx series errors.
   */
  | { kind: "rejected"; data: any }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: "unknown"; temporary: true }
  /**
   * The data we received is not in the expected format.
   */
  | { kind: "bad-data" }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: any): GeneralApiProblem | void {
  switch (response.status) {
    case 401:
      return { kind: "unauthorized", data: response?.data }
    case 403:
      return { kind: "forbidden", data: response?.data }
    case 404:
      return { kind: "not-found", data: response?.data }
    default:
      return { kind: "rejected", data: response.data }
  }
}
