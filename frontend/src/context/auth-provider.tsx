import { useGetCurrentUser } from "@/features/user/hooks/queries/use-get-current-user";
import { UserType } from "@/features/user/types/api.types";
import { createContext, useContext } from "react";

type AuthContextType = {
  user?: UserType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  isLoading: boolean,
  isFetching: boolean,
  refetchAuth: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const  AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

  const {data, error, isLoading, isFetching, refetch} = useGetCurrentUser()
  const user = data?.user

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isFetching,
      error,
      refetchAuth: refetch
    }}>{children}</AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if(!context) {
    throw new Error("useAuthContext must be used within a AuthProvider")
  }
  return context
}