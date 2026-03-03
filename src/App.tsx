import { invoke } from "@tauri-apps/api/core"
import { useEffect } from "react"

export default function App() {
  useEffect(() => {
    async function fetchContainers() {
      try {
        const containers = await invoke("list_containers")
        console.log("Containers:", containers)
      } catch (error) {
        console.error("Error fetching containers:", error)
      }
    }
    fetchContainers()

    
  }, [])
  return (
    <div>App</div>
  )
}
