import React, { createContext, useState, useContext, ReactNode } from "react";

interface IMyContext {
  signed: boolean;
  setSigned: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyContext = createContext<IMyContext>({
  signed: false,
  setSigned: () => {},
});

type MyContextProviderProps = {
  children: ReactNode;
};

export const useMyContext = () => useContext(MyContext);

// Proveedor de contexto
export const MyContextProvider: React.FC<MyContextProviderProps> = ({
  children,
}) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [signed, setSigned] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  return (
    <MyContext.Provider
      value={{ signed, setSigned }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
