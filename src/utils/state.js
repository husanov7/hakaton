import {create} from "zustand"
const useMode = create((set) => ({
    dark:false,
    changeMode: (mode) => set((state) =>({dark: mode})),
}))
export default useMode