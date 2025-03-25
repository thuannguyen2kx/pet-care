import { Outlet } from "react-router-dom"

const BaseLayout = () => {
  return (
    <div>
      Base Layout 
      <Outlet />
    </div>
  )
}
export default BaseLayout