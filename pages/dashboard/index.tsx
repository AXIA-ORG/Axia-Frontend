import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useToast } from "@chakra-ui/react";
import { signMessage } from "@wagmi/core";

import { CREATE_USER } from "../../graphql/createUser.graphql";
import { UPDATE_USER } from "../../graphql/updateUser.graphql";
import { LOGIN } from "../../graphql/login";

import { LoginModal } from "../../components/modal/Login.modal";
import KanbanComponent from "../../components/dashboard/KanbanComponent";
import { getHeader } from "../../utils/helpers";
import { DashboardViewIndex } from "../../enums/enums";
import MyOrganizations from "../../components/dashboard/MyOrganizations";
import { useTranslation } from "react-i18next";
import { useMyContext } from "../../contexts/UserContext";
import { RequestSignModal } from "../../components/modal/RequestSign.modal";
import { GET_NONCE } from "../../graphql/getNonce";

const Dashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const { isConnected, isDisconnected, address } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { id } = router.query;
  const { signed, setSigned } = useMyContext();
  const [notCreated, setNotCreated] = useState<boolean>(false);
  const [signUp, { data, loading, error }] = useMutation(CREATE_USER);
  const [
    updateUser,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_USER);
  const [login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOGIN);
  const { data: nonceData, refetch } = useQuery(GET_NONCE, {
    variables: {
      address: address ?? "",
    },
  });
  const [dashboardViewIndex, setDashboardViewIndex] =
    useState<DashboardViewIndex>(DashboardViewIndex.ORGANIZATIONS);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [errorCreating, setErrorCreating] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [orgId, setOrgdId] = useState<string>("");
  const [signUpStep, setSignUpStep] = useState<number>(0);
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    setSigned(false);
    if (!isConnected) {
      if (openConnectModal) openConnectModal();
    } else {
      onLogin();
    }
  }, [isConnected]);

  const onLogin = async () => {
    if (!isConnected) return;
    try {
      const refetchedData = await refetch();
      const nonce = refetchedData?.data?.requestNonce;
      if (!nonce) {
        return;
      }
      await onSignMessage(nonce);
    } catch (error: any) {
      if (error?.message) {
        const _error = JSON.parse(error.message);
        if (_error.code === "err-002") {
          setNotCreated(true);
        }
      }
    }
  };
  const onSignMessage = async (msg: string) => {
    try {
      const signature: string = await signMessage({
        message: msg,
      });
      console.log("signature is ", signature);
      const response = await login({
        variables: {
          loginInput: {
            address: address,
            signature: signature,
            nonce: msg,
          },
        },
      });
      setIsRegistered(true);
      setSigned(true);
      console.log(response.data.login.token);
      localStorage.setItem("token", response.data.login.token);
    } catch (error) {
      setCounter((prevCounter) => {
        if (prevCounter >= 3) return prevCounter;
        setTimeout(() => {
          onSignMessage(msg);
        }, 1000);
        return prevCounter + 1;
      });
      return null;
    }
  };
  const createUser = async () => {
    console.log('enter to createuser');
    
    try {
      const response = await signUp({
        variables: {
          signUpInput: {
            address: address,
            nickname: nickname,
          },
        },
      });
      setSignUpStep(1);
      const token = response?.data?.signUp?.token;
      localStorage.setItem("token", token);
    } catch (e: any) {
      console.log(error?.message);
      if (!error?.message || error?.message === undefined) return;
      setErrorCreating(error?.message);
      toast({
        title: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const pickRole = async (role: string) => {
    try {
      const response = await updateUser({
        variables: {
          updateUserInput: {
            id: data.signUp.user.id,
            primaryRol: role,
          },
        },
        context: getHeader(),
      });
      setIsRegistered(true);
    } catch (error) {
      console.error("error is ", error);
      toast({
        title: "Error picking user role, please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  if (!signed && !notCreated) {
    return <RequestSignModal />;
  }
  if (dashboardViewIndex === DashboardViewIndex.ORGANIZATIONS && id) {
    return <KanbanComponent id={id as string} />;
  }
  return isRegistered ? (
    <>
      {dashboardViewIndex === DashboardViewIndex.ORGANIZATIONS && (
        <MyOrganizations />
      )}
    </>
  ) : (
    <LoginModal
      isOpen={!isRegistered}
      setNickname={setNickname}
      nickname={nickname}
      createUser={createUser}
      signUpStep={signUpStep}
      pickRole={pickRole}
      errorCreating={errorCreating}
      seterrorCreating={setErrorCreating}
    />
  );
};

export default Dashboard;
