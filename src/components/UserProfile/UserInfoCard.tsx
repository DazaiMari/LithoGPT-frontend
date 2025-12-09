import { getUserInfoApi } from "@/api";
import {useEffect, useState} from "react";

export default function UserInfoCard() {
    const [userName, setUserName] = useState<string>('');
    const [userEmail, setUserEmail] = useState<string>('');
    const [createTime, setCreateTime] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');
    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await getUserInfoApi();
            if (res.data?.userName) {
                setUserName(res.data.userName);
            }
            if (res.data?.userEmail) {
                setUserEmail(res.data.userEmail);
            }
            if (res.data?.createTime) {
                setCreateTime(res.data.createTime.slice(0, 10));
            }
            if (res.data?.userRole) {
                setUserRole(res.data.userRole);
            }
        }
        fetchUserInfo();
    },[])
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nick Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userName}
              </p>
            </div>


            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userEmail}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userRole}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Join Time
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {createTime}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
