import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {

  return (
    <div className="root-layout pt-30">
      {children}
    </div>
  );
};

export default Layout;
