import {create} from "zustand"
import {createJSONStorage, persist} from "zustand/middleware";
interface UserInfoState {
    avatarUrl: string;
    setAvatarUrl:(url:string)=> void;
    clearAvatarUrl:()=>void;
    userName:string;
    userEmail:string;
    setUserName:(name:string)=>void;
    setUserEmail:(email:string)=>void;
}
export const useUserInfoStore = create<UserInfoState>()(
    persist(
        (set)=>({
            avatarUrl:"",
            setAvatarUrl:(url:string)=> set({avatarUrl:url}),
            clearAvatarUrl:()=>set({avatarUrl:""}),
            userName:"",
            userEmail:"",
            setUserName:(name:string)=>set({userName:name}),
            setUserEmail:(email:string)=>set({userEmail:email}),
        }),
        {
            name: "user_info_storage",
            storage:createJSONStorage(()=>localStorage),
            partialize: (state)=>({avatarUrl:state.avatarUrl, userName:state.userName , userEmail:state.userEmail}),

        }
    )
)