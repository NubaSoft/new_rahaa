// write api call for meals service here

// Path: app/services/meals.ts
// Compare this snippet from app/services/meals.ts:

import { Alert } from "react-native"

import { api } from "./api"
import { getGeneralApiProblem } from "./apiProblem"
import { Packages } from "../types"

interface GuestPackagesApiResponse {
  kind: string
  data?: {
    statusCode: number
    topSubs: Packages[]
  }
}

export const getMealsApi = async () => {
  try {
    const response = await api.get("/api/getTopMeals")
    if (response.status !== 200 || !response.data) {
      const problem: any = getGeneralApiProblem(response)
      if (problem) return problem
    }
    const data = response.data

    return { kind: "ok", data }
  } catch (e) {
    Alert.alert("Error", e.message)
    return { kind: "bad-data" }
  }
}

export const getGuestPackagesApi = async (): Promise<GuestPackagesApiResponse> => {
  try {
    const response = await api.get("/api/getTopSubscription")
    if (response.status !== 200 || !response.data) {
      const problem: any = getGeneralApiProblem(response)
      if (problem) return problem
    }
    console.log("response----------getGuestPackagesApi-------------", response)

    const data = response.data

    return { kind: "ok", data }
  } catch (e) {
    Alert.alert("Error", e.message)
    return { kind: "bad-data" }
  }
}
