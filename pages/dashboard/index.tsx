import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useToast } from "@chakra-ui/react";

import { CREATE_USER } from "../../graphql/createUser.graphql";
import { UPDATE_USER } from "../../graphql/updateUser.graphql";
import { LOGIN } from "../../graphql/login";

import { LoginModal } from "../../components/modal/Login.modal";
import KanbanComponent from "../../components/dashboard/KanbanComponent";
import { getHeader } from "../../utils/helpers";
import { DashboardViewIndex } from "../../enums/enums";
import MyOrganizations from "../../components/dashboard/MyOrganizations";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { t, i18n } = useTranslation();
  const { isConnected, isDisconnected, address } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { id } = router.query;
  const [signUp, { data, loading, error }] = useMutation(CREATE_USER);
  const [
    updateUser,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_USER);
  const [login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOGIN);
  const [dashboardViewIndex, setDashboardViewIndex] =
    useState<DashboardViewIndex>(DashboardViewIndex.ORGANIZATIONS);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [errorCreating, setErrorCreating] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [orgId, setOrgdId] = useState<string>("");
  const [signUpStep, setSignUpStep] = useState<number>(0);

  useEffect(() => {
    if (isDisconnected && openConnectModal) {
      openConnectModal();
      return
    }
    onLogin();
  }, [isConnected, isDisconnected, connectModalOpen]);
  useEffect(() => {
    if (!id || id === undefined) return;
  }, [id]);
  const onLogin = async () => {
    console.log('login');
    
    try {
      const response = await login({
        variables: {
          loginInput: {
            address: address,
          },
        },
      });
      setIsRegistered(true);
      localStorage.setItem("token", response.data.login.token);
    } catch (error) {
      console.error(error);
    }
  };
  const createUser = async () => {
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
  if (dashboardViewIndex === DashboardViewIndex.ORGANIZATIONS && id) {
    return <KanbanComponent 
      id={id as string}
    />;
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
