import { MdOutlineSchool } from "react-icons/md";

const SessionCheckLoader = () => {
  return (
    <div className="fixed top-0 left-0 min-w-screen min-h-screen flex items-center justify-center">
      <MdOutlineSchool size={60} className="text-green-600 animate-pulse" />
    </div>
  );
};

export default SessionCheckLoader;
