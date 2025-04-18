

export default function UserDropdown() {

  return (
    <div className="relative">
      <div
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src="/images/user/owner.jpg" alt="User" />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">User Name</span>
       
      </div>
    </div>
  );
}
